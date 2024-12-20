import { destroySession, getSessionFromRequest } from "~/session";
import type { Route } from "./+types/sign-out";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSessionFromRequest(request);

  return new Response(null, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
