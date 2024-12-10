import { z } from "zod";
import type { Route } from "./+types/api.events.$eventId.create-grouping";
import { parse } from "devalue";
import { startTransaction } from "~/db";
import { enrolls, events, groups } from "~/db/schema";
import { eq, sql } from "drizzle-orm";
import { clientActionToast } from "~/lib/client-action-toast";
import { getSessionFromRequest, getUserFromSession } from "~/session";

export const createGroupingSchema = z.object({
  amount: z.number().int().min(1).max(10),
});

export type CreateGroupingPayload = z.infer<typeof createGroupingSchema>;

export async function action({ request, params }: Route.LoaderArgs) {
  const eventId = parseInt(params.eventId);

  const payload = createGroupingSchema.parse(parse(await request.text()));

  const session = await getSessionFromRequest(request);
  if (!(await getUserFromSession(session, "admin")))
    throw new Error("Not logged in as admin");

  const records = await startTransaction(async (db) => {
    const event = await db.query.events.findFirst({
      where: eq(events.eventId, eventId),
      with: {
        enrolls: {
          orderBy: sql`random()`,
        },
      },
    });

    if (!event) throw new Error("Event not found");

    await db.delete(groups).where(eq(groups.eventId, eventId));

    const groupRecords = await db
      .insert(groups)
      .values(
        Array.from({ length: payload.amount }, (_, i) => ({
          eventId,
          name: `第 ${i + 1} 組`,
        }))
      )
      .returning();

    let groupIndex = 0;

    for (const enroll of event.enrolls) {
      await db
        .update(enrolls)
        .set({ groupId: groupRecords[groupIndex].groupId })
        .where(eq(enrolls.enrollId, enroll.enrollId));

      groupIndex++;

      if (groupIndex >= payload.amount) groupIndex = 0;
    }

    return groupRecords;
  });

  return records;
}

export function clientAction({ serverAction }: Route.ClientActionArgs) {
  return clientActionToast(serverAction(), {
    loading: "正在隨機分組...",
    success: "分組成功",
    error(error: unknown) {
      return `分組失敗: ${
        error instanceof Error ? error.message : String(error)
      }`;
    },
  });
}
