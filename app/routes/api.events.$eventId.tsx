import type { Route } from "./+types/api.events.$eventId";
import { createInsertSchema } from "drizzle-zod";
import { events } from "~/db/schema";
import type { z } from "zod";
import { parse } from "devalue";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { toast } from "sonner";
import { getSessionFromRequest, getUserFromSession } from "~/session";

export const editEventSchema = createInsertSchema(events).omit({
  createdAt: true,
  eventId: true,
});

export type EditEventPayload = z.infer<typeof editEventSchema>;

export async function action({ request, params }: Route.LoaderArgs) {
  const eventId = parseInt(params.eventId);
  const payload = editEventSchema.parse(parse(await request.text()));

  const session = await getSessionFromRequest(request);

  if (!(await getUserFromSession(session, "admin")))
    throw new Error("Not logged in as admin");

  const record = await db
    .update(events)
    .set(payload)
    .where(eq(events.eventId, eventId))
    .returning()
    .then((result) => result[0]);

  if (!record) throw new Error("Failed to edit event");

  return record;
}

export function clientAction({ serverAction }: Route.ClientActionArgs) {
  toast.promise(serverAction(), {
    loading: "正在編輯活動...",
    success: "編輯成功",
    error(error: unknown) {
      return `編輯失敗: ${
        error instanceof Error ? error.message : String(error)
      }`;
    },
  });
}
