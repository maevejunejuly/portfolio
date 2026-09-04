/**
 * Read-only PostgREST access. Plain `fetch` rather than @supabase/supabase-js
 * so responses go through Next's data cache and honour `revalidate`.
 */

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "media";

export const REVALIDATE = 60;

export async function select<T>(path: string): Promise<T[]> {
  if (!URL_BASE || !KEY) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set",
    );
  }
  const res = await fetch(`${URL_BASE}/rest/v1/${path}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    next: { revalidate: REVALIDATE },
  });
  if (!res.ok) {
    throw new Error(`Supabase ${res.status} on ${path}: ${await res.text()}`);
  }
  return res.json();
}

/** Public URL for a file in the project's media folder. */
export function assetUrl(slug: string, file: string) {
  return `${URL_BASE}/storage/v1/object/public/${BUCKET}/${slug}/${file}`;
}
