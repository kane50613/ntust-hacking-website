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
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
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
