ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS title_en text,
  ADD COLUMN IF NOT EXISTS excerpt_en text,
  ADD COLUMN IF NOT EXISTS content_html_en text,
  ADD COLUMN IF NOT EXISTS seo_title_en text,
  ADD COLUMN IF NOT EXISTS seo_description_en text;

-- Recompute reading minutes trigger to use the longer of AL or EN content
CREATE OR REPLACE FUNCTION public.articles_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  al_words integer;
  en_words integer;
  max_words integer;
BEGIN
  NEW.updated_at = now();
  al_words := COALESCE(array_length(
    regexp_split_to_array(
      regexp_replace(coalesce(NEW.content_html, ''), '<[^>]+>', ' ', 'g'),
      '\s+'
    ),
    1
  ), 0);
  en_words := COALESCE(array_length(
    regexp_split_to_array(
      regexp_replace(coalesce(NEW.content_html_en, ''), '<[^>]+>', ' ', 'g'),
      '\s+'
    ),
    1
  ), 0);
  max_words := GREATEST(al_words, en_words);
  NEW.reading_minutes := GREATEST(1, COALESCE(CEIL(max_words::numeric / 200.0)::int, 1));
  RETURN NEW;
END;
$function$;