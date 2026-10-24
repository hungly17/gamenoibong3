import {
  AgeGroup,
  BALL_COLORS,
  BallColorId,
  BallNode,
  LevelConfig,
  Point
} from './gameTypes';
import { PRESET_LEVELS } from './levelData';
import { distanceBetween } from '../utils/geometry';

const ALL_COLOR_IDS = Object.keys(BALL_COLORS) as BallColorId[];

/**
 * Kiểm tra tính hợp lệ của một màn chơi:
 * - Mỗi màu trong màn xuất hiện đúng 2 lần
 * - Không có bóng nào quá sát rìa (< 12 hoặc > 88)
 * - Khoảng cách giữa 2 bóng bất kỳ >= minSpacing
 */
export function validateLevelConfig(
  level: LevelConfig,
  minSpacing: number = 18
): { valid: boolean; reason?: string } {
  if (level.balls.length !== level.pairsCount * 2) {
    return { valid: false, reason: 'Số lượng bóng không bằng 2 lần số cặp' };
  }

  const colorCounts = new Map<BallColorId, number>();
  for (const ball of level.balls) {
    if (ball.x < 12 || ball.x > 88 || ball.y < 12 || ball.y > 88) {
      return { valid: false, reason: `Bóng ${ball.id} đặt quá sát cạnh màn hình` };
    }
    colorCounts.set(ball.colorId, (colorCounts.get(ball.colorId) ?? 0) + 1);
  }

  for (const [color, count] of colorCounts.entries()) {
    if (count !== 2) {
      return { valid: false, reason: `Màu ${color} xuất hiện ${count} lần (phải là 2)` };
    }
  }

  for (let i = 0; i < level.balls.length; i++) {
    for (let j = i + 1; j < level.balls.length; j++) {
      const d = distanceBetween(level.balls[i], level.balls[j]);
      if (d < minSpacing) {
        return {
          valid: false,
          reason: `Hai bóng ${level.balls[i].id} và ${level.balls[j].id} quá gần nhau (${d.toFixed(1)})`
        };
      }
    }
  }

  return { valid: true };
}

/**
 * Bộ tạo số giả ngẫu nhiên có seed để màn sinh thêm luôn ổn định khi xoay màn hình hoặc chơi lại
 */
function createSeededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Sinh màn chơi động cho các màn sau 20 hoặc khi cần điều chỉnh số cặp thích ứng
 */
export function generateDynamicLevel(
  levelId: number,
  ageGroup: AgeGroup,
  targetPairsCount: number,
  ballSizeScale: number
): LevelConfig {
  const safePairs = Math.max(2, Math.min(5, targetPairsCount));
  const rng = createSeededRandom(levelId * 997 + ageGroup * 31);

  // Chọn danh sách màu
  const shuffledColors = [...ALL_COLOR_IDS].sort(() => rng() - 0.5);
  const selectedColors = shuffledColors.slice(0, safePairs);

  // Tạo lưới vị trí ứng viên cách đều an toàn, đảm bảo không chồng lấn và luôn có đường nối
  const candidateSlots: Point[] = [
    { x: 24, y: 20 },
    { x: 50, y: 20 },
    { x: 76, y: 20 },
    { x: 22, y: 40 },
    { x: 50, y: 40 },
    { x: 78, y: 40 },
    { x: 22, y: 60 },
    { x: 50, y: 60 },
    { x: 78, y: 60 },
    { x: 24, y: 80 },
    { x: 50, y: 80 },
    { x: 76, y: 80 }
  ];

  const chosenSlots = [...candidateSlots]
    .sort(() => rng() - 0.5)
    .slice(0, safePairs * 2);

  const balls: BallNode[] = [];
  for (let i = 0; i < safePairs; i++) {
    const colorId = selectedColors[i];
    const slotA = chosenSlots[i * 2];
    const slotB = chosenSlots[i * 2 + 1];
    balls.push(
      {
        id: `gen-${levelId}-${colorId}-1`,
        colorId,
        x: slotA.x,
        y: slotA.y
      },
      {
        id: `gen-${levelId}-${colorId}-2`,
        colorId,
        x: slotB.x,
        y: slotB.y
      }
    );
  }

  return {
    id: levelId,
    ageGroup,
    title: `Khám Phá Màn ${levelId}`,
    pairsCount: safePairs,
    colors: selectedColors,
    balls,
    preventCrossing: false,
    hintLevel: ageGroup === 3 ? 'high' : 'medium',
    ballSizeScale,
    description: 'Tìm hai quả bóng cùng màu và nối chúng lại nhé!'
  };
}

/**
 * Lấy màn chơi theo ID và điều chỉnh nhẹ nếu cơ chế thích ứng yêu cầu giảm số cặp
 */
export function getLevelById(
  levelId: number,
  adaptiveOptions?: { reducePairs?: boolean; boostBallSize?: boolean; nonCrossingMode?: boolean }
): LevelConfig {
  const preset = PRESET_LEVELS.find((l) => l.id === levelId);

  if (!preset) {
    const defaultAge: AgeGroup = levelId <= 10 ? 3 : 4;
    const basePairs = defaultAge === 3 ? 3 : 4;
    const pairs = adaptiveOptions?.reducePairs ? Math.max(2, basePairs - 1) : basePairs;
    const level = generateDynamicLevel(
      levelId,
      defaultAge,
      pairs,
      adaptiveOptions?.boostBallSize ? 1.12 : 1.0
    );
    return {
      ...level,
      preventCrossing: Boolean(adaptiveOptions?.nonCrossingMode)
    };
  }

  // Nếu cơ chế thích ứng phát hiện bé đang gặp khó khăn ở màn có >= 3 cặp,
  // giảm nhẹ 1 cặp bóng nhưng vẫn giữ bố cục gốc để bé tự tin vượt qua
  if (adaptiveOptions?.reducePairs && preset.pairsCount > 2) {
    const reducedPairsCount = preset.pairsCount - 1;
    const allowedColors = preset.colors.slice(0, reducedPairsCount);
    const filteredBalls = preset.balls.filter((b) => allowedColors.includes(b.colorId));
    return {
      ...preset,
      pairsCount: reducedPairsCount,
      colors: allowedColors,
      balls: filteredBalls,
      ballSizeScale: Math.min(1.2, preset.ballSizeScale + 0.1),
      hintLevel: 'high',
      preventCrossing: false
    };
  }

  return {
    ...preset,
    ballSizeScale: adaptiveOptions?.boostBallSize
      ? Math.min(1.2, preset.ballSizeScale + 0.08)
      : preset.ballSizeScale,
    preventCrossing: preset.preventCrossing || Boolean(adaptiveOptions?.nonCrossingMode)
  };
}
