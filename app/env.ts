import { z } from "zod";

export const env = z
  .object({
    TURSO_URL: z.string().url().optional(),
    TURSO_AUTH_TOKEN: z.string().optional(),
  })
  .parse({
    TURSO_URL: process.env.TURSO_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
  });
