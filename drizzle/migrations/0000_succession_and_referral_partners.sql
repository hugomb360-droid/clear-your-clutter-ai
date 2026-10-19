CREATE TABLE public.succession_details (
 quote_id uuid PRIMARY KEY REFERENCES public.quotes(id) ON DELETE CASCADE,
 heir_present boolean NOT NULL,
 remote_keys boolean NOT NULL,
 key_instructions text NOT NULL DEFAULT '' CHECK (length(key_instructions)<=1500),
 valuables text NOT NULL DEFAULT '' CHECK (length(valuables)<=2000),
 furniture_choice text NOT NULL CHECK (furniture_choice IN ('don','revente','don_revente','evacuation')),
 deadline date NOT NULL,
 deadline_reason text NOT NULL CHECK (deadline_reason IN ('vente','bail','autre')),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.succession_details TO authenticated;
GRANT ALL ON public.succession_details TO service_role;
ALTER TABLE public.succession_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY succession_owner_read ON public.succession_details FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.quotes q WHERE q.id=quote_id AND q.client_id=auth.uid()));
CREATE POLICY succession_owner_insert ON public.succession_details FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.quotes q WHERE q.id=quote_id AND q.client_id=auth.uid() AND NOT public.has_role(auth.uid(),'pro')));
CREATE POLICY succession_assigned_read ON public.succession_details FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.bids b WHERE b.quote_id=succession_details.quote_id AND b.pro_id=auth.uid() AND b.status IN ('accepted','awaiting_confirmation','completed','disputed')) OR public.has_role(auth.uid(),'admin'));
CREATE TABLE public.mission_reports (
 bid_id uuid PRIMARY KEY REFERENCES public.bids(id) ON DELETE CASCADE,
 volume_m3 numeric NOT NULL CHECK (volume_m3>0 AND volume_m3<=2000),
 recycling text NOT NULL CHECK (length(recycling) BETWEEN 10 AND 3000),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.mission_reports TO authenticated;
GRANT ALL ON public.mission_reports TO service_role;
ALTER TABLE public.mission_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY report_read_parties ON public.mission_reports FOR SELECT TO authenticated USING (public.is_bid_client(bid_id,auth.uid()) OR public.is_bid_pro(bid_id,auth.uid()) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY report_pro_insert ON public.mission_reports FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.bids b WHERE b.id=bid_id AND b.pro_id=auth.uid() AND b.status='accepted'));
CREATE POLICY report_pro_update ON public.mission_reports FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.bids b WHERE b.id=bid_id AND b.pro_id=auth.uid() AND b.status='accepted')) WITH CHECK (EXISTS (SELECT 1 FROM public.bids b WHERE b.id=bid_id AND b.pro_id=auth.uid() AND b.status='accepted'));
CREATE TABLE public.referral_contacts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 organization text NOT NULL CHECK (length(organization) BETWEEN 2 AND 150),
 profession text NOT NULL CHECK (profession IN ('notaire','agence','ehpad')),
 name text NOT NULL CHECK (length(name) BETWEEN 2 AND 100),
 email text NOT NULL CHECK (length(email)<=255),
 phone text NOT NULL DEFAULT '' CHECK (length(phone)<=30),
 message text NOT NULL CHECK (length(message) BETWEEN 10 AND 3000),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.referral_contacts TO authenticated;
GRANT ALL ON public.referral_contacts TO service_role;
ALTER TABLE public.referral_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY referral_admin_read ON public.referral_contacts FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE OR REPLACE FUNCTION public.limit_referral_submissions() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN
 PERFORM pg_advisory_xact_lock(hashtext(lower(NEW.email)));
 IF (SELECT count(*) FROM public.referral_contacts WHERE lower(email)=lower(NEW.email) AND created_at>now()-interval '1 day')>=3 THEN RAISE EXCEPTION 'Trop de demandes. Réessayez demain.'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER referral_submission_limit BEFORE INSERT ON public.referral_contacts FOR EACH ROW EXECUTE FUNCTION public.limit_referral_submissions();
CREATE POLICY quotes_assigned_read ON public.quotes FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.bids b WHERE b.quote_id=quotes.id AND b.pro_id=auth.uid() AND b.status IN ('accepted','awaiting_confirmation','completed','disputed')));
CREATE POLICY quote_photos_assigned_read ON public.quote_photos FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.bids b WHERE b.quote_id=quote_photos.quote_id AND b.pro_id=auth.uid() AND b.status IN ('accepted','awaiting_confirmation','completed','disputed')));
CREATE POLICY quote_contacts_assigned_read ON public.quote_contacts FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.bids b WHERE b.quote_id=quote_contacts.quote_id AND b.pro_id=auth.uid() AND b.status IN ('accepted','awaiting_confirmation','completed','disputed')));
CREATE OR REPLACE FUNCTION public.create_succession_request(payload jsonb) RETURNS uuid LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$ DECLARE qid uuid; BEGIN
 INSERT INTO public.quotes(client_id,property_type,postal_code,city,desired_date,notes,status) VALUES(auth.uid(),payload->>'propertyType',payload->>'postalCode',payload->>'city',(payload->>'deadline')::date,'Succession · Héritier sur place : ' || CASE WHEN (payload->>'heirPresent')::boolean THEN 'oui' ELSE 'non' END || ' · Remise des clés à distance : ' || CASE WHEN (payload->>'remoteKeys')::boolean THEN 'oui' ELSE 'non' END || ' · Mobilier : ' || (payload->>'furnitureChoice') || ' · Date limite : ' || (payload->>'deadline'),'published') RETURNING id INTO qid;
 INSERT INTO public.quote_contacts(quote_id,full_name,phone,email,address) VALUES(qid,payload->>'fullName',payload->>'phone',payload->>'email',payload->>'address');
 INSERT INTO public.succession_details(quote_id,heir_present,remote_keys,key_instructions,valuables,furniture_choice,deadline,deadline_reason) VALUES(qid,(payload->>'heirPresent')::boolean,(payload->>'remoteKeys')::boolean,payload->>'keyInstructions',payload->>'valuables',payload->>'furnitureChoice',(payload->>'deadline')::date,payload->>'deadlineReason');
 RETURN qid;
END $$;
REVOKE ALL ON FUNCTION public.create_succession_request(jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_succession_request(jsonb) TO authenticated;