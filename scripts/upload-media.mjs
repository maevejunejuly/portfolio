/**
 * Uploads project media to the Supabase `media` bucket as <slug>/<name>.
 * Needs SUPABASE_SERVICE_ROLE_KEY (anon is read-only on storage.objects).
 *
 *   node --env-file=.env.local scripts/upload-media.mjs
 */
import { readFile } from "node:fs/promises";
import { basename, extname } from "node:path";

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "media";

if (!URL_BASE || !KEY) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
}

// local file -> storage path
const FILES = {
  "public/media/kintsugi-hero.png": "kintsugi/hero.png",
  "public/media/kintsugi-prompt.png": "kintsugi/prompt.png",
  "public/media/kintsugi-tree.png": "kintsugi/tree.png",
  "public/media/kintsugi-explore.png": "kintsugi/explore.png",
  "public/media/kintsugi-profile.png": "kintsugi/profile.png",
  "public/media/mbta-hero.png": "fastest-t-rider/hero.png",
  "public/media/mbta-route.png": "fastest-t-rider/route.png",
};

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };

for (const [local, remote] of Object.entries(FILES)) {
  const body = await readFile(local);
  const res = await fetch(`${URL_BASE}/storage/v1/object/${BUCKET}/${remote}`, {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": MIME[extname(local)] ?? "application/octet-stream",
      "x-upsert": "true",
    },
    body,
  });
  if (!res.ok) throw new Error(`${remote}: ${res.status} ${await res.text()}`);
  console.log(`${basename(local)} -> ${remote}`);
}
