import { env } from "~/env";
import { Route } from "./+types/auth";
import { redirect } from "react-router";
import { commitSession, getSessionFromRequest } from "~/session";
import { createRestManager } from "@discordeno/rest";
import { db } from "~/db";
import { users } from "~/db/schema";
import { avatarUrl } from "@discordeno/utils";

type OAuthResponse =
  | {
      access_token: string;
      expires_in: number;
      refresh_token: string;
      scope: string;
    }
  | {
      error_description: string;
    };

function getRedirectUri(req: Request) {
  const url = new URL(req.url);

  if (url.hostname !== "localhost") url.protocol = "https:";

  return `${url.origin}/auth`;
}

function getOAuthUrl(req: Request) {
  const url = new URL("https://discord.com/api/oauth2/authorize");

  url.searchParams.set("client_id", env.DISCORD_CLIENT_ID);
  url.searchParams.set("prompt", "none");
  url.searchParams.set("scope", "identify email");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", getRedirectUri(req));

  return url;
}

async function fetchTokenFromCode(request: Request, code: string) {
  const tokenResponse = await fetch(
    "https://discord.com/api/v10/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: env.DISCORD_CLIENT_ID,
        client_secret: env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: getRedirectUri(request),
      }),
    }
  );

  if (!tokenResponse.ok)
    throw new Error(
      `Fetching token from code failed: ${tokenResponse.status} ${tokenResponse.statusText}`
    );

  const json = (await tokenResponse.json()) as OAuthResponse;

  if ("error_description" in json) throw new Error(json.error_description);

  return json;
}

export async function loader({ request }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return redirect(getOAuthUrl(request).toString());
  }

  const session = await getSessionFromRequest(request);

  const { access_token } = await fetchTokenFromCode(request, code);

  const rest = createRestManager({
    token: "",
  });

  const discordUser = await rest.getCurrentUser(access_token);

  if (!discordUser.email)
    throw new Error("Discord user does not have an email address");

  const payload = {
    name: discordUser.globalName ?? discordUser.username,
    email: discordUser.email,
    avatar: avatarUrl(discordUser.id, discordUser.discriminator, {
      avatar: discordUser.avatar ?? undefined,
    }),
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
