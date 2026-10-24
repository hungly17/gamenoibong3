import { BallNode, Point } from '../game/gameTypes';
import { distanceBetween, mapBallPositionForOrientation } from './geometry';

export interface BoardDimensions {
  width: number;
  height: number;
  isLandscape: boolean;
  isTabletOrLarger: boolean;
  ballDiameterPx: number;
  hitRadiusNormalized: number;
  visualRadiusNormalized: number;
}

/**
 * Tính toán kích thước hiển thị của bóng và vùng chạm mục tiêu (hit target)
 * dựa trên kích thước thực tế của khung chơi (GameBoard), số cặp bóng, và hệ số scale.
 */
export function computeBoardMetrics(
  boardWidth: number,
  boardHeight: number,
  pairsCount: number,
  ballSizeScale: number,
  balls: BallNode[]
): BoardDimensions {
  const safeW = Math.max(260, boardWidth);
  const safeH = Math.max(260, boardHeight);
  const isLandscape = safeW > safeH * 1.12;
  const minSide = Math.min(safeW, safeH);
  const isTabletOrLarger = minSide >= 600;

  // Đường kính cơ sở (CSS pixels):
  // - Trên điện thoại (minSide ~ 320-430): 66px - 86px
  // - Trên iPad / Tablet (minSide >= 600): 84px - 112px
  let baseRatio = 0.21;
  if (pairsCount <= 2) {
    baseRatio = 0.225;
  } else if (pairsCount === 3) {
    baseRatio = 0.195;
  } else if (pairsCount === 4) {
    baseRatio = 0.175;
  } else {
    baseRatio = 0.158;
  }

  const rawDiameter = minSide * baseRatio * ballSizeScale;
  const minDiameter = isTabletOrLarger ? 78 : pairsCount >= 5 ? 62 : 66;
  const maxDiameter = isTabletOrLarger ? 116 : 90;

  // Kiểm tra khoảng cách gần nhất giữa 2 bóng bất kỳ để đảm bảo không bao giờ chồng lấn
  let minPairDistNormalized = 100;
  for (let i = 0; i < balls.length; i++) {
    const p1 = mapBallPositionForOrientation(balls[i], isLandscape);
    for (let j = i + 1; j < balls.length; j++) {
      const p2 = mapBallPositionForOrientation(balls[j], isLandscape);
      const d = distanceBetween(p1, p2);
      if (d < minPairDistNormalized) {
        minPairDistNormalized = d;
      }
    }
  }

  // Khoảng cách tối đa cho phép theo khoảng cách 2 bóng gần nhất
  const maxAllowedBySpacingPx = (minPairDistNormalized / 100) * minSide * 0.76;
  const ballDiameterPx = Math.round(
    Math.max(minDiameter, Math.min(maxDiameter, rawDiameter, maxAllowedBySpacingPx))
  );

  // Quy đổi sang đơn vị chuẩn hóa (0..100)
  const visualRadiusNormalized = ((ballDiameterPx / 2) / minSide) * 100;

  // Vùng nhận diện mục tiêu rộng hơn đường viền bóng (khoảng 1.32x bán kính hiển thị),
  // nhưng không vượt quá 48% khoảng cách tới quả bóng gần nhất để tránh xung đột.
  const safeMaxHitRadius = Math.max(
    visualRadiusNormalized + 1.2,
    minPairDistNormalized * 0.48
  );
  const hitRadiusNormalized = Math.min(
    safeMaxHitRadius,
    Math.max(visualRadiusNormalized * 1.32, visualRadiusNormalized + 2.5)
  );

  return {
    width: safeW,
    height: safeH,
    isLandscape,
    isTabletOrLarger,
    ballDiameterPx,
    hitRadiusNormalized,
    visualRadiusNormalized
  };
}

/**
 * Chuyển đổi tọa độ clientX/clientY từ PointerEvent sang hệ tọa độ chuẩn hóa (0..100) của bảng chơi
 */
export function clientPointToNormalized(
  clientX: number,
  clientY: number,
  rect: DOMRect
): Point {
  if (rect.width <= 0 || rect.height <= 0) {
    return { x: 50, y: 50 };
  }
  const x = ((clientX - rect.left) / rect.width) * 100;
  const y = ((clientY - rect.top) / rect.height) * 100;
  return {
    x: Math.max(2, Math.min(98, x)),
    y: Math.max(2, Math.min(98, y))
  };
}
