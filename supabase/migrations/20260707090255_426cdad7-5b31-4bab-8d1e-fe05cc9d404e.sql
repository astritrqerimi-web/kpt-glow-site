
-- ============================================================
-- article_categories
-- ============================================================
CREATE TABLE public.article_categories (
  slug text PRIMARY KEY,
  name_al text NOT NULL,
  name_en text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.article_categories TO anon, authenticated;
GRANT ALL ON public.article_categories TO service_role;

ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads categories"
  ON public.article_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage categories"
  ON public.article_categories FOR ALL
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.article_categories (slug, name_al, name_en, sort_order) VALUES
  ('atk',                'ATK',                    'ATK',                       10),
  ('tatime',             'Tatime',                 'Taxes',                     20),
  ('tvsh',               'TVSH',                   'VAT',                       30),
  ('ligje-udhezime',     'Ligje & Udhëzime',       'Laws & Guidelines',         40),
  ('subvencione-grante', 'Subvencione & Grante',   'Subsidies & Grants',        50),
  ('kontabilitet',       'Kontabilitet',           'Accounting',                60),
  ('financa',            'Financa',                'Finance',                   70),
  ('punesim',            'Punësim',                'Employment',                80),
  ('njoftime',           'Njoftime',               'Announcements',             90);

-- ============================================================
-- articles
-- ============================================================
CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  category_slug text NOT NULL REFERENCES public.article_categories(slug) ON UPDATE CASCADE,

  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content_html text NOT NULL DEFAULT '',

  cover_image_url text,
  og_image_url text,
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,

  tags text[] NOT NULL DEFAULT '{}',
  author text NOT NULL DEFAULT 'KPT Consulting',
  reading_minutes integer NOT NULL DEFAULT 1,

  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','scheduled')),
  published_at timestamptz,
  scheduled_at timestamptz,

  is_featured boolean NOT NULL DEFAULT false,
  is_sticky boolean NOT NULL DEFAULT false,

  seo_title text,
  seo_description text,

  comments_enabled boolean NOT NULL DEFAULT false,
  views_count integer NOT NULL DEFAULT 0,

  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX articles_status_pub_idx ON public.articles (status, published_at DESC);
CREATE INDEX articles_category_idx ON public.articles (category_slug);
CREATE INDEX articles_sticky_idx ON public.articles (is_sticky) WHERE is_sticky = true;

GRANT SELECT ON public.articles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Public can only read published & already-live rows
CREATE POLICY "Public reads published articles"
  ON public.articles FOR SELECT
  TO anon, authenticated
  USING (
    status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

-- Admins bypass and manage everything
CREATE POLICY "Admins read all articles"
  ON public.articles FOR SELECT
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins insert articles"
  ON public.articles FOR INSERT
  TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update articles"
  ON public.articles FOR UPDATE
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete articles"
  ON public.articles FOR DELETE
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- Triggers: updated_at + reading_minutes
-- ============================================================
CREATE OR REPLACE FUNCTION public.articles_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  words integer;
BEGIN
  NEW.updated_at = now();
  -- crude word count from HTML content (~200 wpm)
  words := array_length(
    regexp_split_to_array(
      regexp_replace(coalesce(NEW.content_html, ''), '<[^>]+>', ' ', 'g'),
      '\s+'
    ),
    1
  );
  NEW.reading_minutes := GREATEST(1, COALESCE(CEIL(words::numeric / 200.0)::int, 1));
  RETURN NEW;
END;
$$;

CREATE TRIGGER articles_updated_at
BEFORE INSERT OR UPDATE ON public.articles
FOR EACH ROW EXECUTE FUNCTION public.articles_set_updated_at();

-- ============================================================
-- Auto-publish scheduled articles via pg_cron
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION public.publish_due_articles()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.articles
  SET status = 'published',
      published_at = COALESCE(published_at, scheduled_at, now())
  WHERE status = 'scheduled'
    AND scheduled_at IS NOT NULL
    AND scheduled_at <= now();
$$;

-- (Re)schedule cron job
DO $$
BEGIN
  PERFORM cron.unschedule('publish-due-articles')
  WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'publish-due-articles');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'publish-due-articles',
  '*/5 * * * *',
  $$SELECT public.publish_due_articles();$$
);
