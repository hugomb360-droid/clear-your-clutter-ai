CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS published_at timestamptz;
CREATE TABLE public.pro_notification_preferences (pro_id uuid PRIMARY KEY REFERENCES public.pro_profiles(user_id) ON DELETE CASCADE, email_enabled boolean NOT NULL DEFAULT false, push_enabled boolean NOT NULL DEFAULT false, updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE ON public.pro_notification_preferences TO authenticated; GRANT ALL ON public.pro_notification_preferences TO service_role;
ALTER TABLE public.pro_notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pro manages alert preferences" ON public.pro_notification_preferences FOR ALL TO authenticated USING(pro_id=auth.uid() AND public.has_role(auth.uid(),'pro')) WITH CHECK(pro_id=auth.uid() AND public.has_role(auth.uid(),'pro'));
CREATE TABLE public.pro_push_devices (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), pro_id uuid NOT NULL REFERENCES public.pro_profiles(user_id) ON DELETE CASCADE, token text UNIQUE NOT NULL CHECK(length(token) BETWEEN 20 AND 4096), created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, DELETE ON public.pro_push_devices TO authenticated; GRANT ALL ON public.pro_push_devices TO service_role;
ALTER TABLE public.pro_push_devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pro manages own devices" ON public.pro_push_devices FOR ALL TO authenticated USING(pro_id=auth.uid() AND public.has_role(auth.uid(),'pro')) WITH CHECK(pro_id=auth.uid() AND public.has_role(auth.uid(),'pro'));
CREATE TABLE public.pro_notifications (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), pro_id uuid NOT NULL REFERENCES public.pro_profiles(user_id) ON DELETE CASCADE, quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE, summary jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), read_at timestamptz, delivery_token uuid NOT NULL DEFAULT gen_random_uuid(), push_state text NOT NULL DEFAULT 'pending' CHECK(push_state IN ('pending','sending','accepted','skipped','failed')), push_error text, attempts integer NOT NULL DEFAULT 0, attempted_at timestamptz, UNIQUE(pro_id,quote_id));
GRANT SELECT(id,pro_id,quote_id,summary,created_at,read_at) ON public.pro_notifications TO authenticated; GRANT UPDATE(read_at) ON public.pro_notifications TO authenticated; GRANT ALL ON public.pro_notifications TO service_role;
ALTER TABLE public.pro_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pro reads own alerts" ON public.pro_notifications FOR SELECT TO authenticated USING(pro_id=auth.uid() AND public.has_role(auth.uid(),'pro'));
CREATE POLICY "Pro marks own alerts read" ON public.pro_notifications FOR UPDATE TO authenticated USING(pro_id=auth.uid() AND public.has_role(auth.uid(),'pro')) WITH CHECK(pro_id=auth.uid() AND public.has_role(auth.uid(),'pro'));
CREATE INDEX pro_notifications_recipient_date ON public.pro_notifications(pro_id,created_at DESC);
CREATE INDEX pro_notifications_pending ON public.pro_notifications(attempted_at) WHERE push_state IN ('pending','failed','sending');
CREATE FUNCTION public.stamp_quote_publication() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN
IF TG_OP='INSERT' THEN NEW.published_at := CASE WHEN NEW.status='published' THEN now() ELSE NULL END;
ELSE NEW.published_at := OLD.published_at; IF NEW.status='published' AND OLD.published_at IS NULL THEN NEW.published_at:=now(); END IF; END IF; RETURN NEW; END $$;
CREATE TRIGGER stamp_quote_publication BEFORE INSERT OR UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.stamp_quote_publication();
CREATE FUNCTION public.dispatch_pro_push_event() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,extensions AS $$ BEGIN
PERFORM net.http_post(url:='https://debarrasfrance.fr/api/public/notifications/new-request',headers:='{"Content-Type":"application/json"}'::jsonb,body:=jsonb_build_object('eventId',NEW.id,'deliveryToken',NEW.delivery_token),timeout_milliseconds:=5000); RETURN NEW; END $$;
CREATE TRIGGER dispatch_pro_push_event AFTER INSERT ON public.pro_notifications FOR EACH ROW EXECUTE FUNCTION public.dispatch_pro_push_event();
CREATE FUNCTION public.notify_pros_on_publication() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,extensions AS $$ DECLARE retry_row record; BEGIN
IF NEW.status<>'published' OR (TG_OP='UPDATE' AND OLD.published_at IS NOT NULL) THEN RETURN NEW; END IF;
INSERT INTO public.pro_notifications(pro_id,quote_id,summary)
SELECT p.user_id,NEW.id,jsonb_build_object('city',NEW.city,'postalCode',NEW.postal_code,'volumeM3',NEW.volume_m3,'priceMin',NEW.price_min,'priceMax',NEW.price_max,'isAi',NEW.ai_analysis IS NOT NULL,'floor',NEW.floor,'hasElevator',NEW.has_elevator,'access',substring(NEW.notes FROM 'Accès : ([^\n]*)'))
FROM public.pro_profiles p WHERE public.has_role(p.user_id,'pro') AND public.pro_covers_postal(p.user_id,NEW.postal_code) ON CONFLICT(pro_id,quote_id) DO NOTHING;
FOR retry_row IN SELECT id,delivery_token FROM public.pro_notifications WHERE push_state IN ('pending','failed','sending') AND created_at < now()-interval '2 minutes' AND (attempted_at IS NULL OR attempted_at < now()-interval '2 minutes') AND attempts<3 ORDER BY attempted_at NULLS FIRST,created_at LIMIT 20 LOOP
PERFORM net.http_post(url:='https://debarrasfrance.fr/api/public/notifications/new-request',headers:='{"Content-Type":"application/json"}'::jsonb,body:=jsonb_build_object('eventId',retry_row.id,'deliveryToken',retry_row.delivery_token),timeout_milliseconds:=5000); END LOOP;
RETURN NEW; END $$;
CREATE TRIGGER notify_pros_on_publication AFTER INSERT OR UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.notify_pros_on_publication();
CREATE FUNCTION public.sector_response_stats(_postal text) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public AS $$ DECLARE result jsonb; BEGIN
IF NOT public.has_role(auth.uid(),'pro') OR NOT public.pro_covers_postal(auth.uid(),_postal) THEN RAISE EXCEPTION 'Forbidden'; END IF;
SELECT jsonb_build_object('sampleCount',count(*),'averageMinutes',avg(extract(epoch FROM (first_response-published_at))/60.0),'periodDays',90) INTO result FROM (
SELECT q.id,q.published_at,min(b.created_at) AS first_response FROM public.quotes q JOIN public.bids b ON b.quote_id=q.id
WHERE left(q.postal_code,2)=left(_postal,2) AND q.published_at IS NOT NULL AND q.published_at>=now()-interval '90 days' AND b.pro_id<>auth.uid() AND b.created_at>=q.published_at AND public.has_role(b.pro_id,'pro') AND public.pro_covers_postal(b.pro_id,q.postal_code)
GROUP BY q.id,q.published_at) responses; RETURN result; END $$;
REVOKE ALL ON FUNCTION public.sector_response_stats(text) FROM PUBLIC,anon; GRANT EXECUTE ON FUNCTION public.sector_response_stats(text) TO authenticated;
REVOKE ALL ON FUNCTION public.notify_pros_on_publication(),public.dispatch_pro_push_event(),public.stamp_quote_publication() FROM PUBLIC,anon,authenticated;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pro_notifications;