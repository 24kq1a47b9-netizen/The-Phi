import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { NextFunction, Request, Response } from 'express';

export type AuthenticatedRequest = Request & { user?: User; supabase?: SupabaseClient };

export function createServerSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.header('authorization')?.replace(/^Bearer\s+/i, '');
  const client = createServerSupabase();
  if (!token || !client) return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Authentication is required' } });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Authentication is required' } });
  req.user = data.user;
  req.supabase = client;
  return next();
}

export function requireRole(...roles: string[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.supabase) return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Authentication is required' } });
    const { data, error } = await req.supabase.from('user_roles').select('role').eq('user_id', req.user.id).maybeSingle();
    if (error || !data || !roles.includes(data.role)) return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'You do not have permission for this action' } });
    return next();
  };
}
