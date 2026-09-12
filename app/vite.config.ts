import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const BASE = "/phd-prep/";

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "PhD Prep — PhDAI 730 & 832",
        short_name: "PhD Prep",
        description:
          "Five-week preparation system for Statistics for AI and Ethics in Responsible AI.",
        theme_color: "#0A0C12",
        background_color: "#0A0C12",
        display: "standalone",
        orientation: "portrait",
        start_url: BASE,
        scope: BASE,
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,ico,svg,woff2}"],
        navigateFallback: BASE + "index.html",
        runtimeCaching: [
          // Supabase and Anthropic must always hit the network.
          { urlPattern: /^https:\/\/[a-z0-9]+\.supabase\.co\/.*/i, handler: "NetworkOnly" },
          { urlPattern: /^https:\/\/api\.anthropic\.com\/.*/i, handler: "NetworkOnly" },
          // Cache the webfonts so typography survives a commute with no signal.
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-css" },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-files",
              expiration: { maxEntries: 24, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  // Dev server honours PORT so the preview tool can assign a free one.
  server: { host: "127.0.0.1", port: Number(process.env.PORT) || 5173, strictPort: false },
  build: { target: "es2022" },
});
