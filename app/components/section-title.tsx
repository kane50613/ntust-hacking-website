import { ComponentProps } from "react";
import { cn } from "~/lib/utils";

export const SectionTitle = (props: ComponentProps<"h2">) => {
  return (
    <h2 {...props} className={cn("text-3xl sm:text-5xl font-bold", props.className)}>
      {props.children}
    </h2>
  );
};
