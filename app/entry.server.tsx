import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";

// @ts-expect-error: importing renderToReadableStream from react-dom/server.browser
import { renderToReadableStream } from "react-dom/server.browser";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
) {
  let shellRendered = false;
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
        // Log streaming rendering errors from inside the shell.  Don't log
        // errors encountered during initial shell rendering since they'll
        // reject and get logged in handleDocumentRequest.
        if (shellRendered) {
          console.error(error);
        }
      },
    }
  );

  shellRendered = true;

  responseHeaders.set("Content-Type", "text/html");

  if (waitForAllContent) {
    await body.allReady;
  }

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
