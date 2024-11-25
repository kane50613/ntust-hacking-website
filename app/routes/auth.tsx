import { Route } from "./+types/auth";
import { redirect } from "react-router";
import { commitSession, getSessionFromRequest } from "~/session";
import { db } from "~/db";
import { users } from "~/db/schema";
import { avatarUrl } from "@discordeno/utils";
import {
  fetchTokenFromCode,
  getDiscordUser,
  getOAuthUrl,
} from "~/lib/discord.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return redirect(getOAuthUrl(request).toString());
  }

  const session = await getSessionFromRequest(request);

  const { access_token } = await fetchTokenFromCode(request, code);

  const discordUser = await getDiscordUser(access_token);

  if (!discordUser.email)
    throw new Error("Discord user does not have an email address");

  const payload = {
    name: discordUser.global_name ?? discordUser.username,
    email: discordUser.email,
    avatar: avatarUrl(discordUser.id, discordUser.discriminator, {
      avatar: discordUser.avatar ?? undefined,
    }),
    discordId: BigInt(discordUser.id),
  };

  const user = await db
    .insert(users)
    .values(payload)
    .onConflictDoUpdate({
      target: users.email,
      set: payload,
    })
    .returning()
    .then((result) => result[0]);

  if (!user) throw new Error("Failed to create user");

  session.set("userId", user.userId);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
