import { drizzle } from "drizzle-orm/neon-http";
import { drizzle as drizzleWs } from "drizzle-orm/neon-serverless";
import { drizzle as drizzleFs } from "drizzle-orm/pglite";
import * as schema from "./schema";
import { Client } from "@neondatabase/serverless";

function getDb() {
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

export async function getWsDb() {
  if (process.env.DATABASE_URL) {
    const client = new Client(process.env.DATABASE_URL);
    await client.connect();

    return drizzleWs(client, {
      schema,
    });
  }

  return db;
}

export async function startTransaction<T>(
  fn: (db: Omit<Awaited<ReturnType<typeof getWsDb>>, "$client">) => Promise<T>
) {
  const db = await getWsDb();
  return db.transaction(fn);
}

export const db = getDb();
