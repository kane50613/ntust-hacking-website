import { clientActionToast } from "~/lib/client-action-toast";
import type { Route } from "./+types/api.users.$userId.delete";
import { db } from "~/db";
import { users } from "~/db/schema";
import { eq } from "drizzle-orm";
import { getSessionFromRequest, getUserFromSession } from "~/session";

export async function action({ request, params }: Route.LoaderArgs) {
  const session = await getSessionFromRequest(request);

  if (!(await getUserFromSession(session, "admin")))
    throw new Error("Not logged in as admin");

  const record = await db
    .delete(users)
    .where(eq(users.userId, parseInt(params.userId)))
    .returning()
    .then((result) => result[0]);

  if (!record) throw new Error("Failed to delete user");

  return record;
}

export function clientAction({ serverAction }: Route.ClientActionArgs) {
  return clientActionToast(serverAction(), {
    loading: "正在刪除社員資料...",
    success: "刪除成功",
    error(error: unknown) {
      return `刪除失敗: ${
        error instanceof Error ? error.message : String(error)
      }`;
    },
  });
}
