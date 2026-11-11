DROP POLICY IF EXISTS "reviews_select_all" ON public.reviews;
CREATE POLICY "reviews_select_parties" ON public.reviews FOR SELECT TO authenticated
  USING (client_id = (select auth.uid()) OR pro_id = (select auth.uid()) OR public.has_role((select auth.uid()), 'admin'));
REVOKE SELECT ON public.reviews FROM anon;