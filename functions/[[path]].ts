import { createPagesFunctionHandler } from "@react-router/cloudflare";
import * as build from "../build/server/index.js";
import type { ServerBuild } from "react-router";

export const onRequest = createPagesFunctionHandler({
  build: build as unknown as ServerBuild,
  mode: "production",
});
