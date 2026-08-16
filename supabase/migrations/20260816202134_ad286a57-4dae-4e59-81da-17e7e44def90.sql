REVOKE EXECUTE ON FUNCTION public.is_bid_pro(uuid, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_bid_client(uuid, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.pro_covers_postal(uuid, text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.is_bid_pro(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_bid_client(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.pro_covers_postal(uuid, text) TO authenticated;