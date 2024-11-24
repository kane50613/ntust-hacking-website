import { z } from "zod";

export const env = z
  .object({
    DATABASE_URL: z.string().url().optional(),
  })
  .parse({
    DATABASE_URL: process.env.DATABASE_URL,
  });
