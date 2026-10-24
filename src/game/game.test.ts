import { describe, expect, it } from 'vitest';
import {
  calculateStarsForCompletion,
  createInitialAdaptiveState,
  recordLevelCompletion
} from './adaptiveDifficulty';
import {
  evaluateConnectionAttempt,
  findBallAtPoint,
  findNextHintPair,
  isBallConnected
} from './connectionRules';
import {
  buildActiveLevelConfig,
  getNewlyUnlockedSticker,
  getStartingLevelForAge,
  getTotalStarsEarned,
  getUnlockedStickers,
  isLevelComplete
} from './gameEngine';
import { PRESET_LEVELS } from './levelData';
import {
  generateDynamicLevel,
  getLevelById,
  validateLevelConfig
} from './levelGenerator';
import { mapBallPositionForOrientation } from '../utils/geometry';
import { computeBoardMetrics } from '../utils/responsiveLayout';

describe('Kiểm thử hệ thống 20 màn chơi & Level Generator', () => {
  it('Có đầy đủ tối thiểu 20 màn chơi thiết kế sẵn', () => {
    expect(PRESET_LEVELS.length).toBeGreaterThanOrEqual(20);
  });

  it('Tất cả 20 màn chơi đều hợp lệ: mỗi màu đúng 2 bóng, không chồng lấn, không sát mép', () => {
    for (const level of PRESET_LEVELS) {
      const validation = validateLevelConfig(level, 18);
      expect(validation.valid, `Màn ${level.id} lỗi: ${validation.reason}`).toBe(true);
    }
  });

  it('Nhóm tuổi 3 (Màn 1-10) và Nhóm tuổi 4 (Màn 11-20) phân chia đúng chuẩn', () => {
    expect(getStartingLevelForAge(3)).toBe(1);
    expect(getStartingLevelForAge(4)).toBe(11);
    for (let id = 1; id <= 5; id++) {
      const lvl = getLevelById(id);
      expect(lvl.ageGroup).toBe(3);
      expect(lvl.pairsCount).toBe(2);
      expect(lvl.balls.length).toBe(4);
    }
    for (let id = 6; id <= 10; id++) {
      const lvl = getLevelById(id);
      expect(lvl.ageGroup).toBe(3);
      expect(lvl.pairsCount).toBe(3);
      expect(lvl.balls.length).toBe(6);
    }
    for (let id = 11; id <= 15; id++) {
      const lvl = getLevelById(id);
      expect(lvl.ageGroup).toBe(4);
      expect(lvl.pairsCount).toBeGreaterThanOrEqual(3);
      expect(lvl.pairsCount).toBeLessThanOrEqual(4);
    }
    for (let id = 16; id <= 20; id++) {
      const lvl = getLevelById(id);
      expect(lvl.ageGroup).toBe(4);
      expect(lvl.pairsCount).toBeGreaterThanOrEqual(4);
      expect(lvl.pairsCount).toBeLessThanOrEqual(5);
    }
  });

  it('Level generator cho màn > 20 sinh màn hợp lệ và không chồng lấn', () => {
    const dynLevel = generateDynamicLevel(21, 4, 4, 1.0);
    const check = validateLevelConfig(dynLevel, 18);
    expect(check.valid).toBe(true);
  });
});

