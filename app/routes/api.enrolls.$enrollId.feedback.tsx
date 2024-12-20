import { db } from "~/db";
import type { Route } from "./+types/api.enrolls.$enrollId.feedback";
import { enrolls, feedbacks } from "~/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { getSessionFromRequest, getUserFromSession } from "~/session";
import { parse } from "devalue";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { clientActionToast } from "~/lib/client-action-toast";

export const createFeedbackSchema = createInsertSchema(feedbacks)
  .omit({
    feedbackId: true,
    enrollId: true,
    createdAt: true,
  })
  .extend({
    rating: z.number().int().min(1).max(5),
  });

export type CreateFeedbackPayload = z.infer<typeof createFeedbackSchema>;

export async function action({ request, params }: Route.ActionArgs) {
  const enrollId = parseInt(params.enrollId);
  const payload = createFeedbackSchema.parse(parse(await request.text()));

  const session = await getSessionFromRequest(request);
  const user = await getUserFromSession(session, "user");

  if (!user) throw new Error("Not logged in");

  const enroll = await db.query.enrolls.findFirst({
    where: and(eq(enrolls.enrollId, enrollId), eq(enrolls.userId, user.userId)),
  });

  if (!enroll) throw new Error("Not enrolled in event");

  const record = await db
    .insert(feedbacks)
    .values({
      ...payload,
      enrollId,
    })
    .onConflictDoUpdate({
      target: feedbacks.enrollId,
      set: payload,
    })
    .returning()
    .then((result) => result[0]);

  if (!record) throw new Error("Failed to create feedback");

  return record;
}

export function clientAction({ serverAction }: Route.ClientActionArgs) {
  return clientActionToast(serverAction(), {
    loading: "正在送出回饋...",
    success: "回饋成功",
    error(error: unknown) {
      return `回饋失敗: ${
        error instanceof Error ? error.message : String(error)
      }`;
    },
  });
}
