CREATE TABLE public.cards (
  slug text PRIMARY KEY CHECK (slug ~ '^[a-z0-9-]{2,30}$'),
  display_name text NOT NULL,
  sort int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cards TO anon, authenticated;
GRANT ALL ON public.cards TO service_role;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone lists cards" ON public.cards FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.cards (slug, display_name, sort) VALUES ('eric', 'Eric Lam', 0), ('tony', 'Tony', 1);

ALTER TABLE public.card_versions ADD COLUMN slug text NOT NULL DEFAULT 'eric';
CREATE UNIQUE INDEX card_versions_slug_kind_key ON public.card_versions (slug, kind);

INSERT INTO public.card_owner (email) VALUES ('tony@tonric.com') ON CONFLICT DO NOTHING;
UPDATE public.card_owner o SET user_id = u.id FROM auth.users u WHERE lower(u.email) = lower(o.email) AND o.user_id IS NULL;

CREATE OR REPLACE FUNCTION public.save_card_draft_for(_slug text, _draft jsonb)
RETURNS timestamptz LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE t timestamptz := now();
BEGIN
  IF NOT public.is_card_owner() THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.cards WHERE slug = _slug) THEN RAISE EXCEPTION 'Unknown card'; END IF;
  INSERT INTO public.card_versions (slug, kind, data, updated_at) VALUES (_slug, 'draft', _draft, t)
    ON CONFLICT (slug, kind) DO UPDATE SET data = EXCLUDED.data, updated_at = t;
  RETURN t;
END $$;

CREATE OR REPLACE FUNCTION public.publish_card_for(_slug text, _draft jsonb, _public jsonb)
RETURNS timestamptz LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE t timestamptz := now();
BEGIN
  IF NOT public.is_card_owner() THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.cards WHERE slug = _slug) THEN RAISE EXCEPTION 'Unknown card'; END IF;
  INSERT INTO public.card_versions (slug, kind, data, updated_at) VALUES (_slug, 'draft', _draft, t)
    ON CONFLICT (slug, kind) DO UPDATE SET data = EXCLUDED.data, updated_at = t;
  INSERT INTO public.card_versions (slug, kind, data, updated_at, published_at) VALUES (_slug, 'published', _public, t, t)
    ON CONFLICT (slug, kind) DO UPDATE SET data = EXCLUDED.data, updated_at = t, published_at = t;
  RETURN t;
END $$;

CREATE OR REPLACE FUNCTION public.save_card_draft(_draft jsonb)
RETURNS timestamptz LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$ SELECT public.save_card_draft_for('eric', _draft) $$;
CREATE OR REPLACE FUNCTION public.publish_card(_draft jsonb, _public jsonb)
RETURNS timestamptz LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$ SELECT public.publish_card_for('eric', _draft, _public) $$;

REVOKE EXECUTE ON FUNCTION public.save_card_draft_for(text, jsonb) FROM anon;
REVOKE EXECUTE ON FUNCTION public.publish_card_for(text, jsonb, jsonb) FROM anon;