import { createClient, SupabaseClient } from "@supabase/supabase-js";

export function hasSupabase(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

let _admin: SupabaseClient | null = null;

// Server-side client with service role key (bypasses RLS) — for admin actions
export function supabaseAdmin(): SupabaseClient {
  if (_admin) return _admin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  _admin = createClient(url, key, { auth: { persistSession: false } });
  return _admin;
}

// Public client (uses anon key, respects RLS) — for client-side or public reads
let _public: SupabaseClient | null = null;
export function supabasePublic(): SupabaseClient {
  if (_public) return _public;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  _public = createClient(url, key, { auth: { persistSession: false } });
  return _public;
}

export const UPLOADS_BUCKET = "zefaf-uploads";

// Upload a base64 data URI to Supabase storage and return the public URL
export async function uploadDataUrl(dataUrl: string, folder: string): Promise<string> {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid data URL");
  const mime = match[1];
  const buffer = Buffer.from(match[2], "base64");
  const ext = mime.split("/")[1].replace("+xml", "");
  const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

  const { error } = await supabaseAdmin().storage.from(UPLOADS_BUCKET).upload(name, buffer, {
    contentType: mime,
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabaseAdmin().storage.from(UPLOADS_BUCKET).getPublicUrl(name);
  return data.publicUrl;
}
