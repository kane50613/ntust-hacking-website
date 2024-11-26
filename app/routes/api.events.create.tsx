import type { z } from "zod";
import type { Route } from "./+types/api.events.create";
import { createInsertSchema } from "drizzle-zod";
import { events } from "~/db/schema";
import { db } from "~/db";
import { parse } from "devalue";
import { getSessionFromRequest, getUserFromSession } from "~/session";
import { clientActionToast } from "~/lib/client-action-toast";

export const createEventSchema = createInsertSchema(events).omit({
  eventId: true,
  createdAt: true,
});

export type CreateEventPayload = z.infer<typeof createEventSchema>;

export async function action({ request }: Route.ActionArgs) {
  const payload = createEventSchema.parse(parse(await request.text()));

  const session = await getSessionFromRequest(request);

  if (!(await getUserFromSession(session, "admin")))
    throw new Error("Not logged in as admin");

  const record = await db
    .insert(events)
    .values(payload)
    .returning()
    .then((result) => result[0]);

  if (!record) throw new Error("Failed to create event");

  return record;
}

export function clientAction({ serverAction }: Route.ClientActionArgs) {
  return clientActionToast(serverAction(), {
    loading: "正在建立活動...",
    success: "建立成功",
    error(error: unknown) {
      return `建立失敗: ${
        error instanceof Error ? error.message : String(error)
      }`;
    },
  });
}
