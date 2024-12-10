import { getSessionFromRequest, getUserFromSession } from "~/session";
import type { Route } from "./+types/api.users._index";
import { db } from "~/db";
import { ilike } from "drizzle-orm";
import { users } from "~/db/schema";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSessionFromRequest(request);

  if (!(await getUserFromSession(session, "admin")))
    throw new Error("Not logged in as admin");

  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query");

  return await db.query.users.findMany({
    where: ilike(users.name, `%${query}%`),
    limit: 10,
    columns: {
      userId: true,
      name: true,
      avatar: true,
    },
  });
}
