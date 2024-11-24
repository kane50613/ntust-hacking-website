import { drizzle } from "drizzle-orm/neon-serverless";
import { drizzle as drizzleFs } from "drizzle-orm/pglite";
import * as schema from "./schema";

async function getDb() {
  if (process.env.DATABASE_URL) {
    return drizzle(process.env.DATABASE_URL, {
      schema,
    });
  }

  return drizzleFs("./pg-data", {
    schema,
    logger: true,
  });
}

export const db = await getDb();
