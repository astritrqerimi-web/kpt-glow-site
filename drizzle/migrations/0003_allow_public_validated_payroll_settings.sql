ALTER POLICY "Public reads site content" ON public.site_content TO anon, authenticated USING (key IN ('company','hero','about','seo','trust','hero_trust','news_home','services_section','contact_section','footer','payroll_calculator'));
CREATE OR REPLACE FUNCTION public.validate_payroll_content() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $fn$
DECLARE b jsonb; item record; previous numeric := 0; bound numeric; rate numeric; idx integer := 0; total integer;
BEGIN
 IF NEW.key <> 'payroll_calculator' THEN RETURN NEW; END IF;
 IF jsonb_typeof(NEW.value) <> 'object' OR jsonb_typeof(NEW.value->'texts') <> 'object' OR jsonb_typeof(NEW.value->'brackets') <> 'array' THEN RAISE EXCEPTION 'invalid_payroll_settings'; END IF;
 FOR item IN SELECT * FROM jsonb_each(NEW.value->'texts') LOOP
  IF jsonb_typeof(item.value->'al') <> 'string' OR jsonb_typeof(item.value->'en') <> 'string' OR length(item.value->>'al') > 4000 OR length(item.value->>'en') > 4000 THEN RAISE EXCEPTION 'invalid_payroll_text'; END IF;
 END LOOP;
 IF NOT (NEW.value ?& ARRAY['employeeRate','employerRate','secondaryRate','minimumWage','employerMinimumRate','effectiveFrom','sourceUrl']) THEN RAISE EXCEPTION 'invalid_payroll_settings'; END IF;
 IF (NEW.value->>'employeeRate')::numeric NOT BETWEEN 5 AND 15 OR (NEW.value->>'employerRate')::numeric NOT BETWEEN 5 AND 15 OR (NEW.value->>'secondaryRate')::numeric NOT BETWEEN 0 AND 100 OR (NEW.value->>'employerMinimumRate')::numeric NOT BETWEEN 0 AND 100 OR (NEW.value->>'minimumWage')::numeric NOT BETWEEN 0 AND 100000 THEN RAISE EXCEPTION 'invalid_payroll_rate'; END IF;
 IF NEW.value->>'sourceUrl' NOT LIKE 'https://%' OR NEW.value->>'effectiveFrom' !~ '^\d{4}-\d{2}-\d{2}$' THEN RAISE EXCEPTION 'invalid_payroll_source'; END IF;
 total := jsonb_array_length(NEW.value->'brackets');
 IF total NOT BETWEEN 1 AND 12 THEN RAISE EXCEPTION 'invalid_payroll_brackets'; END IF;
 FOR b IN SELECT value FROM jsonb_array_elements(NEW.value->'brackets') LOOP
  idx := idx + 1;
  IF NOT (b ?& ARRAY['upTo','rate']) OR jsonb_typeof(b->'rate') <> 'number' THEN RAISE EXCEPTION 'invalid_payroll_brackets'; END IF;
  rate := (b->>'rate')::numeric;
  IF rate NOT BETWEEN 0 AND 100 THEN RAISE EXCEPTION 'invalid_payroll_brackets'; END IF;
  IF b->'upTo' = 'null'::jsonb THEN
   IF idx <> total THEN RAISE EXCEPTION 'invalid_payroll_brackets'; END IF;
  ELSE
   bound := (b->>'upTo')::numeric;
   IF bound <= previous OR idx = total THEN RAISE EXCEPTION 'invalid_payroll_brackets'; END IF;
   previous := bound;
  END IF;
 END LOOP;
 RETURN NEW;
END;
$fn$;
CREATE TRIGGER validate_payroll_content BEFORE INSERT OR UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.validate_payroll_content();