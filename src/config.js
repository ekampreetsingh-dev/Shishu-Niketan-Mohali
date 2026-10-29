// Single place that decides whether the fee portal talks to the school backend
// or to the local fixture data. Everything else in the app only calls feeApi.js.
//
//   npm run dev                       -> fixtures, no server needed
//   FEE_API_TARGET=http://host:8000   -> dev proxy, requests go same-origin
//   VITE_FEE_API_BASE=https://host     -> production, requests go to that origin

// Optional chaining keeps this importable from plain Node scripts and tests,
// where Vite's import.meta.env does not exist.
const configuredBase = import.meta.env?.VITE_FEE_API_BASE ?? "";

// Vite replaces this define at build time; typeof keeps Node from throwing.
const proxyOn = typeof __SNPS_DEV_PROXY__ !== "undefined" && __SNPS_DEV_PROXY__;

export const feeConfig = {
  // Absolute origin to prefix fee endpoints with. "" keeps them same-origin (dev proxy).
  base: configuredBase,
  // When true the app performs real network calls; otherwise it serves fixtures.
  live: Boolean(configuredBase) || proxyOn,
  source: configuredBase ? "VITE_FEE_API_BASE" : proxyOn ? "dev proxy" : "fixtures",
};

export const OFFICIAL_SITE = "https://shishuniketanmohali.org.in";
