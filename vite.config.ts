import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "tailwindcss";

// https://vite.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
  },
  esbuild: {
    supported: {
      "top-level-await": true,
    },
    define: Object.fromEntries(
      Object.entries(process.env).map(([key, value]) => [
        `process.env.${key}`,
        JSON.stringify(value),
      ])
    ),
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  plugins: [reactRouter(), tsconfigPaths()],
});
