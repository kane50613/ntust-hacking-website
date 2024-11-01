import { env } from "~/env";

export const dbConfig = getConfig();

function getConfig() {
  if (env.TURSO_URL && env.TURSO_AUTH_TOKEN) {
    return {
      dialect: "turso",
      dbCredentials: {
        url: env.TURSO_URL,
        authToken: env.TURSO_AUTH_TOKEN,
      },
    } as const;
  }

  return {
    dialect: "sqlite",
    dbCredentials: {
      url: "file:./db.sqlite",
    },
  } as const;
}
