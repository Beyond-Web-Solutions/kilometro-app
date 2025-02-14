CREATE or replace function delete_user()
	returns void
LANGUAGE SQL SECURITY DEFINER
AS $$
	--delete from public.profiles where id = auth.uid();
delete from auth.users where id = auth.uid();
$$;