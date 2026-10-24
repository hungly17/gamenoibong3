import { AdaptivePerformance, AgeGroup } from './gameTypes';

export function createInitialAdaptiveState(): AdaptivePerformance {
  return {
    wrongAttemptsInLevel: 0,
    hintsUsedInLevel: 0,
    totalCompletedLevels: 0,
    consecutiveCleanLevels: 0,
    strugglingStreak: 0,
    assistanceBoost: false,
    challengeBoost: false
  };
}

/**
 * Cập nhật trạng thái thích ứng sau khi bé hoàn thành một màn chơi
 */
export function recordLevelCompletion(
  prev: AdaptivePerformance
): AdaptivePerformance {
  const hadDifficulty = prev.wrongAttemptsInLevel >= 3 || prev.hintsUsedInLevel >= 2;
  const wasClean = prev.wrongAttemptsInLevel <= 1 && prev.hintsUsedInLevel === 0;

  const newConsecutiveClean = wasClean ? prev.consecutiveCleanLevels + 1 : 0;
  const newStrugglingStreak = hadDifficulty ? prev.strugglingStreak + 1 : 0;

  return {
    wrongAttemptsInLevel: 0,
    hintsUsedInLevel: 0,
    totalCompletedLevels: prev.totalCompletedLevels + 1,
    consecutiveCleanLevels: newConsecutiveClean,
    strugglingStreak: newStrugglingStreak,
    assistanceBoost: hadDifficulty || newStrugglingStreak >= 1,
    challengeBoost: newConsecutiveClean >= 3
  };
}

/**
 * Tính số sao khen thưởng tích cực cho bé (luôn từ 2 đến 3 sao để khích lệ trẻ 3–4 tuổi)
 */
export function calculateStarsForCompletion(
  perf: AdaptivePerformance,
  ageGroup: AgeGroup
): number {
  if (ageGroup === 3) {
    // Với bé 3 tuổi, ưu tiên động viên tối đa
    if (perf.hintsUsedInLevel <= 2 && perf.wrongAttemptsInLevel <= 4) {
      return 3;
    }
    return 2;
  }

  if (perf.hintsUsedInLevel <= 1 && perf.wrongAttemptsInLevel <= 2) {
    return 3;
  }
  return 2;
}

/**
 * Tính thời gian chờ (ms) trước khi gợi ý tự động nhẹ nhàng xuất hiện nếu bé chưa thao tác
 */
export function getAutoHintIdleDelayMs(
  ageGroup: AgeGroup,
  perf: AdaptivePerformance
): number {
  if (perf.assistanceBoost) {
    return 6500;
  }
  if (perf.challengeBoost) {
    return 14000;
  }
  return ageGroup === 3 ? 8500 : 11000;
}
