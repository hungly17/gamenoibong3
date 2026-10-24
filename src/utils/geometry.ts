import { BallNode, Point } from '../game/gameTypes';

/**
 * Tính khoảng cách Euclid giữa hai điểm
 */
export function distanceBetween(p1: Point, p2: Point): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.hypot(dx, dy);
}

/**
 * Nội suy điểm giữa p1 và p2
 */
export function lerpPoint(p1: Point, p2: Point, t: number): Point {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t
  };
}

/**
 * Khoảng cách ngắn nhất từ điểm P đến đoạn thẳng AB, kèm tọa độ hình chiếu
 */
export function closestPointOnSegment(p: Point, a: Point, b: Point): { point: Point; distance: number } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 1e-6) {
    return { point: a, distance: distanceBetween(p, a) };
  }
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq));
  const proj = {
    x: a.x + t * dx,
    y: a.y + t * dy
  };
  return {
    point: proj,
    distance: distanceBetween(p, proj)
  };
}

/**
 * Tìm giao điểm thực sự giữa hai đoạn thẳng AB và CD (nếu có)
 */
export function getSegmentsIntersectionPoint(
  a: Point,
  b: Point,
  c: Point,
  d: Point
): Point | null {
  const rX = b.x - a.x;
  const rY = b.y - a.y;
  const sX = d.x - c.x;
  const sY = d.y - c.y;

  const denom = rX * sY - rY * sX;
  if (Math.abs(denom) < 1e-6) {
    return null;
  }

  const uNumerator = (c.x - a.x) * rY - (c.y - a.y) * rX;
  const tNumerator = (c.x - a.x) * sY - (c.y - a.y) * sX;

  const t = tNumerator / denom;
  const u = uNumerator / denom;

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: a.x + t * rX,
      y: a.y + t * rY
    };
  }

  return null;
}

/**
 * Kiểm tra hai đoạn thẳng AB và CD có cắt nhau thực sự hay không
 */
export function doSegmentsIntersect(a: Point, b: Point, c: Point, d: Point): boolean {
  return getSegmentsIntersectionPoint(a, b, c, d) !== null;
}

/**
 * Kiểm tra xem hai đường gấp khúc (danh sách điểm) có cắt nhau không
 */
export function doPolylinesIntersect(poly1: Point[], poly2: Point[]): boolean {
  return findPolylinesCollisionPoint(poly1, poly2, 0) !== null;
}

/**
 * Tìm điểm va chạm (cắt nhau hoặc đè sát lên nhau trong khoảng minClearance)
 * giữa hai đường nối poly1 và poly2.
 */
export function findPolylinesCollisionPoint(
  poly1: Point[],
  poly2: Point[],
  minClearance: number = 2.6
): Point | null {
  if (poly1.length < 2 || poly2.length < 2) return null;

  for (let i = 0; i < poly1.length - 1; i++) {
    const a = poly1[i];
    const b = poly1[i + 1];
    for (let j = 0; j < poly2.length - 1; j++) {
      const c = poly2[j];
      const d = poly2[j + 1];

      // 1. Kiểm tra cắt nhau trực tiếp
      const intersection = getSegmentsIntersectionPoint(a, b, c, d);
      if (intersection) {
        return intersection;
      }

      // 2. Kiểm tra đè/chạm quá sát lên nhau (overlap clearance)
      if (minClearance > 0) {
        const checkA = closestPointOnSegment(a, c, d);
        if (checkA.distance < minClearance) return lerpPoint(a, checkA.point, 0.5);

        const checkB = closestPointOnSegment(b, c, d);
        if (checkB.distance < minClearance) return lerpPoint(b, checkB.point, 0.5);

        const checkC = closestPointOnSegment(c, a, b);
        if (checkC.distance < minClearance) return lerpPoint(c, checkC.point, 0.5);

        const checkD = closestPointOnSegment(d, a, b);
        if (checkD.distance < minClearance) return lerpPoint(d, checkD.point, 0.5);
      }
    }
  }

  return null;
}

