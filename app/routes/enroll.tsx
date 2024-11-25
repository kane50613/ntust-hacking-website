import { toast } from "sonner";
import { z } from "zod";
import { db } from "~/db";
import { enrolls } from "~/db/schema";
import { Route } from "~/routes/+types/enroll";
import { getSessionFromRequest } from "~/session";

const enrollSchema = z.object({
  eventId: z.number(),
});

export type EnrollPayload = z.infer<typeof enrollSchema>;

export async function action({ request }: Route.LoaderArgs) {
  const { eventId } = enrollSchema.parse(await request.json());

  const session = await getSessionFromRequest(request);

  if (!session.data.userId)
    return new Response("Not logged in", { status: 401 });

  await db
    .insert(enrolls)
    .values({
      eventId,
      userId: session.data.userId,
    })
    .onConflictDoNothing();
}

export async function clientAction({ serverAction }: Route.ClientActionArgs) {
  toast.promise(serverAction(), {
    loading: "正在報名...",
    success: "報名成功",
    error(error: unknown) {
      return `報名失敗: ${
        error instanceof Error ? error.message : String(error)
      }`;
    },
  });
}