describe('Kiểm thử luật nối bóng (Gameplay & Connection Rules)', () => {
  const level1 = getLevelById(1);
  const red1 = level1.balls.find((b) => b.id === 'l1-red-1')!;
  const red2 = level1.balls.find((b) => b.id === 'l1-red-2')!;
  const blue1 = level1.balls.find((b) => b.id === 'l1-blue-1')!;
  const blue2 = level1.balls.find((b) => b.id === 'l1-blue-2')!;

  it('Nối đúng 2 bóng cùng màu theo cả chiều thuận và chiều ngược', () => {
    const resForward = evaluateConnectionAttempt({
      startBall: red1,
      releasePoint: { x: red2.x, y: red2.y },
      dragPathPoints: [
        { x: red1.x, y: red1.y },
        { x: red2.x, y: red2.y }
      ],
      balls: level1.balls,
      completedConnections: [],
      hitRadiusNormalized: 12,
      isLandscape: false,
      preventCrossing: false
    });
    expect(resForward.status).toBe('valid');
    expect(resForward.connection?.colorId).toBe('red');

    // Chiều ngược từ red2 về red1
    const resReverse = evaluateConnectionAttempt({
      startBall: red2,
      releasePoint: { x: red1.x, y: red1.y },
      dragPathPoints: [
        { x: red2.x, y: red2.y },
        { x: red1.x, y: red1.y }
      ],
      balls: level1.balls,
      completedConnections: [],
      hitRadiusNormalized: 12,
      isLandscape: false,
      preventCrossing: false
    });
    expect(resReverse.status).toBe('valid');
  });

  it('Nối nhầm sang bóng khác màu trả về wrong_color và không tạo kết nối', () => {
    const resWrong = evaluateConnectionAttempt({
      startBall: red1,
      releasePoint: { x: blue1.x, y: blue1.y },
      dragPathPoints: [
        { x: red1.x, y: red1.y },
        { x: blue1.x, y: blue1.y }
      ],
      balls: level1.balls,
      completedConnections: [],
      hitRadiusNormalized: 12,
      isLandscape: false,
      preventCrossing: false
    });
    expect(resWrong.status).toBe('wrong_color');
    expect(resWrong.connection).toBeUndefined();
  });

  it('Thả ngón tay ngoài bóng đích trả về outside_target', () => {
    const resOutside = evaluateConnectionAttempt({
      startBall: red1,
      releasePoint: { x: 50, y: 50 },
      dragPathPoints: [
        { x: red1.x, y: red1.y },
        { x: 50, y: 50 }
      ],
      balls: level1.balls,
      completedConnections: [],
      hitRadiusNormalized: 10,
      isLandscape: false,
      preventCrossing: false
    });
    expect(resOutside.status).toBe('outside_target');
  });

  it('Ngăn một cặp bóng đã hoàn thành bị nối lại lần nữa', () => {
    const firstConn = evaluateConnectionAttempt({
      startBall: red1,
      releasePoint: { x: red2.x, y: red2.y },
      dragPathPoints: [
        { x: red1.x, y: red1.y },
        { x: red2.x, y: red2.y }
      ],
      balls: level1.balls,
      completedConnections: [],
      hitRadiusNormalized: 12,
      isLandscape: false,
      preventCrossing: false
    }).connection!;

    expect(isBallConnected(red1.id, [firstConn])).toBe(true);
    expect(isBallConnected(red2.id, [firstConn])).toBe(true);

    const repeatAttempt = evaluateConnectionAttempt({
      startBall: red1,
      releasePoint: { x: red2.x, y: red2.y },
      dragPathPoints: [
        { x: red1.x, y: red1.y },
        { x: red2.x, y: red2.y }
      ],
      balls: level1.balls,
      completedConnections: [firstConn],
      hitRadiusNormalized: 12,
      isLandscape: false,
      preventCrossing: false
    });
    expect(repeatAttempt.status).toBe('already_connected');
  });

  it('Hoàn thành tất cả cặp kích hoạt trạng thái hoàn thành màn và gợi ý trả về null', () => {
    const connRed = evaluateConnectionAttempt({
      startBall: red1,
      releasePoint: { x: red2.x, y: red2.y },
      dragPathPoints: [
        { x: red1.x, y: red1.y },
        { x: red2.x, y: red2.y }
      ],
      balls: level1.balls,
      completedConnections: [],
      hitRadiusNormalized: 12,
      isLandscape: false,
      preventCrossing: false
    }).connection!;

    // Khi mới nối 1 cặp, gợi ý sẽ chỉ ra cặp xanh dương còn lại
    const hint = findNextHintPair(level1.balls, [connRed]);
    expect(hint?.colorId).toBe('blue');

    const connBlue = evaluateConnectionAttempt({
      startBall: blue1,
      releasePoint: { x: blue2.x, y: blue2.y },
      dragPathPoints: [
        { x: blue1.x, y: blue1.y },
        { x: blue2.x, y: blue2.y }
      ],
      balls: level1.balls,
      completedConnections: [connRed],
      hitRadiusNormalized: 12,
      isLandscape: false,
      preventCrossing: false
    }).connection!;

    expect(isLevelComplete(level1, [connRed, connBlue])).toBe(true);
    expect(findNextHintPair(level1.balls, [connRed, connBlue])).toBeNull();
  });
});

describe('Kiểm thử Responsive Viewports & Xoay màn hình iPad/Mobile', () => {
  const viewports = [
    { name: 'Mobile nhỏ 360x640', w: 336, h: 460 },
    { name: 'iPhone 390x844', w: 366, h: 640 },
    { name: 'iPhone Max 430x932', w: 406, h: 720 },
    { name: 'iPad Dọc 768x1024', w: 720, h: 800 },
    { name: 'iPad Ngang 1024x768', w: 940, h: 560 },
    { name: 'Desktop 1366x768', w: 980, h: 560 }
  ];

  it('Tất cả các viewport chuẩn đều tạo kích thước bóng đủ lớn (>= 62px) và vùng chạm rộng hơn viền bóng mà không xung đột', () => {
    for (const vp of viewports) {
      for (const lvl of PRESET_LEVELS) {
        const metrics = computeBoardMetrics(
          vp.w,
          vp.h,
          lvl.pairsCount,
          lvl.ballSizeScale,
          lvl.balls
        );
        expect(metrics.ballDiameterPx).toBeGreaterThanOrEqual(62);
        expect(metrics.hitRadiusNormalized).toBeGreaterThan(
          metrics.visualRadiusNormalized
        );

        // Kiểm tra khi xoay ngang (isLandscape) không có 2 bóng nào chồng vùng chạm lên nhau
        for (let i = 0; i < lvl.balls.length; i++) {
          const p1 = mapBallPositionForOrientation(lvl.balls[i], metrics.isLandscape);
          const found = findBallAtPoint(
            p1,
            lvl.balls,
            metrics.hitRadiusNormalized,
            metrics.isLandscape
          );
          expect(found?.id).toBe(lvl.balls[i].id);
        }
      }
    }
  });
});

