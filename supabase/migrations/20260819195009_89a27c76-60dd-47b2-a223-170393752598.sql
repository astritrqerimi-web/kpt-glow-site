DROP POLICY IF EXISTS "Public read access to site-images" ON storage.objects;
CREATE POLICY "Public read access to site-images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'site-images');