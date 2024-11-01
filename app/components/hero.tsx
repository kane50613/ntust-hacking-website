import { m } from "framer-motion";
import { Button } from "./ui/button";

const parts: {
  text: string;
  delay: number;
  className?: string;
  break?: boolean;
}[] = [
  {
    text: "「你，",
    delay: 0,
    break: true,
  },
  {
    text: "渴望",
    delay: 0.5,
  },
  {
    text: "魔法",
    className: "text-red-400",
    delay: 1.5,
  },
  {
    text: "嘛？」",
    delay: 2.5,
  },
];

const defaultPartsVariants = {
  hidden: { filter: "blur(10px)", opacity: 0 },
  visible: { filter: "blur(0px)", opacity: 1 },
};

export const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center font-sans">
      <m.div
        className="py-24 flex gap-4 items-center justify-center flex-col"
        variants={defaultPartsVariants}
        viewport={{ once: true }}
        initial="hidden"
        whileInView="visible"
        transition={{
          duration: 1,
          delay: 4,
        }}
      >
        <img
          src="https://creatorspace.imgix.net/users/clm61gg6k03bdo9010lkwn8z8/G1CNUrljJkYCXIWY-channels4_profile.jpeg?w=300&h=300"
          className="rounded-full w-20 aspect-square shadow-lg"
        />
        <p className="text-xl sm:text-2xl">台科大資訊安全研究社</p>
      </m.div>
      <div className="flex flex-col items-center justify-center gap-4 text-center py-16 sm:py-24">
        <m.h1
          className="text-[10vw] sm:text-[7vw]"
          initial={{
            scale: 0.8,
          }}
          whileInView={{
            scale: 1,
          }}
          transition={{
            duration: 4,
            ease: "easeOut",
          }}
          viewport={{ once: true }}
        >
          {parts.map((part, index) => (
            <m.span
              key={index}
              initial="hidden"
              whileInView="visible"
              transition={{
                delay: part.delay + 0.5,
                duration: 0.5,
              }}
              variants={defaultPartsVariants}
              viewport={{ once: true }}
              className={part.className}
            >
              {part.text}
            </m.span>
          ))}
        </m.h1>
      </div>
      <m.div
        className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full px-6"
        variants={defaultPartsVariants}
        viewport={{ once: true }}
        initial="hidden"
        whileInView="visible"
        transition={{
          delay: 4.5,
          duration: 1,
          ease: "easeOut",
        }}
      >
        <Button size="lg" className="text-lg w-full sm:w-auto rounded-full">
          我們是誰
        </Button>
        <Button size="lg" className="text-lg w-full sm:w-auto rounded-full">
          最新社團資訊
        </Button>
      </m.div>
    </div>
  );
};
