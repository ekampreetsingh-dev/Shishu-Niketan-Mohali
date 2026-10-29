import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Routes the school backend serves for fee payment. Set FEE_API_TARGET to have
// the dev server proxy them onto the same origin, e.g.
//   FEE_API_TARGET=http://localhost:8000 npm run dev
const FEE_ROUTES = [
  "/pay-fees",
  "/verify-otp",
  "/verify-otp-for-admin",
  "/student-payment-details",
  "/get-fee-receipts",
  "/generate-payment-url",
];

const target = process.env.FEE_API_TARGET;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __SNPS_DEV_PROXY__: JSON.stringify(Boolean(target)),
  },
  server: {
    port: 5173,
    proxy: target
      ? Object.fromEntries(FEE_ROUTES.map((route) => [route, { target, changeOrigin: true }]))
      : undefined,
  },
});
