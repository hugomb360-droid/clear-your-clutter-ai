CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_id uuid NOT NULL UNIQUE REFERENCES public.bids(id) ON DELETE CASCADE,
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pro_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_total integer NOT NULL,
  commission_amount integer NOT NULL,
  pro_amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'eur',
  status text NOT NULL DEFAULT 'pending',
  environment text NOT NULL DEFAULT 'sandbox',
  stripe_session_id text,
  stripe_payment_intent_id text,
  paid_at timestamptz,
  released_at timestamptz,
  refunded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_pro ON public.payments(pro_id);
CREATE INDEX idx_payments_client ON public.payments(client_id);

GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY payments_select_parties ON public.payments FOR SELECT TO authenticated
USING (client_id = auth.uid() OR pro_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY payments_admin_all ON public.payments FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER payments_set_updated_at BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();