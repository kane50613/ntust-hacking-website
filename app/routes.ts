import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("/auth", "routes/auth.tsx"),
  route("/enroll", "routes/enroll.tsx"),
];
