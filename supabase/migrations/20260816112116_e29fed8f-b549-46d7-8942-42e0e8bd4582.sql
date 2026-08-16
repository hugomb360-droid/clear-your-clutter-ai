-- ROLES
CREATE TYPE public.app_role AS ENUM ('client', 'pro', 'admin');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "user_roles_insert_own_non_admin" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND role <> 'admin');

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- PRO PROFILES
CREATE TABLE public.pro_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  siret text,
  phone text,
  description text,
  service_types text[] NOT NULL DEFAULT '{}',
  postal_codes text[] NOT NULL DEFAULT '{}',
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.pro_profiles TO authenticated;
GRANT ALL ON public.pro_profiles TO service_role;
ALTER TABLE public.pro_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pro_profiles_select_own" ON public.pro_profiles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "pro_profiles_select_verified" ON public.pro_profiles FOR SELECT TO authenticated USING (verified = true);
CREATE POLICY "pro_profiles_insert_own" ON public.pro_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND verified = false);
CREATE POLICY "pro_profiles_update_own" ON public.pro_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.pro_covers_postal(_user_id uuid, _postal text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.pro_profiles p
    WHERE p.user_id = _user_id
      AND EXISTS (
        SELECT 1 FROM unnest(p.postal_codes) z
        WHERE _postal = z OR left(_postal, length(z)) = z
      )
  );
$$;

-- QUOTES
CREATE TABLE public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_type text NOT NULL,
  surface_m2 integer,
  floor integer NOT NULL DEFAULT 0,
  has_elevator boolean NOT NULL DEFAULT false,
  postal_code text NOT NULL,
  city text,
  desired_date date,
  notes text,
  volume_m3 numeric,
  price_min integer,
  price_max integer,
  ai_analysis jsonb,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quotes TO authenticated;
GRANT ALL ON public.quotes TO service_role;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quotes_client_all" ON public.quotes FOR ALL TO authenticated
  USING (client_id = auth.uid()) WITH CHECK (client_id = auth.uid());
CREATE POLICY "quotes_pro_select_zone" ON public.quotes FOR SELECT TO authenticated
  USING (status IN ('published', 'matched') AND public.pro_covers_postal(auth.uid(), postal_code));

CREATE TABLE public.quote_contacts (
  quote_id uuid PRIMARY KEY REFERENCES public.quotes(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  email text,
  address text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.quote_contacts TO authenticated;
GRANT ALL ON public.quote_contacts TO service_role;
ALTER TABLE public.quote_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quote_contacts_client_all" ON public.quote_contacts FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.quotes q WHERE q.id = quote_id AND q.client_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.quotes q WHERE q.id = quote_id AND q.client_id = auth.uid()));

CREATE TABLE public.quote_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.quote_photos TO authenticated;
GRANT ALL ON public.quote_photos TO service_role;
ALTER TABLE public.quote_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quote_photos_client_all" ON public.quote_photos FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.quotes q WHERE q.id = quote_id AND q.client_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.quotes q WHERE q.id = quote_id AND q.client_id = auth.uid()));
CREATE POLICY "quote_photos_pro_select" ON public.quote_photos FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.quotes q WHERE q.id = quote_id
                 AND q.status IN ('published','matched')
                 AND public.pro_covers_postal(auth.uid(), q.postal_code)));

-- BIDS
CREATE TABLE public.bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  pro_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  price integer NOT NULL,
  available_date date,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (quote_id, pro_id)
);
GRANT SELECT, INSERT, UPDATE ON public.bids TO authenticated;
GRANT ALL ON public.bids TO service_role;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bids_pro_select_own" ON public.bids FOR SELECT TO authenticated USING (pro_id = auth.uid());
CREATE POLICY "bids_pro_insert_own" ON public.bids FOR INSERT TO authenticated
  WITH CHECK (pro_id = auth.uid()
    AND public.has_role(auth.uid(), 'pro')
    AND EXISTS (SELECT 1 FROM public.quotes q WHERE q.id = quote_id
                AND q.status IN ('published','matched')
                AND public.pro_covers_postal(auth.uid(), q.postal_code)));
CREATE POLICY "bids_pro_update_own" ON public.bids FOR UPDATE TO authenticated
  USING (pro_id = auth.uid()) WITH CHECK (pro_id = auth.uid());
CREATE POLICY "bids_client_select" ON public.bids FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.quotes q WHERE q.id = quote_id AND q.client_id = auth.uid()));
CREATE POLICY "bids_client_update" ON public.bids FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.quotes q WHERE q.id = quote_id AND q.client_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.quotes q WHERE q.id = quote_id AND q.client_id = auth.uid()));

CREATE POLICY "quote_contacts_pro_accepted" ON public.quote_contacts FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.bids b WHERE b.quote_id = quote_contacts.quote_id
                 AND b.pro_id = auth.uid() AND b.status = 'accepted'));

CREATE POLICY "pro_profiles_select_bidders" ON public.pro_profiles FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.bids b JOIN public.quotes q ON q.id = b.quote_id
                 WHERE b.pro_id = pro_profiles.user_id AND q.client_id = auth.uid()));

-- updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_pro_profiles_updated BEFORE UPDATE ON public.pro_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_quotes_updated BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Création automatique du profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'role',''), 'client')::public.app_role)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- STORAGE POLICIES
CREATE POLICY "quote_photos_owner_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'quote-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "quote_photos_owner_select" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'quote-photos' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'pro')));
CREATE POLICY "quote_photos_owner_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'quote-photos' AND (storage.foldername(name))[1] = auth.uid()::text);