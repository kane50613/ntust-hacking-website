import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

export const MotionLoader = ({ children }: { children: ReactNode }) => (
  <LazyMotion
    features={() => import("~/lib/motion-features").then((res) => res.default)}
    strict
  >
    {children}
  </LazyMotion>
);
