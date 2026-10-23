DROP POLICY IF EXISTS "Public reads site content" ON public.site_content;
CREATE POLICY "Public reads site content" ON public.site_content FOR SELECT TO anon, authenticated USING (key = ANY (ARRAY['company'::text, 'hero'::text, 'about'::text, 'seo'::text, 'trust'::text, 'hero_trust'::text, 'news_home'::text, 'services_section'::text, 'contact_section'::text, 'footer'::text, 'payroll_calculator'::text, 'filing_deadlines'::text]));

CREATE OR REPLACE FUNCTION public.validate_deadlines_content()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  r jsonb;
BEGIN
  IF NEW.key <> 'filing_deadlines' THEN RETURN NEW; END IF;
  IF jsonb_typeof(NEW.value) <> 'object'
     OR jsonb_typeof(NEW.value->'deadlines') <> 'object'
     OR jsonb_typeof(NEW.value->'rates') <> 'object'
     OR jsonb_typeof(NEW.value->'deadlines'->'rows') <> 'array'
     OR jsonb_typeof(NEW.value->'rates'->'rows') <> 'array' THEN
    RAISE EXCEPTION 'invalid_deadlines_settings';
  END IF;
  IF jsonb_array_length(NEW.value->'deadlines'->'rows') > 100 OR jsonb_array_length(NEW.value->'rates'->'rows') > 100 THEN
    RAISE EXCEPTION 'invalid_deadlines_rows';
  END IF;
  FOR r IN SELECT value FROM jsonb_array_elements(NEW.value->'deadlines'->'rows') LOOP
    IF jsonb_typeof(r->'formAl') <> 'string' OR jsonb_typeof(r->'formEn') <> 'string'
       OR jsonb_typeof(r->'abbr') <> 'string'
       OR jsonb_typeof(r->'deadlineAl') <> 'string' OR jsonb_typeof(r->'deadlineEn') <> 'string'
       OR jsonb_typeof(r->'methodAl') <> 'string' OR jsonb_typeof(r->'methodEn') <> 'string'
       OR length(r->>'formAl') > 500 OR length(r->>'formEn') > 500 THEN
      RAISE EXCEPTION 'invalid_deadlines_row';
    END IF;
  END LOOP;
  FOR r IN SELECT value FROM jsonb_array_elements(NEW.value->'rates'->'rows') LOOP
    IF jsonb_typeof(r->'labelAl') <> 'string' OR jsonb_typeof(r->'labelEn') <> 'string'
       OR jsonb_typeof(r->'thresholdAl') <> 'string' OR jsonb_typeof(r->'thresholdEn') <> 'string'
       OR jsonb_typeof(r->'rate') <> 'string' OR jsonb_typeof(r->'section') <> 'boolean'
       OR length(r->>'labelAl') > 500 OR length(r->>'labelEn') > 500 THEN
      RAISE EXCEPTION 'invalid_rates_row';
    END IF;
  END LOOP;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER validate_deadlines_content
  BEFORE INSERT OR UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION validate_deadlines_content();