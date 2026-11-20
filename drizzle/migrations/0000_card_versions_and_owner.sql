CREATE TABLE public.card_versions (
  kind text PRIMARY KEY CHECK (kind IN ('draft','published')),
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);
CREATE TABLE public.card_owner (
  email text PRIMARY KEY,
  user_id uuid UNIQUE
);
GRANT SELECT ON public.card_versions TO anon;
GRANT SELECT ON public.card_versions TO authenticated;
GRANT ALL ON public.card_versions TO service_role;
GRANT ALL ON public.card_owner TO service_role;
ALTER TABLE public.card_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_owner ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_card_owner()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.card_owner WHERE user_id = auth.uid())
$$;
REVOKE EXECUTE ON FUNCTION public.is_card_owner() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_card_owner() TO authenticated;

CREATE POLICY "Anyone reads the published card" ON public.card_versions FOR SELECT TO anon, authenticated USING (kind = 'published');
CREATE POLICY "Owner reads all versions" ON public.card_versions FOR SELECT TO authenticated USING (public.is_card_owner());

CREATE OR REPLACE FUNCTION public.publish_card(_draft jsonb, _public jsonb)
RETURNS timestamptz LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE t timestamptz := now();
BEGIN
  IF NOT public.is_card_owner() THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501'; END IF;
  INSERT INTO public.card_versions (kind, data, updated_at) VALUES ('draft', _draft, t)
    ON CONFLICT (kind) DO UPDATE SET data = EXCLUDED.data, updated_at = t;
  INSERT INTO public.card_versions (kind, data, updated_at, published_at) VALUES ('published', _public, t, t)
    ON CONFLICT (kind) DO UPDATE SET data = EXCLUDED.data, updated_at = t, published_at = t;
  RETURN t;
END $$;
REVOKE EXECUTE ON FUNCTION public.publish_card(jsonb, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.publish_card(jsonb, jsonb) TO authenticated;

CREATE OR REPLACE FUNCTION public.save_card_draft(_draft jsonb)
RETURNS timestamptz LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE t timestamptz := now();
BEGIN
  IF NOT public.is_card_owner() THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501'; END IF;
  INSERT INTO public.card_versions (kind, data, updated_at) VALUES ('draft', _draft, t)
    ON CONFLICT (kind) DO UPDATE SET data = EXCLUDED.data, updated_at = t;
  RETURN t;
END $$;
REVOKE EXECUTE ON FUNCTION public.save_card_draft(jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.save_card_draft(jsonb) TO authenticated;

CREATE OR REPLACE FUNCTION public.link_card_owner()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.card_owner SET user_id = NEW.id WHERE lower(email) = lower(NEW.email) AND user_id IS NULL;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.link_card_owner() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER on_auth_user_link_card_owner AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.link_card_owner();

INSERT INTO public.card_owner (email) VALUES ('eric.lam@tonric.com');
UPDATE public.card_owner o SET user_id = u.id FROM auth.users u WHERE lower(u.email) = lower(o.email);