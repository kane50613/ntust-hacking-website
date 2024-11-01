import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { dbConfig } from "./config";
import * as schema from "./schema";

const client = createClient(dbConfig.dbCredentials);

export const db = drizzle(client, {
  schema,
});
