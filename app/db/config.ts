import { env } from "~/env";

export const dbConfig = getConfig();

function getConfig() {
  if (env.TURSO_URL && env.TURSO_AUTH_TOKEN) {
    console.log(`Found TURSO_URL and TURSO_AUTH_TOKEN`);

    return {
      dialect: "turso",
      dbCredentials: {
        url: env.TURSO_URL,
        authToken: env.TURSO_AUTH_TOKEN,
      },
    } as const;
  }

  console.log(`No TURSO_URL or TURSO_AUTH_TOKEN found`);

  return {
    dialect: "sqlite",
    dbCredentials: {
      url: "file:./db.sqlite",
    },
  } as const;
}
