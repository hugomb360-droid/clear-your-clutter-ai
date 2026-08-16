-- Helper: is the current user party to a bid?
CREATE OR REPLACE FUNCTION public.is_bid_pro(_bid_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.bids b WHERE b.id = _bid_id AND b.pro_id = _user_id)
$$;

CREATE OR REPLACE FUNCTION public.is_bid_client(_bid_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.bids b JOIN public.quotes q ON q.id = b.quote_id
    WHERE b.id = _bid_id AND q.client_id = _user_id
  )
$$;

-- MISSION PHOTOS
CREATE TABLE public.mission_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_id uuid NOT NULL REFERENCES public.bids(id) ON DELETE CASCADE,
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('completion','dispute')),
  uploaded_by uuid NOT NULL REFERENCES auth.users(id),
  storage_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mission_photos TO authenticated;
GRANT ALL ON public.mission_photos TO service_role;
ALTER TABLE public.mission_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY mission_photos_select_parties ON public.mission_photos FOR SELECT TO authenticated
USING (public.is_bid_pro(bid_id, auth.uid()) OR public.is_bid_client(bid_id, auth.uid()) OR public.has_role(auth.uid(),'admin'));

CREATE POLICY mission_photos_insert_pro ON public.mission_photos FOR INSERT TO authenticated
WITH CHECK (uploaded_by = auth.uid() AND kind = 'completion' AND public.is_bid_pro(bid_id, auth.uid()));

CREATE POLICY mission_photos_insert_client ON public.mission_photos FOR INSERT TO authenticated
WITH CHECK (uploaded_by = auth.uid() AND kind = 'dispute' AND public.is_bid_client(bid_id, auth.uid()));

-- REVIEWS
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_id uuid NOT NULL UNIQUE REFERENCES public.bids(id) ON DELETE CASCADE,
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES auth.users(id),
  pro_id uuid NOT NULL REFERENCES auth.users(id),
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.reviews TO authenticated;
GRANT SELECT ON public.reviews TO anon;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY reviews_select_all ON public.reviews FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY reviews_insert_client ON public.reviews FOR INSERT TO authenticated
WITH CHECK (client_id = auth.uid() AND public.is_bid_client(bid_id, auth.uid()));
CREATE POLICY reviews_update_client ON public.reviews FOR UPDATE TO authenticated
USING (client_id = auth.uid()) WITH CHECK (client_id = auth.uid());

CREATE TRIGGER reviews_set_updated_at BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- DISPUTES
CREATE TABLE public.disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_id uuid NOT NULL UNIQUE REFERENCES public.bids(id) ON DELETE CASCADE,
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES auth.users(id),
  pro_id uuid NOT NULL REFERENCES auth.users(id),
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_review','resolved','rejected')),
  admin_note text,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.disputes TO authenticated;
GRANT ALL ON public.disputes TO service_role;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY disputes_select_parties ON public.disputes FOR SELECT TO authenticated
USING (client_id = auth.uid() OR pro_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY disputes_insert_client ON public.disputes FOR INSERT TO authenticated
WITH CHECK (client_id = auth.uid() AND public.is_bid_client(bid_id, auth.uid()));
CREATE POLICY disputes_update_admin ON public.disputes FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER disputes_set_updated_at BEFORE UPDATE ON public.disputes
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ADMIN READ ACCESS ACROSS THE PLATFORM
CREATE POLICY quotes_admin_all ON public.quotes FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY bids_admin_all ON public.bids FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY quote_contacts_admin_select ON public.quote_contacts FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY quote_photos_admin_select ON public.quote_photos FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY profiles_admin_select ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY pro_profiles_admin_all ON public.pro_profiles FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY user_roles_admin_select ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin'));

-- STORAGE POLICIES FOR mission-photos (paths prefixed with <quote_id>/...)
CREATE POLICY mission_photos_storage_select ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'mission-photos' AND (
    public.has_role(auth.uid(),'admin')
    OR EXISTS (
      SELECT 1 FROM public.mission_photos mp
      WHERE mp.storage_path = storage.objects.name
        AND (public.is_bid_pro(mp.bid_id, auth.uid()) OR public.is_bid_client(mp.bid_id, auth.uid()))
    )
    OR owner = auth.uid()
  )
);
CREATE POLICY mission_photos_storage_insert ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'mission-photos' AND owner = auth.uid());

-- Grant admin role to the platform owner
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'hugomb360@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;