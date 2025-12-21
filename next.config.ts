import type { NextConfig } from "next";

/*
  Next.js configuration.
  This file ensures Turbopack uses THIS project folder as its root.
  Reason: Next may infer the wrong workspace root when multiple lockfiles exist
  (e.g., a stray `package-lock.json` in `C:\\Users\\bouaa\\`), which can break
  module resolution (like failing to resolve `tailwindcss`).
*/

const nextConfig: NextConfig = {
  /* config options here */
  // Fix for workspace root detection when multiple lockfiles exist.
  // Next.js will look for dependencies relative to this root.
  // @ts-expect-error - `turbopack` is supported by Next.js but may not exist in older type defs.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
