import type { Route } from "./+types/api.events.$eventId.delete";
import { events } from "~/db/schema";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { getSessionFromRequest, getUserFromSession } from "~/session";
import { clientActionToast } from "~/lib/client-action-toast";

export async function action({ request, params }: Route.ActionArgs) {
  const eventId = parseInt(params.eventId);

  const session = await getSessionFromRequest(request);

  if (!(await getUserFromSession(session, "admin")))
    throw new Error("Not logged in as admin");

  const record = await db
    .delete(events)
    .where(eq(events.eventId, eventId))
    .returning()
    .then((result) => result[0]);

  if (!record) throw new Error("Failed to edit event");

  return record;
}

export function clientAction({ serverAction }: Route.ClientActionArgs) {
  return clientActionToast(serverAction(), {
    loading: "正在刪除...",
    success: "刪除成功",
    error(error: unknown) {
      return `刪除失敗: ${
        error instanceof Error ? error.message : String(error)
      }`;
    },
  });
}
