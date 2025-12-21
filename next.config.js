/**
 * Next.js configuration (CommonJS).
 *
 * Purpose:
 * - Forces Next/Turbopack to treat this project folder as the root directory.
 *
 * Why this change:
 * - On Windows, Next.js may infer the wrong workspace root when there are multiple lockfiles
 *   higher in the filesystem (e.g. `C:\Users\bouaa\package-lock.json`).
 * - When that happens, module resolution breaks and you get errors like:
 *   "Can't resolve 'tailwindcss' in 'C:\Users\bouaa\Documents\Freelance'".
 *
 * Using `__dirname` here is the most reliable way (it doesn't depend on `process.cwd()`).
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Next uses this repo as the root for tracing + Turbopack workspace resolution.
  outputFileTracingRoot: __dirname,
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;





