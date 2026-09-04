import type { NextConfig } from "next";

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  images: supabase
    ? { remotePatterns: [new URL(`${supabase}/storage/v1/object/public/**`)] }
    : {},
};

export default nextConfig;