/**
 * Kiểm tra xem một đường nối có đi xuyên qua bất kỳ quả bóng nào khác
 * (ngoài bóng xuất phát và bóng đích) hay không.
 */
export function findPathObstacleBallCollision(
  pathPoints: Point[],
  balls: BallNode[],
  obstacleRadiusNormalized: number,
  ignoreBallIds: string[],
  isLandscape: boolean
): { ball: BallNode; point: Point } | null {
  if (pathPoints.length < 2) return null;
  const ignoreSet = new Set(ignoreBallIds);

  for (const ball of balls) {
    if (ignoreSet.has(ball.id)) continue;
    const ballCenter = mapBallPositionForOrientation(ball, isLandscape);

    for (let i = 0; i < pathPoints.length - 1; i++) {
      const segStart = pathPoints[i];
      const segEnd = pathPoints[i + 1];
      const closest = closestPointOnSegment(ballCenter, segStart, segEnd);
      if (closest.distance < obstacleRadiusNormalized) {
        return {
          ball,
          point: closest.point
        };
      }
    }
  }

  return null;
}

/**
 * Tạo đường cong SVG mượt (Quadratic Bezier) từ danh sách điểm
 */
export function buildSmoothSvgPath(points: Point[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) {
    return `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  }
  if (points.length === 2) {
    const [p1, p2] = points;
    return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} L ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const midX = (curr.x + next.x) / 2;
    const midY = (curr.y + next.y) / 2;
    d += ` Q ${curr.x.toFixed(2)} ${curr.y.toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  return d;
}

/**
 * Làm mượt và rút gọn hợp lý đường vẽ tay của người chơi để lưu trữ
 */
export function normalizeDrawnPath(
  rawDisplayPoints: Point[],
  startCenter: Point,
  endCenter: Point
): Point[] {
  if (rawDisplayPoints.length <= 2) {
    return createCurvedConnectorPoints(startCenter, endCenter);
  }

  const filtered: Point[] = [startCenter];
  for (let i = 1; i < rawDisplayPoints.length - 1; i++) {
    const pt = rawDisplayPoints[i];
    const prev = filtered[filtered.length - 1];
    if (distanceBetween(prev, pt) >= 3.2 && distanceBetween(pt, endCenter) >= 3.2) {
      filtered.push(pt);
    }
  }
  filtered.push(endCenter);

  if (filtered.length === 2) {
    return createCurvedConnectorPoints(startCenter, endCenter);
  }
  return filtered;
}

/**
 * Chuyển đổi một điểm từ không gian hiển thị (display) về không gian chuẩn dọc (portrait) để lưu trữ
 */
export function unmapPointFromOrientation(point: Point, isLandscape: boolean): Point {
  if (!isLandscape) {
    return { x: point.x, y: point.y };
  }
  return {
    x: 100 - point.y,
    y: point.x
  };
}

/**
 * Tạo đường cong gợi ý hoặc đường nối hoàn chỉnh mềm mại giữa hai tâm bóng
 */
export function createCurvedConnectorPoints(from: Point, to: Point): Point[] {
  const mid = lerpPoint(from, to, 0.5);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 1) return [from, to];

  const offset = Math.min(4.5, dist * 0.08);
  const normalX = -dy / dist;
  const normalY = dx / dist;

  const controlPoint: Point = {
    x: Math.max(6, Math.min(94, mid.x + normalX * offset)),
    y: Math.max(6, Math.min(94, mid.y + normalY * offset))
  };

  return [from, controlPoint, to];
}

/**
 * Chuyển đổi tọa độ bóng/điểm theo hướng màn hình (dọc vs ngang)
 */
export function mapBallPositionForOrientation(
  ball: { x: number; y: number },
  isLandscape: boolean
): Point {
  if (!isLandscape) {
    return { x: ball.x, y: ball.y };
  }
  return {
    x: ball.y,
    y: 100 - ball.x
  };
}
