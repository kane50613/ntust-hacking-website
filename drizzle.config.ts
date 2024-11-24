import "dotenv/config";

import { defineConfig } from "drizzle-kit";

function getConfig() {
  if (!process.env.DATABASE_URL) {
    return defineConfig({
      schema: "./app/db/schema.ts",
      dialect: "postgresql",
      driver: "pglite",
      dbCredentials: {
        url: "./pg-data",
      },
    });
  }

  return defineConfig({
    schema: "./app/db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
      url: process.env.DATABASE_URL,
    },
  });
}

export default getConfig();
