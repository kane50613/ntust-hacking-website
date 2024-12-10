import { z } from "zod";
import type { Route } from "./+types/api.invites.use";
import { parse } from "devalue";
import { getSessionFromRequest, getUserFromSession } from "~/session";
import { clientActionToast } from "~/lib/client-action-toast";
import { db } from "~/db";
import { invites, inviteUses, users } from "~/db/schema";
import { count, eq, getTableColumns, lt } from "drizzle-orm";

export const useInviteSchema = z.object({
  code: z.string(),
});

export type UseInvitePayload = z.infer<typeof useInviteSchema>;

export async function action({ request }: Route.ActionArgs) {
  const payload = useInviteSchema.parse(parse(await request.text()));

  const session = await getSessionFromRequest(request);
  const user = await getUserFromSession(session, "guest");

  if (!user) throw new Error("Not logged in");

  const invite = await db
    .select({
      ...getTableColumns(invites),
      uses: count(inviteUses.inviteUseId),
    })
    .from(invites)
    .where(eq(invites.code, payload.code))
    .leftJoin(inviteUses, eq(invites.inviteId, inviteUses.inviteId))
    .groupBy(invites.inviteId)
    .having((row) => lt(row.uses, row.maxUsages))
    .then((result) => result[0]);

  if (!invite) throw new Error("Invalid invite code");

  const record = await db.transaction(async (db) => {
    await db
      .update(users)
      .set({
        role: "user",
      })
      .where(eq(users.userId, user.userId));

    const record = await db
      .insert(inviteUses)
      .values({
        inviteId: invite.inviteId,
        userId: user.userId,
      })
      .returning()
      .then((r) => r[0]);

    if (!record) throw new Error("Failed to use invite");

    return record;
  });

  return record;
}

export function clientAction({ serverAction }: Route.ClientActionArgs) {
  return clientActionToast(serverAction(), {
    loading: "正在使用邀請碼...",
    success: "使用成功",
    error(error: unknown) {
      return `使用失敗: ${
        error instanceof Error ? error.message : String(error)
      }`;
    },
  });
}
