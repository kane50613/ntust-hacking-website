import { clientActionToast } from "~/lib/client-action-toast";
import type { Route } from "./+types/api.users.$userId.edit";
import { db } from "~/db";
import { role, users } from "~/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { parse } from "devalue";
import { eq } from "drizzle-orm";
import { getSessionFromRequest, getUserFromSession } from "~/session";
import { z } from "zod";

export const editUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  role: z.enum(role.enumValues),
}).omit({
  createdAt: true,
  userId: true,
  discordId: true,
  avatar: true,
});

export type EditUserPayload = z.infer<typeof editUserSchema>;

export async function action({ request, params }: Route.ActionArgs) {
  const session = await getSessionFromRequest(request);

  if (!(await getUserFromSession(session, "admin")))
    throw new Error("Not logged in as admin");

  const payload = editUserSchema.parse(parse(await request.text()));

  const record = await db
    .update(users)
    .set(payload)
    .where(eq(users.userId, parseInt(params.userId)))
    .returning()
    .then((result) => result[0]);

  if (!record) throw new Error("Failed to edit user");

  return record;
}

export function clientAction({ serverAction }: Route.ClientActionArgs) {
  return clientActionToast(serverAction(), {
    loading: "正在編輯社員資料...",
    success: "編輯成功",
    error(error: unknown) {
      return `編輯失敗: ${
        error instanceof Error ? error.message : String(error)
      }`;
    },
  });
}
