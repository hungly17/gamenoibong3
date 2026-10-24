import {
  AdaptivePerformance,
  AgeGroup,
  CompletedConnection,
  GameMode,
  LevelConfig,
  STICKER_COLLECTION,
  StickerDefinition
} from './gameTypes';
import { getLevelById } from './levelGenerator';

export interface PersistentProgress {
  selectedAge: AgeGroup;
  currentLevelId: number;
  unlockedLevelIds: number[];
  starsByLevel: Record<number, number>;
  tutorialSeen: boolean;
  soundEnabled: boolean;
  nonCrossingMode: boolean;
  gameMode: GameMode;
}

const STORAGE_KEY = 'be_noi_bong_mau_progress_v1';

export function loadProgressFromStorage(): PersistentProgress {
  const defaultState: PersistentProgress = {
    selectedAge: 3,
    currentLevelId: 1,
    unlockedLevelIds: [1, 11],
    starsByLevel: {},
    tutorialSeen: false,
    soundEnabled: true,
    nonCrossingMode: false,
    gameMode: 'classic'
  };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<PersistentProgress>;
    const validModes: GameMode[] = ['classic', 'animals', 'shapes'];
    return {
      selectedAge: parsed.selectedAge === 4 ? 4 : 3,
      currentLevelId:
        typeof parsed.currentLevelId === 'number' && parsed.currentLevelId >= 1
          ? parsed.currentLevelId
          : 1,
      unlockedLevelIds: Array.isArray(parsed.unlockedLevelIds)
        ? parsed.unlockedLevelIds
        : [1, 11],
      starsByLevel:
        parsed.starsByLevel && typeof parsed.starsByLevel === 'object'
          ? parsed.starsByLevel
          : {},
      tutorialSeen: Boolean(parsed.tutorialSeen),
      soundEnabled: parsed.soundEnabled !== undefined ? Boolean(parsed.soundEnabled) : true,
      nonCrossingMode: Boolean(parsed.nonCrossingMode),
      gameMode:
        parsed.gameMode && validModes.includes(parsed.gameMode)
          ? parsed.gameMode
          : 'classic'
    };
  } catch {
    return defaultState;
  }
}

export function saveProgressToStorage(progress: PersistentProgress): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Bỏ qua nếu trình duyệt chặn localStorage
  }
}

/**
 * Tính tổng số sao bé đã tích lũy được trên tất cả các màn
 */
export function getTotalStarsEarned(starsByLevel: Record<number, number>): number {
  return Object.values(starsByLevel).reduce((sum, count) => sum + (count || 0), 0);
}

/**
 * Lấy danh sách nhãn dán (Stickers) bé đã mở khóa
 */
export function getUnlockedStickers(
  starsByLevel: Record<number, number>
): StickerDefinition[] {
  const total = getTotalStarsEarned(starsByLevel);
  return STICKER_COLLECTION.filter((stk) => total >= stk.requiredStars);
}

/**
 * Kiểm tra xem sau màn chơi này bé có vừa mở khóa thêm nhãn dán mới nào không
 */
export function getNewlyUnlockedSticker(
  prevTotalStars: number,
  nextTotalStars: number
): StickerDefinition | null {
  if (nextTotalStars <= prevTotalStars) return null;
  const newlyUnlocked = STICKER_COLLECTION.find(
    (stk) => stk.requiredStars > prevTotalStars && stk.requiredStars <= nextTotalStars
  );
  return newlyUnlocked ?? null;
}

/**
 * Lấy màn khởi đầu phù hợp khi bé chọn độ tuổi trên trang chủ
 */
export function getStartingLevelForAge(age: AgeGroup): number {
  return age === 3 ? 1 : 11;
}

/**
 * Kiểm tra xem màn chơi đã hoàn thành toàn bộ các cặp bóng chưa
 */
export function isLevelComplete(
  level: LevelConfig,
  completedConnections: CompletedConnection[]
): boolean {
  return completedConnections.length >= level.pairsCount;
}

/**
 * Xây dựng cấu hình màn chơi hiện tại kết hợp với bộ điều chỉnh độ khó thích ứng
 * Đồng thời gán pairRole (0 hoặc 1) cho từng cặp bóng để phục vụ chế độ Thú Cưng & Món Ăn
 */
export function buildActiveLevelConfig(
  levelId: number,
  adaptive: AdaptivePerformance,
  nonCrossingMode: boolean
): LevelConfig {
  const rawLevel = getLevelById(levelId, {
    reducePairs: adaptive.assistanceBoost && adaptive.strugglingStreak >= 2,
    boostBallSize: adaptive.assistanceBoost,
    nonCrossingMode
  });

  const seenByColor = new Map<string, number>();
  const ballsWithRole = rawLevel.balls.map((b) => {
    const count = seenByColor.get(b.colorId) ?? 0;
    seenByColor.set(b.colorId, count + 1);
    return {
      ...b,
      pairRole: (count === 0 ? 0 : 1) as 0 | 1
    };
  });

  return {
    ...rawLevel,
    balls: ballsWithRole
  };
}

export const PRAISE_MESSAGES_VI = [
  'Giỏi quá! Con làm tốt lắm!',
  'Tuyệt vời! Con tìm đúng hết rồi!',
  'Xuất sắc quá! Bé nối bóng siêu thật!',
  'Hoan hô! Các bạn bóng đã gặp nhau rồi!'
];

export const STEP_PRAISE_VI = [
  'Giỏi quá!',
  'Con tìm đúng rồi!',
  'Tuyệt vời!',
  'Đúng màu rồi nè!'
];
