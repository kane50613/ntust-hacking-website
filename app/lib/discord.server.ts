import type { DiscordUser } from "@discordeno/types";
import { env } from "~/env";

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

export function getOAuthUrl(req: Request) {
  const url = new URL("https://discord.com/api/oauth2/authorize");

  url.searchParams.set("client_id", env.DISCORD_CLIENT_ID);
  url.searchParams.set("prompt", "none");
  url.searchParams.set("scope", "identify email");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", getRedirectUri(req));

  return url;
}

export async function fetchTokenFromCode(request: Request, code: string) {
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

export async function getDiscordUser(access_token: string) {
  const response = await fetch("https://discord.com/api/v10/users/@me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok)
    throw new Error(
      `Fetching user from Discord failed: ${response.status} ${response.statusText}`
    );

  return (await response.json()) as DiscordUser;
}
