import { db } from "~/db";
import type { Route } from "./+types/api.invites.$inviteId.delete";
import { invites } from "~/db/schema";
import { eq } from "drizzle-orm";
import { getSessionFromRequest, getUserFromSession } from "~/session";
import { clientActionToast } from "~/lib/client-action-toast";

export async function action({ request, params }: Route.ActionArgs) {
  const inviteId = parseInt(params.inviteId);

  const session = await getSessionFromRequest(request);
  const user = await getUserFromSession(session, "admin");

  if (!user) throw new Error("Not logged in as admin");

  const record = await db
    .delete(invites)
    .where(eq(invites.inviteId, inviteId))
    .returning()
    .then((result) => result[0]);

  if (!record) throw new Error("Failed to delete invite");

  return record;
}

export function clientAction({ serverAction }: Route.ClientActionArgs) {
  return clientActionToast(serverAction(), {
    loading: "正在刪除邀請碼...",
    success: "刪除成功",
    error(error: unknown) {
      return `刪除失敗: ${
        error instanceof Error ? error.message : String(error)
      }`;
    },
  });
}
