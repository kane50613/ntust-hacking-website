import React, {
  useState,
  useMemo,
  useCallback,
  CSSProperties,
  MouseEventHandler,
  useEffect,
} from "react";
import { m } from "framer-motion";

const GlowingText = React.memo(
  ({
    word,
    size,
    position,
    rotation,
    mousePosition,
  }: {
    word: string;
    size: number;
    position: { x: number; y: number };
    rotation: number;
    mousePosition: { x: number; y: number };
  }) => {
    const distance = Math.sqrt(
      Math.pow(position.x - mousePosition.x, 2) +
        Math.pow(position.y - mousePosition.y, 2)
    );

    // Increased sensitivity and brightness for text glow
    const glowIntensity = Math.max(0, 1 - distance / 300);

    return (
      <m.div
        className="absolute inline-block px-2 cursor-default select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontSize: `${size}rem`,
          transform: `rotate(${rotation}deg)`,
          left: position.x,
          top: position.y,
          color: `rgba(219, 234, 254, ${0.2 + glowIntensity * 0.6})`, // Lighter base color
          textShadow:
            glowIntensity > 0.1
              ? `
          0 0 ${glowIntensity * 15}px rgba(239, 246, 255, ${
            glowIntensity * 0.7
          }),
          0 0 ${glowIntensity * 30}px rgba(239, 246, 255, ${
            glowIntensity * 0.5
          }),
          0 0 ${glowIntensity * 45}px rgba(239, 246, 255, ${
            glowIntensity * 0.3
          })
        `
              : "none",
          mixBlendMode: "plus-lighter",
          transition: "color 0.1s ease-out, text-shadow 0.1s ease-out", // Faster transitions
        }}
      >
        {word}
      </m.div>
    );
  }
);

const words = [
  "網站滲透",
  "Kernel Exploit",
  "OSINT",
  "資訊安全",
  "貓味兒",
  "社交工程",
  "滲透測試",
  "Hackers In Taiwan",
  "台灣駭客年會",
  "禁忌の網路秘術",
  "煞氣a台科黑魔法駭客貓貓社",
  "「教授頂樓風好大我好害怕」",
  "「同學別擔心學校壓得下來」",
  "「Red 當社長，大家的夢想！」",
  "Kali Linux",
  "Remote Code Execution",
  "饗食天堂",
  "烏拉呀哈",
];

const getRandomWord = (index: number) => words[index % words.length];

export const MouseGlowBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: -10000, y: -10000 });
  const [isMounted, setIsMounted] = useState(false);

  const handleMouseMove = useCallback((e: Parameters<MouseEventHandler>[0]) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  const gridConfig = useMemo(() => {
    if (!isMounted) return [];

    const items = [];
    const spacingX = 300;
    const spacingY = 100;

    const cols = Math.ceil(window.innerWidth / spacingX);
    const rows = Math.ceil(window.innerHeight / spacingY);

    const randomSeeds = Array.from({ length: rows * cols }, () => ({
      offsetX: Math.random() * 40 - 20,
      offsetY: Math.random() * 40 - 20,
      rotation: Math.random() * 20 - 10,
      size: Math.random() * 0.5 + 1.5,
      wordIndex: Math.floor(Math.random() * words.length),
    }));

    let seedIndex = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const seed = randomSeeds[seedIndex];
        items.push({
          word: getRandomWord(seed.wordIndex),
          position: {
            x: j * spacingX + seed.offsetX,
            y: i * spacingY + seed.offsetY,
          },
          rotation: seed.rotation,
          size: seed.size,
        });
        seedIndex++;
      }
    }
    return items;
  }, [isMounted]);

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <style>{`
        .glow-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            1200px circle at var(--mouse-x) var(--mouse-y),
            rgba(29, 78, 216, 0.3),
            transparent 30%
          );
          transition: background 0.1s ease-out;
        }
      `}</style>

      {/* Background glow layer - darker and more intense */}
      <div
        className="absolute inset-0 glow-container"
        style={
          {
            "--mouse-x": `${mousePosition.x}px`,
            "--mouse-y": `${mousePosition.y}px`,
          } as CSSProperties
        }
      />

      {/* Spotlight glow effect - darker and more concentrated */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            600px circle at ${mousePosition.x}px ${mousePosition.y}px,
            rgba(17, 24, 39, 0.3),
            transparent 30%
          )`,
          transition: "background 0.1s ease-out",
        }}
      />

      {/* Text layer */}
      <div className="relative w-full h-full text-center">
        {gridConfig.map((item, i) => (
          <GlowingText
            key={i}
            word={item.word}
            size={item.size}
            position={item.position}
            rotation={item.rotation}
            mousePosition={mousePosition}
          />
        ))}
      </div>

      {/* overlay darken to bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};
