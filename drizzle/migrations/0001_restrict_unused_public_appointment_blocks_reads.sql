DROP POLICY IF EXISTS "Public reads appointment blocks" ON public.appointment_blocks;
REVOKE SELECT ON public.appointment_blocks FROM anon;
