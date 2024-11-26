import type { Route } from "./+types/api.events.$eventId.delete";
import { enrolls, events, feedbacks } from "~/db/schema";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { getSessionFromRequest, getUserFromSession } from "~/session";
import { clientActionToast } from "~/lib/client-action-toast";

export async function action({ request, params }: Route.LoaderArgs) {
  const eventId = parseInt(params.eventId);

  const session = await getSessionFromRequest(request);

  if (!(await getUserFromSession(session, "admin")))
    throw new Error("Not logged in as admin");

  await db.delete(enrolls).where(eq(enrolls.eventId, eventId));

  await db.delete(feedbacks).where(eq(feedbacks.eventId, eventId));

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
