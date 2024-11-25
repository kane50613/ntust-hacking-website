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
    define: {
      ...Object.fromEntries(
        Object.entries(process.env).map(([key, value]) => [
          `process.env.${key}`,
          JSON.stringify(value),
        ])
      ),
      // magic to make tree-shaking work!
      "process.env.DATABASE_URL": JSON.stringify(process.env.DATABASE_URL ?? 0),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  plugins: [reactRouter(), tsconfigPaths()],
});
