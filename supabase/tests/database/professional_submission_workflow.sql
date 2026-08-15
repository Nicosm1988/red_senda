\set ON_ERROR_STOP on

begin;

-- Emulate an auth user that existed before the profile trigger. The fixture is
-- transaction-scoped and uses no password, identity, or deliverable address.
insert into auth.users (
  id,
  aud,
  role,
  email,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa01',
  'authenticated',
  'authenticated',
  'legacy-profile-test@example.invalid',
  '{}'::jsonb,
  jsonb_build_object(
    'display_name', E'  Persona\n  Legada  ',
    'requested_account_type', 'SUPERADMIN',
    'terms_version', '2026-08',
    'terms_accepted_at', '2026-08-01T00:00:00Z'
  ),
  statement_timestamp(),
  statement_timestamp()
);

-- The current trigger populated this row; remove it to reproduce the legacy
-- state while keeping the auth user in place.
delete from public.user_profiles
where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa01';

do $$
declare
  v_profiles_inserted bigint;
  v_user_roles_inserted bigint;
  v_display_name text;
  v_terms_version text;
  v_terms_accepted_at timestamptz;
  v_role_codes text[];
begin
  select b.profiles_inserted, b.user_roles_inserted
  into v_profiles_inserted, v_user_roles_inserted
  from private.backfill_missing_auth_user_profiles() b;

  if v_profiles_inserted <> 1 or v_user_roles_inserted <> 1 then
    raise exception 'Backfill did not repair exactly one legacy auth user: %, %',
      v_profiles_inserted, v_user_roles_inserted;
  end if;

  select up.display_name, up.terms_version, up.terms_accepted_at
  into v_display_name, v_terms_version, v_terms_accepted_at
  from public.user_profiles up
  where up.id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa01';

  if v_display_name <> 'Persona Legada' then
    raise exception 'Backfill display_name was not normalized: %', v_display_name;
  end if;
  if v_terms_version is not null or v_terms_accepted_at is not null then
    raise exception 'Backfill trusted legal-acceptance metadata';
  end if;
  if exists (
    select 1
    from private.legal_acceptances a
    where a.user_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa01'
  ) then
    raise exception 'Backfill created legal evidence from metadata';
  end if;

  select array_agg(r.code order by r.code)
  into v_role_codes
  from public.user_roles ur
  join public.roles r on r.id = ur.role_id
  where ur.user_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa01';

  if v_role_codes is distinct from array['USER']::text[] then
    raise exception 'Backfill trusted requested role metadata: %', v_role_codes;
  end if;

  update public.user_profiles
  set display_name = 'Nombre existente conservado'
  where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa01';

  select b.profiles_inserted, b.user_roles_inserted
  into v_profiles_inserted, v_user_roles_inserted
  from private.backfill_missing_auth_user_profiles() b;

  if v_profiles_inserted <> 0 or v_user_roles_inserted <> 0 then
    raise exception 'Backfill was not idempotent: %, %',
      v_profiles_inserted, v_user_roles_inserted;
  end if;
  if (
    select up.display_name
    from public.user_profiles up
    where up.id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa01'
  ) <> 'Nombre existente conservado' then
    raise exception 'Backfill overwrote an existing user profile';
  end if;

  if has_function_privilege(
    'authenticated',
    'private.backfill_missing_auth_user_profiles()',
    'EXECUTE'
  ) then
    raise exception 'Authenticated unexpectedly has backfill EXECUTE';
  end if;
  if not has_function_privilege(
    'service_role',
    'private.backfill_missing_auth_user_profiles()',
    'EXECUTE'
  ) then
    raise exception 'service_role is missing backfill EXECUTE';
  end if;
end;
$$;

-- Build a complete, non-regulated onboarding fixture for the owner workflow.
insert into auth.users (
  id,
  aud,
  role,
  email,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa02',
  'authenticated',
  'authenticated',
  'submission-owner-test@example.invalid',
  '{}'::jsonb,
  jsonb_build_object('display_name', 'Profesional de prueba'),
  statement_timestamp(),
  statement_timestamp()
);

select public.accept_terms_from_signup_backend(
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa02',
  '2026-08'
);

