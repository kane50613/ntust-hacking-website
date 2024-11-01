import { createRequestHandler } from "@react-router/cloudflare";
import * as build from "../build/server/index.js";

export default createRequestHandler({
  build,
  mode: "production",
});
