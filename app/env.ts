import { z } from "zod";

export const env = z
  .object({
    TURSO_URL: z.string().url().optional(),
    TURSO_AUTH_TOKEN: z.string().optional(),
  })
  .parse(process.env);
