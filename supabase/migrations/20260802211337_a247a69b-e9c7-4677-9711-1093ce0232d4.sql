DROP TRIGGER IF EXISTS on_auth_user_created_grant_kpt_admin ON auth.users;
DROP FUNCTION IF EXISTS public.grant_initial_admin();