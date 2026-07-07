
-- 1) Create private schema for security-definer helpers
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, anon, service_role;

-- 2) Recreate has_role in private schema
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, anon, service_role;

-- 3) Update public policies to use private.has_role
DROP POLICY IF EXISTS "Public reads active services" ON public.services;
CREATE POLICY "Public reads active services" ON public.services
  FOR SELECT TO anon, authenticated
  USING ((is_active = true) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage services" ON public.services;
CREATE POLICY "Admins manage services" ON public.services
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins write site content" ON public.site_content;
CREATE POLICY "Admins write site content" ON public.site_content
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins read messages" ON public.contact_messages;
CREATE POLICY "Admins read messages" ON public.contact_messages
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins update messages" ON public.contact_messages;
CREATE POLICY "Admins update messages" ON public.contact_messages
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins delete messages" ON public.contact_messages;
CREATE POLICY "Admins delete messages" ON public.contact_messages
  FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- 4) Storage: drop duplicates + public listing, recreate with private.has_role
DROP POLICY IF EXISTS "Admins delete site images" ON storage.objects;
DROP POLICY IF EXISTS "Admins update site images" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload site images" ON storage.objects;
DROP POLICY IF EXISTS "Public read site images" ON storage.objects;
DROP POLICY IF EXISTS "Public read site-images" ON storage.objects;

DROP POLICY IF EXISTS "Admins delete site-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins update site-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload site-images" ON storage.objects;

CREATE POLICY "Admins upload site-images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins update site-images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'site-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins delete site-images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'site-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));

-- Note: no SELECT policy on storage.objects for site-images.
-- The bucket remains public (files served via public URL) but listing via the API is blocked.

-- 5) Drop old public.has_role now that nothing references it
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- 6) Explicit deny policies on user_roles for INSERT/UPDATE/DELETE
CREATE POLICY "Deny user role inserts" ON public.user_roles
  FOR INSERT TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "Deny user role updates" ON public.user_roles
  FOR UPDATE TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Deny user role deletes" ON public.user_roles
  FOR DELETE TO anon, authenticated
  USING (false);
