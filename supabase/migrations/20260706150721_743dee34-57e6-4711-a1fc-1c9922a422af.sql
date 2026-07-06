
-- Seed / extend bilingual site content
INSERT INTO public.site_content (key, value) VALUES
('hero', jsonb_build_object(
    'title', jsonb_build_object('al', 'Zgjidhje financiare për biznesin tuaj', 'en', 'Financial solutions for your business'),
    'subtitle', jsonb_build_object(
      'al', 'KPT Consulting ofron shërbime profesionale të kontabilitetit, deklarimeve tatimore, regjistrimit të bizneseve, programeve financiare dhe trajnimeve për biznese.',
      'en', 'KPT Consulting delivers professional accounting, tax filing, business registration, financial software and training services for businesses.'
    ),
    'badge', jsonb_build_object('al', 'Kontabilitet • Program • Trajnime', 'en', 'Accounting • Software • Training'),
    'ctaContact', jsonb_build_object('al', 'Na Kontaktoni', 'en', 'Contact Us'),
    'ctaServices', jsonb_build_object('al', 'Shërbimet', 'en', 'Services')
  ))
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

INSERT INTO public.site_content (key, value) VALUES
('about', jsonb_build_object(
    'intro', jsonb_build_object(
      'al', 'KPT Consulting është një kompani e specializuar në kontabilitet, shërbime tatimore dhe konsulencë për biznese. Misioni ynë është të ofrojmë zgjidhje profesionale që ndihmojnë bizneset të menaxhojnë financat me saktësi, transparencë dhe efikasitet.',
      'en', 'KPT Consulting is a company specialized in accounting, tax services and business consulting. Our mission is to deliver professional solutions that help businesses manage their finances with accuracy, transparency and efficiency.'
    ),
    'services', jsonb_build_object(
      'al', 'Ne ofrojmë shërbime në fushën e kontabilitetit, deklarimeve tatimore, regjistrimit të bizneseve, administrimit të pagave, përgatitjes së pasqyrave financiare dhe konsulencës financiare, duke ndërtuar partneritete afatgjata me klientët tanë.',
      'en', 'We offer services in accounting, tax filings, business registration, payroll administration, financial statement preparation and financial consulting, building long-term partnerships with our clients.'
    ),
    'leader', jsonb_build_object(
      'al', 'KPT Consulting udhëhiqet nga Mr. Sc Astrit Qerimi, Kontabilist i Certifikuar dhe Këshilltar Tatimor i Certifikuar, me përvojë në ofrimin e zgjidhjeve profesionale financiare dhe tatimore për biznese. Përkushtimi ynë është të ofrojmë shërbime të sakta, të besueshme dhe në përputhje me legjislacionin në fuqi.',
      'en', 'KPT Consulting is led by Mr. Sc Astrit Qerimi — Certified Accountant and Certified Tax Advisor — with extensive experience delivering professional financial and tax solutions for businesses. Our commitment is to provide accurate, reliable services that are fully compliant with current legislation.'
    )
  ))
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

INSERT INTO public.site_content (key, value) VALUES
('trust', jsonb_build_object('items', jsonb_build_array(
  jsonb_build_object('type', 'stars', 'title_al', 'Klientë të kënaqur', 'title_en', 'Satisfied clients'),
  jsonb_build_object('type', 'icon', 'icon', 'BadgeCheck', 'color', '#0F8B8D', 'title_al', 'Staf i Certifikuar', 'title_en', 'Certified Staff'),
  jsonb_build_object('type', 'stars', 'title_al', 'Besueshmëri dhe Profesionalizëm', 'title_en', 'Reliability and Professionalism'),
  jsonb_build_object('type', 'icon', 'icon', 'ShieldCheck', 'color', '#1F3A5F', 'title_al', 'Në Përputhje me Legjislacionin', 'title_en', 'Fully Legally Compliant'),
  jsonb_build_object('type', 'stars', 'title_al', 'Shërbim me Cilësi të Lartë', 'title_en', 'High Quality Service'),
  jsonb_build_object('type', 'icon', 'icon', 'Briefcase', 'color', '#5B6C7D', 'title_al', 'Biznese të Asistuara', 'title_en', 'Businesses Assisted'),
  jsonb_build_object('type', 'stars', 'title_al', 'Standarde të Larta Profesionale', 'title_en', 'High Professional Standards'),
  jsonb_build_object('type', 'icon', 'icon', 'TrendingUp', 'color', '#F2C94C', 'title_al', 'Përvojë Profesionale', 'title_en', 'Professional Experience')
)))
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- Storage policies for site-images bucket (admin write, public read via signed URLs)
CREATE POLICY "Public read site-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-images');

CREATE POLICY "Admins upload site-images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update site-images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete site-images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
