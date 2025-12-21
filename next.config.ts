import type { NextConfig } from "next";
import path from "path";

/*
  Next.js configuration.
  This file ensures Turbopack uses THIS project folder as its root.
  Reason: Next may infer the wrong workspace root when multiple lockfiles exist
  (e.g., a stray `package-lock.json` in `C:\\Users\\bouaa\\`), which can break
  module resolution (like failing to resolve `tailwindcss`).
*/

const projectRoot = path.resolve(process.cwd());

const nextConfig: NextConfig = {
  /* config options here */
  /*
    Fix for workspace root detection when multiple lockfiles exist.
    Next.js internally normalizes both `outputFileTracingRoot` and `turbopack.root`
    to the SAME value. Setting `outputFileTracingRoot` here prevents Next from
    walking up the filesystem to a different lockfile (e.g. `C:\\Users\\bouaa\\package-lock.json`).
  */
  outputFileTracingRoot: projectRoot,
  turbopack: { root: projectRoot },
};

export default nextConfig;
