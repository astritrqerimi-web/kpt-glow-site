
REVOKE EXECUTE ON FUNCTION public.publish_due_articles() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.publish_due_articles() TO service_role;
