create or replace function public.get_my_profile_stats()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_items_reported bigint;
begin
  if v_user_id is null then
    raise exception 'Please log in to view profile statistics.';
  end if;

  select count(*)
    into v_items_reported
    from public.items item
    where item.user_id = v_user_id;

  return jsonb_build_object(
    'items_reported', v_items_reported,
    'items_returned', null,
    'successful_matches', null
  );
end;
$$;

revoke all on function public.get_my_profile_stats() from public, anon;
grant execute on function public.get_my_profile_stats() to authenticated;
