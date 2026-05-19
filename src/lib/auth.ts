// User authentication via Supabase Auth.
// Lights up automatically when Supabase env vars are set.

import { cookies } from "next/headers";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { hasSupabase, supabaseAdmin } from "./supabase";

export const USER_COOKIE = "zefaf_user_token";

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
}

// Server-side: read user from cookie
export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!hasSupabase()) return null;
  const c = await cookies();
  const token = c.get(USER_COOKIE)?.value;
  if (!token) return null;
  try {
    const { data, error } = await supabaseAdmin().auth.getUser(token);
    if (error || !data?.user) return null;
    return {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name,
      phone: data.user.user_metadata?.phone,
    };
  } catch {
    return null;
  }
}

// Client-side ephemeral client for sign-up / sign-in
export function supabaseAuth(): SupabaseClient | null {
  if (!hasSupabase()) return null;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
