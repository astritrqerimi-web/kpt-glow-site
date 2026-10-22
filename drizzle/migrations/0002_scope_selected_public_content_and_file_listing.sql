ALTER POLICY "Public reads categories" ON public.article_categories TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.articles a WHERE a.category_slug = article_categories.slug AND a.status = 'published' AND a.published_at IS NOT NULL AND a.published_at <= now()));
ALTER POLICY "Public reads site content" ON public.site_content TO anon, authenticated USING (key IN ('company', 'hero', 'about', 'seo', 'trust', 'hero_trust', 'news_home', 'services_section', 'contact_section', 'footer'));
DROP POLICY "Public read access to site-images" ON storage.objects;
CREATE POLICY "Admins list site-images" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'site-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));
