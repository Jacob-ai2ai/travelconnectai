export const hasSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

let _client: any = null;

async function getClient() {
  if (_client) return _client;
  if (!hasSupabase) return null;
  const mod = await import('@supabase/supabase-js');
  _client = mod.createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
  return _client;
}

export async function signInWithPassword(opts: { email: string; password: string }) {
  const c = await getClient();
  if (!c) return { data: null, error: { message: 'Supabase not configured' } };
  return c.auth.signInWithPassword(opts);
}

export async function signUp(opts: { email: string; password: string; options?: any }) {
  const c = await getClient();
  if (!c) return { data: null, error: { message: 'Supabase not configured' } };
  return c.auth.signUp(opts);
}

export async function signInWithOAuth(provider: string) {
  const c = await getClient();
  if (!c) return { data: null, error: { message: 'Supabase not configured' } };
  return c.auth.signInWithOAuth({ provider });
}

export async function getSession() {
  const c = await getClient();
  if (!c) return { data: null };
  return c.auth.getSession();
}

export default {
  hasSupabase,
  signInWithPassword,
  signUp,
  signInWithOAuth,
  getSession,
};
