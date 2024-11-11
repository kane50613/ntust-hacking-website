export interface Vector {
  x: number;
  y: number;
}

export interface Word {
  key: string;
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
  "蜜月期POPOO",
  "台科超硬",
  "HackTheBox Night",
  "TryHackMe Night",
  "CTF Battle",
  "技術分享會",
  "您都不教",
];

const getRandomWord = () =>
  wordTemplates[Math.floor(Math.random() * wordTemplates.length)];

// Spatial grid for faster collision detection
class SpatialGrid {
  private cells: Map<string, Word[]> = new Map();
  private cellSize: number;

  constructor(cellSize: number) {
    this.cellSize = cellSize;
  }

  private getCellsForBoundingBox(
    x: number,
    y: number,
    width: number,
    height: number
  ): string[] {
    const startCellX = Math.floor(x / this.cellSize);
    const startCellY = Math.floor(y / this.cellSize);
    const endCellX = Math.floor((x + width) / this.cellSize);
    const endCellY = Math.floor((y + height) / this.cellSize);

    const cells: string[] = [];
    for (let cellX = startCellX; cellX <= endCellX; cellX++) {
      for (let cellY = startCellY; cellY <= endCellY; cellY++) {
        cells.push(`${cellX},${cellY}`);
      }
    }
    return cells;
  }

  insert(word: Word): void {
    const cells = this.getCellsForBoundingBox(
      word.position.x,
      word.position.y,
      word.width,
      word.height
    );

    cells.forEach((cellKey) => {
      if (!this.cells.has(cellKey)) {
        this.cells.set(cellKey, []);
      }
      this.cells.get(cellKey)!.push(word);
    });
  }

  checkCollision(x: number, y: number, width: number, height: number): boolean {
    const cells = this.getCellsForBoundingBox(x, y, width, height);

    for (const cellKey of cells) {
      const wordsInCell = this.cells.get(cellKey) || [];
      for (const word of wordsInCell) {
        if (
          word.position.x < x + width &&
          word.position.x + word.width > x &&
          word.position.y < y + height &&
          word.position.y + word.height > y
        ) {
          return true;
        }
      }
    }
    return false;
  }
}

export function generateVerticalAndHorizontalWordClouds() {
  const center = {
    x: innerWidth / 2,
    y: innerHeight / 2,
  };

  const words: Word[] = [];
  const spatialGrid = new SpatialGrid(100); // Cell size of 100px

  let radius = innerWidth / 10;
  let consecutiveFailures = 0;

  const maxFailures = 100; // Stop after too many failed placement attempts

  while (consecutiveFailures < maxFailures) {
    radius += 10 + Math.random() * 50;
    let placedWordInCurrentRadius = false;

    // Pre-calculate angles for current iteration
    const angleStep = 30 + Math.random() * 20;
    const startAngle = Math.random() * 30;

    for (let i = startAngle; i < 360; i += angleStep) {
      const radians = (i * Math.PI) / 180;
      const centerPosition = {
        x: center.x + radius * Math.cos(radians),
        y: center.y + radius * Math.sin(radians),
      };

      // Early boundary check
      if (
        centerPosition.x < -innerWidth * 0.5 ||
        centerPosition.x > window.innerWidth * 1.5 ||
        centerPosition.y < -innerHeight * 0.5 ||
        centerPosition.y > window.innerHeight * 1.5
      ) {
        continue;
      }

      const word = getRandomWord();
      const fontSizePx = 20 + Math.random() * 50;
      const width = fontSizePx * word.length;
      const height = fontSizePx;
      const borderX = centerPosition.x - width / 2;
      const borderY = centerPosition.y - height / 2;

      if (!spatialGrid.checkCollision(borderX, borderY, width, height)) {
        const newWord = {
          key: Math.random().toString(),
          word,
          fontSize: fontSizePx,
          position: {
            x: borderX,
            y: borderY,
          },
          width,
          height,
          delay: words.length * 0.02,
        };

        words.push(newWord);
        spatialGrid.insert(newWord);
        placedWordInCurrentRadius = true;
        consecutiveFailures = 0;
      }
    }

    if (!placedWordInCurrentRadius) {
      consecutiveFailures++;
    }
  }

  return words;
}
