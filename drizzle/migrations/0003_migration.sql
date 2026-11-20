ALTER TABLE public.card_versions DROP CONSTRAINT card_versions_pkey;
ALTER TABLE public.card_versions ADD CONSTRAINT card_versions_pkey PRIMARY KEY USING INDEX card_versions_slug_kind_key;