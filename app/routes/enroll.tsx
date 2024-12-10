import { parse } from "devalue";
import { z } from "zod";
import { db } from "~/db";
import { enrolls } from "~/db/schema";
import { clientActionToast } from "~/lib/client-action-toast";
import type { Route } from "~/routes/+types/enroll";
import { getSessionFromRequest, getUserFromSession } from "~/session";

const enrollSchema = z.object({
  eventId: z.number(),
});

export type EnrollPayload = z.infer<typeof enrollSchema>;

export async function action({ request }: Route.ActionArgs) {
  const { eventId } = enrollSchema.parse(parse(await request.text()));

  const session = await getSessionFromRequest(request);
  const user = await getUserFromSession(session, "user");

  if (!user) throw new Error("Not logged in");

  await db
    .insert(enrolls)
    .values({
      eventId,
      userId: user.userId,
    })
    .onConflictDoNothing();
}

export async function clientAction({ serverAction }: Route.ClientActionArgs) {
  return clientActionToast(serverAction(), {
    loading: "正在報名...",
    success: "報名成功",
    error(error: unknown) {
      return `報名失敗: ${
        error instanceof Error ? error.message : String(error)
      }`;
    },
  });
}
