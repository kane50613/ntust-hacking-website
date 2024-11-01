import "dotenv/config";

import { defineConfig } from "drizzle-kit";
import { dbConfig } from "~/db/config";

export default defineConfig({
  ...dbConfig,
  schema: "./app/db/schema.ts",
});
