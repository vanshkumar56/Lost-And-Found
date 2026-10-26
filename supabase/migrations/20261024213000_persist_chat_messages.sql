create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  item_id text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create unique index if not exists chat_conversations_item_creator
  on public.chat_conversations (item_id, created_by);

create table if not exists public.chat_participants (
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  last_read_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (length(btrim(body)) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_conversation_created
  on public.chat_messages (conversation_id, created_at);

create or replace function public.is_chat_participant(p_conversation_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.chat_participants participant
    where participant.conversation_id = p_conversation_id
      and participant.user_id = auth.uid()
  );
$$;

revoke all on function public.is_chat_participant(uuid) from public, anon;
grant execute on function public.is_chat_participant(uuid) to authenticated;

alter table public.chat_conversations enable row level security;
alter table public.chat_participants enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists chat_conversations_participant_read on public.chat_conversations;
create policy chat_conversations_participant_read
  on public.chat_conversations for select to authenticated
  using (public.is_chat_participant(id));

drop policy if exists chat_participants_member_read on public.chat_participants;
create policy chat_participants_member_read
  on public.chat_participants for select to authenticated
  using (public.is_chat_participant(conversation_id));

drop policy if exists chat_participants_self_update on public.chat_participants;
create policy chat_participants_self_update
  on public.chat_participants for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists chat_messages_participant_read on public.chat_messages;
create policy chat_messages_participant_read
  on public.chat_messages for select to authenticated
  using (public.is_chat_participant(conversation_id));

drop policy if exists chat_messages_participant_send on public.chat_messages;
create policy chat_messages_participant_send
  on public.chat_messages for insert to authenticated
  with check (
    sender_id = (select auth.uid())
    and public.is_chat_participant(conversation_id)
  );

grant select on public.chat_conversations, public.chat_participants, public.chat_messages
  to authenticated;
grant update (last_read_at) on public.chat_participants to authenticated;
grant insert (conversation_id, sender_id, body) on public.chat_messages to authenticated;

create or replace function public.create_item_conversation(p_item_id text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_owner_id uuid;
  v_conversation_id uuid;
begin
  if v_user_id is null then
    raise exception 'Please log in before starting a conversation.';
  end if;

  select item.user_id
    into v_owner_id
    from public.items item
    where item.id::text = p_item_id;

  if not found or v_owner_id is null then
    raise exception 'This listing is not available for chat.';
  end if;

  if v_owner_id = v_user_id then
    raise exception 'You cannot start a conversation with yourself.';
  end if;

  insert into public.chat_conversations (item_id, created_by)
  values (p_item_id, v_user_id)
  on conflict (item_id, created_by) do nothing;

  select conversation.id
    into v_conversation_id
    from public.chat_conversations conversation
    where conversation.item_id = p_item_id
      and conversation.created_by = v_user_id;

  insert into public.chat_participants (conversation_id, user_id)
  values
    (v_conversation_id, v_user_id),
    (v_conversation_id, v_owner_id)
  on conflict (conversation_id, user_id) do nothing;

  return v_conversation_id;
end;
$$;

revoke all on function public.create_item_conversation(text) from public, anon;
grant execute on function public.create_item_conversation(text) to authenticated;

create or replace function public.get_chat_conversations()
returns table (
  conversation_id uuid,
  item_id text,
  item_title text,
  item_image_url text,
  item_location text,
  other_user_id uuid,
  other_user_name text,
  last_message text,
  last_message_at timestamptz,
  unread_count bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    conversation.id,
    conversation.item_id,
    item.title,
    item.image_url,
    item.location,
    other_participant.user_id,
    coalesce(
      nullif(other_user.raw_user_meta_data ->> 'full_name', ''),
      'Community member'
    ),
    coalesce(latest_message.body, ''),
    coalesce(latest_message.created_at, conversation.created_at),
    (
      select count(*)
      from public.chat_messages unread_message
      where unread_message.conversation_id = conversation.id
        and unread_message.sender_id <> auth.uid()
        and unread_message.created_at > my_participant.last_read_at
    )
  from public.chat_conversations conversation
  join public.chat_participants my_participant
    on my_participant.conversation_id = conversation.id
    and my_participant.user_id = auth.uid()
  join public.chat_participants other_participant
    on other_participant.conversation_id = conversation.id
    and other_participant.user_id <> auth.uid()
  join auth.users other_user on other_user.id = other_participant.user_id
  join public.items item on item.id::text = conversation.item_id
  left join lateral (
    select message.body, message.created_at
    from public.chat_messages message
    where message.conversation_id = conversation.id
    order by message.created_at desc, message.id desc
    limit 1
  ) latest_message on true
  order by coalesce(latest_message.created_at, conversation.created_at) desc;
$$;

revoke all on function public.get_chat_conversations() from public, anon;
grant execute on function public.get_chat_conversations() to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'chat_messages'
     ) then
    alter publication supabase_realtime add table public.chat_messages;
  end if;
end;
$$;
