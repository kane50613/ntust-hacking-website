import {
  useState,
  useMemo,
  useCallback,
  CSSProperties,
  MouseEventHandler,
  useEffect,
  useDeferredValue,
} from "react";
import { GlowingText } from "./glowing-text";
import { isbot } from "isbot";

interface Vector {
  x: number;
  y: number;
}

export interface Word {
  word: string;
  fontSize: number;
  position: Vector;
  width: number;
  height: number;
  delay: number;
}

const wordTemplates = [
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
  "台科大資訊安全研究社",
  "網路釣魚",
  "惡意代碼",
  "Malicious Code",
  "Network Phishing",
  "CyberSecurity",
  "漏洞利用",
  "黑魔法",
  "台灣網路重砲",
  "國家戰略級黑魔導",
];

const getRandomWord = () =>
  wordTemplates[Math.floor(Math.random() * wordTemplates.length)];

function generateVerticalAndHorizontalWordClouds() {
  const center = {
    x: innerWidth / 2,
    y: innerHeight / 2,
  };

  const words: Word[] = [];

  let radius = innerWidth / 10,
    hasAvailableSpace = true;

  while (hasAvailableSpace) {
    radius += Math.random() * 50 + 10;
    hasAvailableSpace = false;

    for (let i = Math.random() * 30; i < 360; i += Math.random() * 50) {
      const centerPosition = {
        x: center.x + radius * Math.cos((i * Math.PI) / 180),
        y: center.y + radius * Math.sin((i * Math.PI) / 180),
      };

      if (
        centerPosition.x < 0 ||
        centerPosition.x > window.innerWidth ||
        centerPosition.y < 0 ||
        centerPosition.y > window.innerHeight
      ) {
        continue;
      }

      const word = getRandomWord();

      const fontSizePx = Math.random() * 50 + 15;

      const width = fontSizePx * word.length;
      const height = fontSizePx;

      const borderX = centerPosition.x - width / 2;
      const borderY = centerPosition.y - height / 2;

      const overlap = words.find((word) => {
        return (
          word.position.x < borderX + width &&
          word.position.x + word.width > borderX &&
          word.position.y < borderY + height &&
          word.position.y + word.height > borderY
        );
      });

      hasAvailableSpace = true;

      if (overlap) {
        continue;
      }

      words.push({
        word,
        fontSize: fontSizePx,
        position: {
          x: borderX,
          y: borderY,
        },
        width,
        height,
        delay: words.length * 0.02,
      });
    }
  }

  return words;
}

const MouseGlowBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: -10000, y: -10000 });
  const [isMounted, setIsMounted] = useState(false);

  const deferredMousePosition = useDeferredValue(mousePosition);

  const handleMouseMove = useCallback((e: Parameters<MouseEventHandler>[0]) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  useEffect(() => {
    setIsMounted(!isbot(navigator.userAgent));

    return () => {
      setIsMounted(false);
    };
  }, []);

  const wordConfigs = useMemo(() => {
    if (!isMounted) return [];

    return generateVerticalAndHorizontalWordClouds();
  }, [isMounted]);

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
        {wordConfigs.map((item, i) => (
          <GlowingText
            key={i}
            word={item.word}
            size={item.fontSize}
            position={item.position}
            delay={item.delay}
            rotation={0}
            mousePosition={deferredMousePosition}
          />
        ))}
      </div>

      {/* overlay darken to bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default MouseGlowBackground;
