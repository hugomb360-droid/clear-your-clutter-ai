ALTER TABLE public.pro_profiles ADD COLUMN public_slug text, ADD COLUMN public_enabled boolean NOT NULL DEFAULT true, ADD COLUMN logo_path text, ADD COLUMN portfolio_paths text[] NOT NULL DEFAULT '{}', ADD COLUMN siret_document_path text, ADD COLUMN insurance_document_path text, ADD COLUMN siret_verified boolean NOT NULL DEFAULT false, ADD COLUMN insurance_verified boolean NOT NULL DEFAULT false;
UPDATE public.pro_profiles SET public_slug = trim(both '-' from regexp_replace(lower(translate(company_name,'àâäéèêëîïôöùûüç','aaaeeeeiioouuuc')),'[^a-z0-9]+','-','g')) || '-' || left(user_id::text,8), public_enabled = company_name NOT ILIKE '%test%';
CREATE UNIQUE INDEX pro_public_slug_unique ON public.pro_profiles(public_slug);
CREATE FUNCTION public.pro_public_profile_guard() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN
IF TG_OP='INSERT' THEN NEW.public_slug := coalesce(nullif(trim(both '-' from regexp_replace(lower(translate(NEW.company_name,'àâäéèêëîïôöùûüç','aaaeeeeiioouuuc')),'[^a-z0-9]+','-','g')),''),'entreprise') || '-' || left(NEW.user_id::text,8); END IF;
IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(),'admin') THEN
IF TG_OP='INSERT' THEN NEW.siret_verified:=false; NEW.insurance_verified:=false;
ELSIF NEW.siret_verified IS DISTINCT FROM OLD.siret_verified OR NEW.insurance_verified IS DISTINCT FROM OLD.insurance_verified OR NEW.verified IS DISTINCT FROM OLD.verified OR NEW.public_slug IS DISTINCT FROM OLD.public_slug THEN RAISE EXCEPTION 'Seul un administrateur peut vérifier les justificatifs ou modifier le lien'; END IF;
END IF;
IF TG_OP='UPDATE' THEN IF NEW.siret IS DISTINCT FROM OLD.siret OR NEW.siret_document_path IS DISTINCT FROM OLD.siret_document_path THEN NEW.siret_verified:=false; END IF; IF NEW.insurance_document_path IS DISTINCT FROM OLD.insurance_document_path THEN NEW.insurance_verified:=false; END IF; END IF;
IF NEW.siret_verified AND (NEW.siret IS NULL OR NEW.siret_document_path IS NULL) THEN RAISE EXCEPTION 'Justificatif SIRET requis'; END IF;
IF NEW.insurance_verified AND NEW.insurance_document_path IS NULL THEN RAISE EXCEPTION 'Attestation assurance requise'; END IF;
IF NEW.logo_path IS NOT NULL AND NEW.logo_path NOT LIKE NEW.user_id::text || '/%' THEN RAISE EXCEPTION 'Logo invalide'; END IF;
IF EXISTS(SELECT 1 FROM unnest(NEW.portfolio_paths) p WHERE p NOT LIKE NEW.user_id::text || '/%') THEN RAISE EXCEPTION 'Photo invalide'; END IF;
IF NEW.siret_document_path IS NOT NULL AND NEW.siret_document_path NOT LIKE NEW.user_id::text || '/%' THEN RAISE EXCEPTION 'Document invalide'; END IF;
IF NEW.insurance_document_path IS NOT NULL AND NEW.insurance_document_path NOT LIKE NEW.user_id::text || '/%' THEN RAISE EXCEPTION 'Document invalide'; END IF;
RETURN NEW; END $$;
CREATE TRIGGER pro_public_profile_guard BEFORE INSERT OR UPDATE ON public.pro_profiles FOR EACH ROW EXECUTE FUNCTION public.pro_public_profile_guard();
CREATE FUNCTION public.list_public_professionals() RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
SELECT coalesce(jsonb_agg(jsonb_build_object('slug',p.public_slug,'company_name',p.company_name,'description',p.description,'postal_codes',p.postal_codes,'service_types',p.service_types,'logo_path',p.logo_path,'portfolio_paths',p.portfolio_paths,'siret_verified',p.siret_verified,'insurance_verified',p.insurance_verified,'completed_count',(SELECT count(*) FROM public.bids b WHERE b.pro_id=p.user_id AND b.status='completed'),'reviews',coalesce((SELECT jsonb_agg(jsonb_build_object('rating',r.rating,'comment',r.comment,'created_at',r.created_at) ORDER BY r.created_at DESC) FROM public.reviews r JOIN public.bids b ON b.id=r.bid_id WHERE r.pro_id=p.user_id AND b.status='completed'),'[]'::jsonb)) ORDER BY p.company_name),'[]'::jsonb) FROM public.pro_profiles p WHERE p.public_enabled AND public.has_role(p.user_id,'pro'); $$;
REVOKE ALL ON FUNCTION public.list_public_professionals() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_public_professionals() TO anon,authenticated,service_role;
CREATE POLICY pro_media_owner ON storage.objects FOR ALL TO authenticated USING(bucket_id='pro-public-media' AND (storage.foldername(name))[1]=auth.uid()::text AND public.has_role(auth.uid(),'pro')) WITH CHECK(bucket_id='pro-public-media' AND (storage.foldername(name))[1]=auth.uid()::text AND public.has_role(auth.uid(),'pro'));
CREATE POLICY pro_media_public_read ON storage.objects FOR SELECT TO anon,authenticated USING(bucket_id='pro-public-media' AND EXISTS(SELECT 1 FROM public.pro_profiles p WHERE p.public_enabled AND (p.logo_path=name OR name=ANY(p.portfolio_paths))));
CREATE POLICY pro_documents_owner ON storage.objects FOR ALL TO authenticated USING(bucket_id='pro-verification-documents' AND (storage.foldername(name))[1]=auth.uid()::text AND public.has_role(auth.uid(),'pro')) WITH CHECK(bucket_id='pro-verification-documents' AND (storage.foldername(name))[1]=auth.uid()::text AND public.has_role(auth.uid(),'pro'));
CREATE POLICY pro_documents_admin ON storage.objects FOR SELECT TO authenticated USING(bucket_id='pro-verification-documents' AND public.has_role(auth.uid(),'admin'));
CREATE FUNCTION public.is_public_pro_media(path text) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT EXISTS(SELECT 1 FROM public.pro_profiles p WHERE p.public_enabled AND (p.logo_path=path OR path=ANY(p.portfolio_paths))); $$;
REVOKE ALL ON FUNCTION public.is_public_pro_media(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_public_pro_media(text) TO anon,authenticated,service_role;
ALTER POLICY pro_media_public_read ON storage.objects USING(bucket_id='pro-public-media' AND public.is_public_pro_media(name));