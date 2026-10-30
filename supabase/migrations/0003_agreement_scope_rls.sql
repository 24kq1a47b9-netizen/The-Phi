alter table public.agreements add constraint agreements_terms_hash_format check (terms_hash is null or terms_hash ~ '^[0-9a-f]{64}$');
create policy agreements_admin_read on public.agreements for select using (public.current_app_role() = 'ADMIN');
create policy agreements_manager_scope_read on public.agreements for select using (public.current_app_role() = 'MANAGER' and exists (select 1 from public.agreement_parties p where p.agreement_id = id and (p.user_id = auth.uid() or public.is_manager_of(p.user_id))));
create policy parties_self_or_admin_read on public.agreement_parties for select using (user_id = auth.uid() or public.current_app_role() = 'ADMIN' or (public.current_app_role() = 'MANAGER' and public.is_manager_of(user_id)));
create policy audit_admin_read on public.audit_events for select using (public.current_app_role() = 'ADMIN');
