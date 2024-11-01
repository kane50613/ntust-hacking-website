"use client";

import { LazyMotion } from "framer-motion";
import { ReactNode } from "react";

export const MotionLoader = ({ children }: { children: ReactNode }) => (
  <LazyMotion
    features={() => import("~/lib/motion-features").then((res) => res.default)}
    strict
  >
    {children}
  </LazyMotion>
);
