// Central environment configuration.
// VITE_API_BASE_URL points to the deployed Cloudflare Worker, e.g.
// https://api.tataboutique.com or https://tata-boutique-api.<subdomain>.workers.dev
// In local dev it falls back to the wrangler dev server on port 8787.
//
// The '__PORT_8787__' placeholder below is ONLY meaningful for the Computer
// sandbox preview tool (deploy_website), which post-processes the built
// files and replaces this exact literal with a working proxy path so the
// Worker running in this sandbox stays reachable from the hosted preview.
// It must appear verbatim in the built JS bundle for that rewrite to find
// it — do not gate it behind a runtime startsWith('__') check, since that
// condition is only ever true before the tool has had a chance to replace
// it, making the branch permanently dead code. Real Cloudflare production
// builds never rely on this: they always set VITE_API_BASE_URL via .env or
// Cloudflare Pages build environment variables, which takes precedence.
export const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_BASE_URL || '__PORT_8787__';

export const SITE_URL = 'https://www.tataboutique.com';

// Static fallback data shown only if the API is briefly unreachable is NOT used —
// the site always reads from the API so admin changes are reflected immediately.
