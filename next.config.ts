import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

/*
  Next.js configuration.
  This file ensures Turbopack uses THIS project folder as its root.
  Reason: Next may infer the wrong workspace root when multiple lockfiles exist
  (e.g., a stray `package-lock.json` in `C:\\Users\\bouaa\\`), which can break
  module resolution (like failing to resolve `tailwindcss`).
*/

const configDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  /* config options here */
  // Fix for workspace root detection when multiple lockfiles exist.
  // Next.js will look for dependencies relative to this root.
  turbopack: {
    root: configDir,
  },
};

export default nextConfig;
