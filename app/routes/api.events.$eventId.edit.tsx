import type { Route } from "./+types/api.events.$eventId.edit";
import { createInsertSchema } from "drizzle-zod";
import { events, teachers } from "~/db/schema";
import { z } from "zod";
import { parse } from "devalue";
import { eq } from "drizzle-orm";
import { startTransaction } from "~/db";
import { getSessionFromRequest, getUserFromSession } from "~/session";
import { clientActionToast } from "~/lib/client-action-toast";

export const editEventSchema = createInsertSchema(events)
  .omit({
    createdAt: true,
    eventId: true,
  })
  .extend({
    teacherIds: z.array(z.number()).default([]),
  });

export type EditEventPayload = z.infer<typeof editEventSchema>;

export async function action({ request, params }: Route.ActionArgs) {
  const eventId = parseInt(params.eventId);
  const payload = editEventSchema.parse(parse(await request.text()));

  const session = await getSessionFromRequest(request);

  if (!(await getUserFromSession(session, "admin")))
    throw new Error("Not logged in as admin");

  const record = await startTransaction(async (db) => {
    const record = await db
      .update(events)
      .set(payload)
      .where(eq(events.eventId, eventId))
      .returning()
      .then((result) => result[0]);

    if (!record) throw new Error("Failed to edit event");

    await db.delete(teachers).where(eq(teachers.eventId, eventId));

    if (payload.teacherIds.length > 0) {
      await db.insert(teachers).values(
        payload.teacherIds.map((id) => ({
          eventId: eventId,
          userId: id,
        }))
      );
    }

    return record;
  });

  return record;
}

export function clientAction({ serverAction }: Route.ClientActionArgs) {
  return clientActionToast(serverAction(), {
    loading: "正在編輯活動...",
    success: "編輯成功",
    error(error: unknown) {
      return `編輯失敗: ${
        error instanceof Error ? error.message : String(error)
      }`;
    },
  });
}
