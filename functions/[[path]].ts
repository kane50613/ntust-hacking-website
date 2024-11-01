import { createPagesFunctionHandler } from "@react-router/cloudflare";
import * as build from "../build/server/index.js";

export default createPagesFunctionHandler({
  build,
  mode: "production",
});
