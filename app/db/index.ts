import { drizzle } from "drizzle-orm/neon-serverless";
import { drizzle as drizzleFs } from "drizzle-orm/pglite";
import * as schema from "./schema";
import { Client } from "@neondatabase/serverless";

function getDb() {
  if (process.env.DATABASE_URL) {
    return drizzle(new Client(process.env.DATABASE_URL), {
      schema,
    });
  }

  return drizzleFs("./pg-data", {
    schema,
    logger: true,
  });
}

export const db = getDb();
