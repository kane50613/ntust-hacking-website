import { createInsertSchema } from "drizzle-zod";
import { invites } from "~/db/schema";
import type { Route } from "./+types/api.invites.$inviteId.edit";
import type { z } from "zod";
import { parse } from "devalue";
import { db } from "~/db";
import { eq } from "drizzle-orm";
import { clientActionToast } from "~/lib/client-action-toast";
import { getSessionFromRequest, getUserFromSession } from "~/session";

export const editInviteSchema = createInsertSchema(invites).omit({
  inviteId: true,
  createdAt: true,
  createdBy: true,
});

export type EditInvitePayload = z.infer<typeof editInviteSchema>;

export async function action({ request, params }: Route.ActionArgs) {
  const inviteId = parseInt(params.inviteId);

  const payload = editInviteSchema.parse(parse(await request.text()));

  const session = await getSessionFromRequest(request);
  const user = await getUserFromSession(session, "admin");

  if (!user) throw new Error("Not logged in as admin");

  const record = await db
    .update(invites)
    .set(payload)
    .where(eq(invites.inviteId, inviteId))
    .returning()
    .then((result) => result[0]);

  if (!record) throw new Error("Failed to edit invite");

  return record;
}

export function clientAction({ serverAction }: Route.ClientActionArgs) {
  return clientActionToast(serverAction(), {
    loading: "正在編輯邀請碼...",
    success: "編輯成功",
    error(error: unknown) {
      return `編輯失敗: ${
        error instanceof Error ? error.message : String(error)
      }`;
    },
  });
}
