import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsInlineLimit: 2048,
    cssCodeSplit: false,
    modulePreload: { polyfill: false },
    target: "es2022",
    sourcemap: false,
    rollupOptions: {
      input: {
        main: "index.html",
        opensource: "opensource/index.html",
        faq: "faq/index.html",
        skins: "skins/index.html",
        install: "install/index.html",
      },
      output: {
        entryFileNames: "assets/app.[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash][extname]",
      },
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
  },
});
