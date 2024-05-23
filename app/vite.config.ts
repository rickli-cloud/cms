import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), dts({})],
  resolve: {
    alias: {
      $lib: resolve(__dirname, "src/lib"),
      $ass: resolve(__dirname, "src/assets"),
      $routes: resolve(__dirname, "src/routes"),
    },
  },
  build: {
    outDir: "dist/app",
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "index",
      fileName: (format) => `index.${format}.js`,
    },
  },
});
