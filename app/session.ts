import { createCookieSessionStorage } from "react-router";
import { env } from "./env";

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
