DROP POLICY IF EXISTS "quote_photos_owner_select" ON storage.objects;
CREATE POLICY "quote_photos_owner_select" ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'quote-photos' AND (
      (storage.foldername(name))[1] = (select auth.uid())::text
      OR (
        public.has_role((select auth.uid()), 'pro')
        AND EXISTS (SELECT 1 FROM public.quote_photos qp WHERE qp.storage_path = storage.objects.name)
      )
    )
  );