insert into public.professional_profiles (
  id,
  user_id,
  slug,
  first_name,
  last_name,
  headline,
  bio,
  publication_status,
  verification_state,
  is_demo
)
values (
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb02',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa02',
  'workflow-submission-test',
  'Profesional',
  'Prueba',
  'Perfil transaccional para validar el envío',
  'Perfil completamente ficticio usado sólo dentro de una prueba transaccional del flujo de moderación.',
  'DRAFT',
  'NOT_VERIFIED',
  false
);

insert into public.professional_profile_types (
  professional_profile_id,
  professional_type_id,
  is_primary
)
values (
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb02',
  '20000000-0000-4000-8000-000000000003',
  true
);

insert into public.professional_needs (professional_profile_id, need_id)
values (
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb02',
  '22000000-0000-4000-8000-000000000004'
);

insert into public.professional_services (professional_profile_id, service_id)
values (
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb02',
  '23000000-0000-4000-8000-000000000002'
);

insert into public.professional_modalities (professional_profile_id, modality_id)
values (
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb02',
  '26000000-0000-4000-8000-000000000001'
);

insert into public.professional_languages (
  professional_profile_id,
  language_id,
  proficiency
)
values (
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb02',
  '28000000-0000-4000-8000-000000000001',
  'NATIVE'
);

insert into public.subscriptions (
  id,
  professional_profile_id,
  plan_id,
  status
)
values (
  'cccccccc-cccc-4ccc-8ccc-cccccccccc02',
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb02',
  '2b000000-0000-4000-8000-000000000001',
  'PENDING_PAYMENT'
);

select set_config(
  'request.jwt.claim.sub',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa02',
  true
);
select set_config('request.jwt.claim.role', 'authenticated', true);
select set_config(
  'request.jwt.claims',
  jsonb_build_object(
    'sub', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa02',
    'role', 'authenticated'
  )::text,
  true
);

set local role authenticated;

do $$
declare
  v_status text;
  v_direct_update_rejected boolean := false;
begin
  if (select auth.uid()) is distinct from
     'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa02'::uuid then
    raise exception 'Test JWT did not establish the expected auth.uid()';
  end if;

  begin
    update public.professional_profiles
    set publication_status = 'PENDING_REVIEW'
    where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb02';
  exception
    when insufficient_privilege then
      v_direct_update_rejected := true;
  end;

  if not v_direct_update_rejected then
    raise exception 'Owner direct publication update was not rejected';
  end if;

  select p.publication_status
  into v_status
  from public.professional_profiles p
  where p.id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb02';

  if v_status <> 'DRAFT' then
    raise exception 'Direct owner update changed state to %', v_status;
  end if;
end;
$$;

reset role;

-- Defense in depth: even if a future grant accidentally exposes the state
-- columns, the trigger rejects a forged workflow marker from an owner session.
grant update (publication_status, published_at)
on public.professional_profiles to authenticated;

set local role authenticated;

select set_config(
  'red_senda.professional_profile_workflow',
  'submit_professional_profile',
  true
);

update public.professional_profiles
set publication_status = 'PENDING_REVIEW',
    published_at = null
where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb02';

do $$
declare
  v_status text;
begin
  select p.publication_status
  into v_status
  from public.professional_profiles p
  where p.id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb02';

  if v_status <> 'DRAFT' then
    raise exception 'Forged owner workflow marker changed state to %', v_status;
  end if;
end;
$$;

select set_config('red_senda.professional_profile_workflow', '', true);

select public.submit_professional_profile(
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb02'
);

do $$
declare
  v_status text;
begin
  select p.publication_status
  into v_status
  from public.professional_profiles p
  where p.id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb02';

  if v_status <> 'PENDING_REVIEW' then
    raise exception 'Submission RPC left profile in %', v_status;
  end if;
  if not private.has_any_role(array['PROFESSIONAL']) then
    raise exception 'Submission RPC did not assign PROFESSIONAL';
  end if;
  if coalesce(
    current_setting('red_senda.professional_profile_workflow', true),
    ''
  ) <> '' then
    raise exception 'Submission workflow marker leaked after RPC';
  end if;
end;
$$;

reset role;

rollback;
