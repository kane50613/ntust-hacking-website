import { destroySession, getSessionFromRequest } from "~/session";
import { Route } from "./+types/sign-out";

export async function action({ request }: Route.LoaderArgs) {
  const session = await getSessionFromRequest(request);

  return new Response(null, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
