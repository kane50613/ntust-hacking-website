import { m } from "framer-motion";
import { Button } from "./ui/button";
import { BlurIn } from "./blur-in";

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

export const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center font-sans py-48 gap-16">
      <BlurIn
        component="div"
        className="flex gap-4 items-center justify-center flex-col"
        duration={1}
        delay={4}
      >
        <img
          src="https://creatorspace.imgix.net/users/clm61gg6k03bdo9010lkwn8z8/G1CNUrljJkYCXIWY-channels4_profile.jpeg?w=300&h=300"
          className="rounded-full w-20 aspect-square shadow-lg"
        />
        <p className="text-xl sm:text-2xl">台科大資訊安全研究社</p>
      </BlurIn>
      <div className="flex flex-col items-center justify-center gap-4 text-center">
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
            <BlurIn
              component="span"
              key={index}
              delay={part.delay + 0.5}
              duration={0.5}
              className={part.className}
            >
              {part.text}
            </BlurIn>
          ))}
        </m.h1>
        <BlurIn
          component="span"
          className="text-primary/85 text-xl"
          delay={4}
          duration={0.5}
        >
          台科資安社作為頂尖的網路黑魔法重地，擁有龐大的黑魔法教育資源，更培育出多位國家戰略級魔法師
        </BlurIn>
      </div>
      <BlurIn
        component="div"
        className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full px-6"
        delay={4.5}
        duration={1}
      >
        <Button size="lg" className="text-lg w-full sm:w-auto rounded-full">
          最新社團資訊
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="text-lg w-full sm:w-auto rounded-full"
        >
          加入 Discord
        </Button>
      </BlurIn>
    </div>
  );
};
