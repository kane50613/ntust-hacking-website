import { m, MotionProps, Variant } from "framer-motion";

import { FC, PropsWithChildren } from "react";
import { blurInVariants } from "~/lib/motion-variants";

interface BlurIntProps extends PropsWithChildren {
  // a motion component function
  component?: keyof typeof m;
  className?: string;
  variant?: {
    hidden: Variant;
    visible: Variant;
  };
  delay?: number;
  duration?: number;
}

export const BlurIn = ({
  children,
  component,
  className,
  variant,
  duration = 1,
  delay = 0,
}: BlurIntProps) => {
  const combinedVariants = variant || blurInVariants;

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
