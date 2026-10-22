DROP POLICY IF EXISTS "Public reads appointment settings" ON public.appointment_settings;
REVOKE SELECT ON public.appointment_settings FROM anon;
