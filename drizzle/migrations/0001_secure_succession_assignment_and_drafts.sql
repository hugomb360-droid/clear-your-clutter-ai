CREATE OR REPLACE FUNCTION public.is_assigned_quote(_quote_id uuid, _user_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT _user_id=auth.uid() AND EXISTS(SELECT 1 FROM public.bids b WHERE b.quote_id=_quote_id AND b.pro_id=_user_id AND b.status IN ('accepted','awaiting_confirmation','completed','disputed')) $$;
REVOKE ALL ON FUNCTION public.is_assigned_quote(uuid,uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_assigned_quote(uuid,uuid) TO authenticated;
ALTER POLICY quotes_assigned_read ON public.quotes USING (public.is_assigned_quote(id,auth.uid()));
ALTER POLICY quote_photos_assigned_read ON public.quote_photos USING (public.is_assigned_quote(quote_id,auth.uid()));
ALTER POLICY quote_contacts_assigned_read ON public.quote_contacts USING (public.is_assigned_quote(quote_id,auth.uid()));
CREATE OR REPLACE FUNCTION public.create_succession_request(payload jsonb) RETURNS uuid LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$ DECLARE qid uuid; BEGIN
 INSERT INTO public.quotes(client_id,property_type,postal_code,city,desired_date,notes,status) VALUES(auth.uid(),payload->>'propertyType',payload->>'postalCode',payload->>'city',(payload->>'deadline')::date,'Succession · Héritier sur place : ' || CASE WHEN (payload->>'heirPresent')::boolean THEN 'oui' ELSE 'non' END || ' · Remise des clés à distance : ' || CASE WHEN (payload->>'remoteKeys')::boolean THEN 'oui' ELSE 'non' END || ' · Mobilier : ' || (payload->>'furnitureChoice') || ' · Date limite : ' || (payload->>'deadline'),'draft') RETURNING id INTO qid;
 INSERT INTO public.quote_contacts(quote_id,full_name,phone,email,address) VALUES(qid,payload->>'fullName',payload->>'phone',payload->>'email',payload->>'address');
 INSERT INTO public.succession_details(quote_id,heir_present,remote_keys,key_instructions,valuables,furniture_choice,deadline,deadline_reason) VALUES(qid,(payload->>'heirPresent')::boolean,(payload->>'remoteKeys')::boolean,payload->>'keyInstructions',payload->>'valuables',payload->>'furnitureChoice',(payload->>'deadline')::date,payload->>'deadlineReason');
 RETURN qid;
END $$;
ALTER POLICY quote_photos_owner_select ON storage.objects USING (bucket_id='quote-photos' AND ((storage.foldername(name))[1]=auth.uid()::text OR public.has_role(auth.uid(),'admin') OR EXISTS(SELECT 1 FROM public.quote_photos qp WHERE qp.storage_path=storage.objects.name)));
