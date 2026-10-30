import crypto from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function createPrivilegedSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
}

export function hashTerms(value: unknown): string {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

export function referenceNumber(): string {
  return `TP-${new Date().getUTCFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

export async function isAuthorizedCreator(db: SupabaseClient, actorId: string, employeeId: string, role: string) {
  if (role === 'ADMIN') return true;
  if (role !== 'MANAGER') return false;
  const { data } = await db.from('manager_employee_assignments').select('employee_id').eq('manager_id', actorId).eq('employee_id', employeeId).maybeSingle();
  return Boolean(data);
}
