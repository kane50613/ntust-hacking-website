import { getSessionFromRequest, getUserFromSession } from "~/session";
import type { Route } from "./+types/api.invites.create";
import { createInsertSchema } from "drizzle-zod";
import { invites } from "~/db/schema";
import type { z } from "zod";
import { db } from "~/db";
import { parse } from "devalue";
import { clientActionToast } from "~/lib/client-action-toast";

export const createInviteSchema = createInsertSchema(invites).omit({
  inviteId: true,
  createdAt: true,
  createdBy: true,
});

export type CreateInvitePayload = z.infer<typeof createInviteSchema>;

export async function action({ request }: Route.ActionArgs) {
  const payload = createInviteSchema.parse(parse(await request.text()));

  const session = await getSessionFromRequest(request);
  const user = await getUserFromSession(session, "admin");

  if (!user) throw new Error("Not logged in as admin");

  const record = await db
    .insert(invites)
    .values({
      ...payload,
      createdBy: user.userId,
    })
    .returning()
    .then((r) => r[0]);

  if (!record) throw new Error("Failed to create invite");

  return record;
}

export function clientAction({ serverAction }: Route.ClientActionArgs) {
  return clientActionToast(serverAction(), {
    loading: "正在建立邀請碼...",
    success: "建立成功",
    error(error: unknown) {
      return `建立失敗: ${
        error instanceof Error ? error.message : String(error)
      }`;
    },
  });
}
