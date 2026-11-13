import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
export default defineConfig({
  base: "/test-atlas/",
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      includeAssets: [
        "icon-192.png",
        "icon-512.png",
        "maskable-512.png",
        "apple-touch-icon.png",
      ],
      manifest: {
        id: "/test-atlas/",
        name: "Test Atlas · Self-discovery",
        short_name: "Test Atlas",
        description:
          "Explore personality, relationships, and everyday habits at your own pace.",
        lang: "en",
        start_url: "/test-atlas/",
        scope: "/test-atlas/",
        display: "standalone",
        background_color: "#f7f6f2",
        theme_color: "#244c3c",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        cacheId: "test-atlas",
        clientsClaim: true,
        globPatterns: ["**/*.{js,css,html,png,svg,webmanifest}"],
        navigateFallback: "index.html",
        navigateFallbackAllowlist: [/^\/test-atlas\//],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  test: { include: ["tests/**/*.test.ts"] },
});
