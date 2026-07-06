
CREATE OR REPLACE FUNCTION public.grant_initial_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'info@kptconsulting.al' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_grant_kpt_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_grant_kpt_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_initial_admin();

-- Also grant admin if the user already exists in auth.users
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE lower(email) = 'info@kptconsulting.al'
ON CONFLICT (user_id, role) DO NOTHING;
