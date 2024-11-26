import type { Route } from "./+types/auth";
import { redirect } from "react-router";
import { commitSession, getSessionFromRequest } from "~/session";
import { db } from "~/db";
import { users } from "~/db/schema";
import {
  fetchTokenFromCode,
  getDiscordUser,
  getOAuthUrl,
} from "~/lib/discord.server";
import type { DiscordUser } from "@discordeno/types";

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
    avatar: avatarUrl(discordUser),
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

function avatarUrl(user: DiscordUser) {
  const format = user.avatar?.startsWith("a_") ? "gif" : "png";

  if (user.avatar)
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${format}`;

  return `https://cdn.discordapp.com/embed/avatars/${
    Number(user.discriminator) % 5
  }.${format}`;
}
