import {
  useState,
  useCallback,
  CSSProperties,
  MouseEventHandler,
  useEffect,
  useDeferredValue,
} from "react";
import { GlowingText } from "./glowing-text";
import { isbot } from "isbot";
import { AnimatePresence } from "framer-motion";
import {
  generateVerticalAndHorizontalWordClouds,
  Word,
} from "~/lib/word-clouds";

const MouseGlowBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: -10000, y: -10000 });
  const [wordConfigs, setWordConfigs] = useState<Word[]>([]);

  const deferredMousePosition = useDeferredValue(mousePosition);

  const handleMouseMove = useCallback((e: Parameters<MouseEventHandler>[0]) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  useEffect(() => {
    if (isbot(navigator.userAgent)) return;

    setWordConfigs(generateVerticalAndHorizontalWordClouds());

    const interval = setInterval(
      () => setWordConfigs(generateVerticalAndHorizontalWordClouds()),
      5000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
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
        <AnimatePresence>
          {wordConfigs.map((item) => (
            <GlowingText
              key={item.key}
              word={item.word}
              size={item.fontSize}
              position={item.position}
              delay={item.delay}
              rotation={0}
              mousePosition={deferredMousePosition}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* overlay darken to bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default MouseGlowBackground;
