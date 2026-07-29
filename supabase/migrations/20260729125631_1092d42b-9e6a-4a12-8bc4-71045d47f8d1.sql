DROP POLICY IF EXISTS "Anyone can submit" ON public.contact_messages;

CREATE POLICY "Anyone can submit"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(name) >= 1 AND char_length(name) <= 100
  AND char_length(email) >= 3 AND char_length(email) <= 255
  AND char_length(message) >= 1 AND char_length(message) <= 5000
  AND phone IS NOT NULL
  AND char_length(btrim(phone)) >= 6
  AND char_length(btrim(phone)) <= 30
);