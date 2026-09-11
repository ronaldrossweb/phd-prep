import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
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
        theme_color: "#0e1117",
        background_color: "#0e1117",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,ico,svg,woff2}"],
        navigateFallback: "/index.html",
        // Never cache the API: sync must hit the network, and a stale tutor
        // reply is worse than an error.
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^.*\/api\/.*$/,
            handler: "NetworkOnly",
          },
        ],
      },
    }),
  ],
  build: { target: "es2022" },
});
