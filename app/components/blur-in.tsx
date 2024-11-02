"use client";

import { m, MotionProps } from "framer-motion";

import { FC, PropsWithChildren } from "react";

interface BlurIntProps extends PropsWithChildren {
  // a motion component function
  component?: keyof typeof m;
  className?: string;
  variant?: {
    hidden: { filter: string; opacity: number };
    visible: { filter: string; opacity: number };
  };
  delay?: number;
  duration?: number;
}

const defaultVariants = {
  hidden: { filter: "blur(10px)", opacity: 0 },
  visible: { filter: "blur(0px)", opacity: 1 },
};

export const BlurIn = ({
  children,
  component,
  className,
  variant,
  duration = 1,
  delay = 0,
}: BlurIntProps) => {
  const combinedVariants = variant || defaultVariants;

  const Comp = m[component || "div"] as FC<
    MotionProps & {
      className?: string;
    }
  >;

  return (
    <Comp
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration, delay }}
      variants={combinedVariants}
      className={className}
    >
      {children}
    </Comp>
  );
};
