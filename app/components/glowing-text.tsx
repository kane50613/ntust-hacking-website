import { m } from "framer-motion";
import { memo } from "react";
import { BlurIn } from "./sections/blur-in";

export const GlowingText = memo(
  ({
    word,
    size,
    position,
    rotation,
    mousePosition,
    delay,
  }: {
    word: string;
    size: number;
    position: { x: number; y: number };
    rotation: number;
    mousePosition: { x: number; y: number };
    delay: number;
  }) => {
    const distance = Math.sqrt(
      Math.pow(position.x - mousePosition.x, 2) +
        Math.pow(position.y - mousePosition.y, 2)
    );

    // Increased sensitivity and brightness for text glow
    const glowIntensity = Math.max(0, 1 - distance / 300);

    return (
      <BlurIn delay={delay} duration={0.3}>
        <m.div
          className="absolute inline-block px-2 cursor-default select-none whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontSize: `${size}px`,
            transform: `rotate(${rotation}deg)`,
            left: position.x,
            top: position.y,
            color: `rgba(219, 234, 254, ${0.2 + glowIntensity * 0.6})`, // Lighter base color
            textShadow:
              glowIntensity > 0.1
                ? `
              0 0 ${glowIntensity * 15}px rgba(239, 246, 255, ${
                glowIntensity * 0.5
              }),
              0 0 ${glowIntensity * 30}px rgba(239, 246, 255, ${
                glowIntensity * 0.3
              }),
              0 0 ${glowIntensity * 45}px rgba(239, 246, 255, ${
                glowIntensity * 0.1
              })
            `
                : "none",
            mixBlendMode: "plus-lighter",
            transition: "color 0.1s ease-out, text-shadow 0.1s ease-out", // Faster transitions
          }}
        >
          {word}
        </m.div>
      </BlurIn>
    );
  }
);
