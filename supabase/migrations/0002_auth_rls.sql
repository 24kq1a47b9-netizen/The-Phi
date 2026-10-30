create or replace function public.current_app_role() returns public.app_role language sql stable security definer set search_path = public as $$ select role from public.user_roles where user_id = auth.uid() limit 1 $$;
create or replace function public.is_manager_of(target_employee uuid) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.manager_employee_assignments where manager_id = auth.uid() and employee_id = target_employee) $$;

alter table public.manager_employee_assignments enable row level security;
alter table public.agreement_templates enable row level security;
alter table public.biometric_consents enable row level security;
alter table public.biometric_events enable row level security;
alter table public.agreement_files enable row level security;
alter table public.notifications enable row level security;
alter table public.signing_sessions enable row level security;

create policy roles_self_read on public.user_roles for select using (user_id = auth.uid() or public.current_app_role() = 'ADMIN');
create policy assignments_visible on public.manager_employee_assignments for select using (manager_id = auth.uid() or employee_id = auth.uid() or public.current_app_role() = 'ADMIN');
create policy templates_authorized_read on public.agreement_templates for select using (public.current_app_role() in ('ADMIN','MANAGER'));
create policy biometric_consent_self_read on public.biometric_consents for select using (user_id = auth.uid() or public.current_app_role() = 'ADMIN');
create policy biometric_events_self_read on public.biometric_events for select using (user_id = auth.uid() or public.current_app_role() = 'ADMIN');
create policy notifications_self_read on public.notifications for select using (user_id = auth.uid());
create policy signing_sessions_self_read on public.signing_sessions for select using (user_id = auth.uid() or public.current_app_role() = 'ADMIN');
create policy files_party_read on public.agreement_files for select using (exists (select 1 from public.agreement_parties p where p.agreement_id = agreement_id and p.user_id = auth.uid()) or public.current_app_role() = 'ADMIN');
