import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";

import { renderToReadableStream } from "react-dom/server.edge";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
) {
  const userAgent = request.headers.get("user-agent");

  // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
  // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
  const waitForAllContent =
    (userAgent && isbot(userAgent)) || routerContext.isSpaMode;

  const body = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      onError(error: unknown) {
        responseStatusCode = 500;
        console.error(error);
      },
    }
  );

  responseHeaders.set("Content-Type", "text/html");

  if (waitForAllContent) {
    await body.allReady;
  }

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
