-- Empêche qu'un même utilisateur soit à la fois client et pro
CREATE OR REPLACE FUNCTION public.enforce_role_exclusivity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'client'::public.app_role
     AND EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = NEW.user_id AND r.role = 'pro'::public.app_role) THEN
    RAISE EXCEPTION 'Un compte professionnel ne peut pas avoir d''espace client';
  END IF;

  IF NEW.role = 'pro'::public.app_role
     AND EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = NEW.user_id AND r.role = 'client'::public.app_role) THEN
    RAISE EXCEPTION 'Un compte client ne peut pas avoir d''espace professionnel';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_roles_exclusivity ON public.user_roles;
CREATE TRIGGER user_roles_exclusivity
BEFORE INSERT ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.enforce_role_exclusivity();

-- Seuls les comptes clients peuvent déposer une demande de devis
DROP POLICY IF EXISTS quotes_client_all ON public.quotes;

CREATE POLICY quotes_client_select ON public.quotes
FOR SELECT TO authenticated
USING (client_id = auth.uid());

CREATE POLICY quotes_client_insert ON public.quotes
FOR INSERT TO authenticated
WITH CHECK (client_id = auth.uid() AND NOT public.has_role(auth.uid(), 'pro'::public.app_role));

CREATE POLICY quotes_client_update ON public.quotes
FOR UPDATE TO authenticated
USING (client_id = auth.uid())
WITH CHECK (client_id = auth.uid());

CREATE POLICY quotes_client_delete ON public.quotes
FOR DELETE TO authenticated
USING (client_id = auth.uid());