import type { Session } from "react-router";
import { createCookieSessionStorage } from "react-router";
import { env } from "./env";
import type { Role } from "./db/schema";
import { roles, users } from "./db/schema";
import { db } from "./db";
import { and, eq, inArray } from "drizzle-orm";

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
  role: Role
) {
  if (!session.data.userId) return;

  const where = [eq(users.userId, session.data.userId)];

  if (role) {
    where.push(
      inArray(
        users.role,
        roles.enumValues.slice(roles.enumValues.indexOf(role))
      )
    );
  }

  const record = await db.query.users.findFirst({
    where: and(...where),
  });

  return record;
}
