import type { Session } from "react-router";
import { createCookieSessionStorage } from "react-router";
import { env } from "./env";
import type { Role } from "./db/schema";
import { users } from "./db/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface SessionData {
  userId?: number;
}

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData>({
    cookie: {
      name: "_session",
      secrets: [env.JWT_SECRET],
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    },
  });

export function getSessionFromRequest(request: Request) {
  return getSession(request.headers.get("cookie"));
}

export async function getUserFromSession(
  session: Session<SessionData>,
  role?: Role
) {
  if (!session.data.userId) return;

  const record = await db.query.users.findFirst({
    where: eq(users.userId, session.data.userId),
  });

  if (!record || (role && record.role !== role)) return;

  return record;
}
