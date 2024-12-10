import { db } from "~/db";
import type { Route } from "./+types/api.users.$userId";
import { eq } from "drizzle-orm";
import { users } from "~/db/schema";
import { getSessionFromRequest, getUserFromSession } from "~/session";

export async function loader({ params, request }: Route.LoaderArgs) {
  const session = await getSessionFromRequest(request);

  if (!(await getUserFromSession(session, "admin")))
    throw new Error("Not logged in as admin");

  const userId = parseInt(params.userId);

  return await db.query.users.findFirst({
    where: eq(users.userId, userId),
  });
}
