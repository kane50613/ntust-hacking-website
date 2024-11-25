import { Button } from "./ui/button";
import { BlurIn } from "./sections/blur-in";
import { fadeInFromBottomVariants } from "~/lib/motion-variants";
import { cn } from "~/lib/utils";
import { FaCalendar, FaDiscord } from "react-icons/fa6";
import { lazy } from "react";

const MouseGlowBackground = lazy(() => import("./mouse-glow-background"));

interface Part {
  text: string;
  delay: number;
  className?: string;
  break?: boolean;
}

const glowStyle =
  "relative before:blur-xl before:opacity-75 before:absolute before:top-0 before:left-0";

const parts: Part[] = [
  {
    text: "你，",
    delay: 0,
    break: true,
  },
  {
    text: "渴望",
    delay: 0.5,
  },
  {
    text: "魔法",
    className: cn("text-red-400 before:content-['魔法']", glowStyle),
    delay: 1.5,
  },
  {
    text: "嗎？",
    delay: 2.5,
  },
];

const redMagicParts: Part[] = [
  {
    text: "徐牧遠",
    className: "text-red-400",
    delay: 0,
  },
  {
    text: "要請我吃",
    delay: 1.5,
    break: true,
  },
  {
    text: "饗食天堂",
    delay: 2.5,
    className: cn("before:content-['饗食天堂']", glowStyle),
  },
];

export const Hero = ({ isRed }: { isRed: boolean }) => {
  const renderParts = isRed ? redMagicParts : parts;

  return (
    <div className="flex flex-col items-center justify-center font-sans gap-16 px-8 relative pb-32 pt-48 w-full">
      <div className="absolute top-0 left-0 w-full h-[80%] z-0">
        <MouseGlowBackground />
      </div>
      <div className="flex flex-col items-center justify-center gap-8 text-center pointer-events-none">
        <BlurIn
          component="h1"
          className="text-5xl sm:text-9xl !leading-snug font-bold"
          variant={{
            hidden: { scale: 0.8 },
            visible: { scale: 1 },
          }}
          duration={4}
        >
          {renderParts.map((part, index) => (
            <BlurIn
              component="span"
              key={index}
              delay={part.delay + 0.5}
              duration={0.5}
              className={part.className}
            >
              {part.text}
              {part.break && <br />}
            </BlurIn>
          ))}
        </BlurIn>
        <BlurIn
          component="span"
          className="text-primary/85 text-lg sm:text-xl"
          delay={4}
          duration={0.5}
        >
          台科資安社作為頂尖的網路黑魔法重地，
          <br />
          擁有龐大的黑魔法教育資源，更培育出多位國家戰略級魔法師
        </BlurIn>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full z-10">
        <FadeInButton delay={4.5}>
          <Button
            size="lg"
            className="text-lg w-full sm:w-auto rounded-full h-12"
            asChild
          >
            <a href="#events">
              <FaCalendar className="w-6" />
              最新社團資訊
            </a>
          </Button>
        </FadeInButton>
        <FadeInButton delay={4.75}>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg w-full sm:w-auto rounded-full h-12"
            asChild
          >
            <a
              href="https://discord.gg/8mZxdsJkvQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaDiscord className="w-6" />
              加入 Discord
            </a>
          </Button>
        </FadeInButton>
      </div>
    </div>
  );
};

const FadeInButton = ({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) => {
  return (
    <BlurIn
      component="button"
      className="text-lg w-full sm:w-auto rounded-full"
      delay={delay}
      duration={0.5}
      variant={fadeInFromBottomVariants}
    >
      {children}
    </BlurIn>
  );
};