describe('Kiểm thử cơ chế tăng/giảm độ khó thích ứng', () => {
  it('Tự động hỗ trợ giảm số cặp và tăng kích thước bóng khi bé gặp khó khăn liên tiếp', () => {
    let perf = createInitialAdaptiveState();
    perf.wrongAttemptsInLevel = 4;
    perf.hintsUsedInLevel = 2;
    perf = recordLevelCompletion(perf);
    expect(perf.assistanceBoost).toBe(true);

    perf.wrongAttemptsInLevel = 3;
    perf = recordLevelCompletion(perf);
    expect(perf.strugglingStreak).toBe(2);

    const adaptedLevel6 = buildActiveLevelConfig(6, perf, false);
    expect(adaptedLevel6.pairsCount).toBe(2); // Giảm từ 3 cặp xuống 2 cặp
    expect(calculateStarsForCompletion(perf, 3)).toBeGreaterThanOrEqual(2);
  });

  it('Hệ thống Sổ Nhãn Dán (Sticker Book) và phân vai Thú - Món ăn hoạt động chính xác', () => {
    const activeLvl = buildActiveLevelConfig(1, createInitialAdaptiveState(), false);
    const redBalls = activeLvl.balls.filter((b) => b.colorId === 'red');
    expect(redBalls.map((b) => b.pairRole)).toEqual([0, 1]);

    const starsMap = { 1: 3, 2: 3 };
    expect(getTotalStarsEarned(starsMap)).toBe(6);
    expect(getUnlockedStickers(starsMap).length).toBeGreaterThanOrEqual(2);
    const newly = getNewlyUnlockedSticker(3, 6);
    expect(newly?.id).toBe('stk-rainbow');
  });

  it('Chế độ Khó (Không Cắt Nhau): chặn đường cắt nhau hoặc xuyên qua bóng khác, cho phép vẽ đường vòng', () => {
    const level21 = getLevelById(21);
    expect(level21.preventCrossing).toBe(true);

    const red1 = level21.balls.find((b) => b.id === 'l21-red-1')!; // (50, 22)
    const red2 = level21.balls.find((b) => b.id === 'l21-red-2')!; // (50, 78)
    const blue1 = level21.balls.find((b) => b.id === 'l21-blue-1')!; // (22, 50)
    const blue2 = level21.balls.find((b) => b.id === 'l21-blue-2')!; // (78, 50)

    // 1. Nối cặp Đỏ thẳng từ (50, 22) đến (50, 78)
    const redConnRes = evaluateConnectionAttempt({
      startBall: red1,
      releasePoint: { x: red2.x, y: red2.y },
      dragPathPoints: [
        { x: red1.x, y: red1.y },
        { x: red2.x, y: red2.y }
      ],
      balls: level21.balls,
      completedConnections: [],
      hitRadiusNormalized: 12,
      visualRadiusNormalized: 8,
      isLandscape: false,
      preventCrossing: true
    });
    expect(redConnRes.status).toBe('valid');

    // 2. Cố tình kéo cặp Xanh thẳng từ (22, 50) sang (78, 50) cắt ngang dây Đỏ -> phải bị chặn
    const blueCrossRes = evaluateConnectionAttempt({
      startBall: blue1,
      releasePoint: { x: blue2.x, y: blue2.y },
      dragPathPoints: [
        { x: blue1.x, y: blue1.y },
        { x: blue2.x, y: blue2.y }
      ],
      balls: level21.balls,
      completedConnections: [redConnRes.connection!],
      hitRadiusNormalized: 12,
      visualRadiusNormalized: 8,
      isLandscape: false,
      preventCrossing: true
    });
    expect(blueCrossRes.status).toBe('crossing_blocked');

    // 3. Kéo cặp Xanh đi vòng qua phía trên bóng Đỏ 1: (22,50) -> (20,8) -> (80,8) -> (78,50) -> hợp lệ!
    const blueDetourRes = evaluateConnectionAttempt({
      startBall: blue1,
      releasePoint: { x: blue2.x, y: blue2.y },
      dragPathPoints: [
        { x: blue1.x, y: blue1.y },
        { x: 20, y: 8 },
        { x: 50, y: 8 },
        { x: 80, y: 8 },
        { x: blue2.x, y: blue2.y }
      ],
      balls: level21.balls,
      completedConnections: [redConnRes.connection!],
      hitRadiusNormalized: 12,
      visualRadiusNormalized: 8,
      isLandscape: false,
      preventCrossing: true
    });
    expect(blueDetourRes.status).toBe('valid');
    expect(blueDetourRes.connection!.points.length).toBeGreaterThan(3);
  });
});
