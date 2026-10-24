import {
  BallNode,
  CompletedConnection,
  HintPair,
  Point
} from './gameTypes';
import {
  createCurvedConnectorPoints,
  distanceBetween,
  findPathObstacleBallCollision,
  findPolylinesCollisionPoint,
  mapBallPositionForOrientation,
  normalizeDrawnPath,
  unmapPointFromOrientation
} from '../utils/geometry';

export interface ConnectionAttemptResult {
  status:
    | 'valid'
    | 'wrong_color'
    | 'outside_target'
    | 'already_connected'
    | 'same_ball'
    | 'crossing_blocked';
  connection?: CompletedConnection;
  targetBall?: BallNode;
  collisionPoint?: Point;
}

/**
 * Kiểm tra một quả bóng đã được nối hoàn thành hay chưa
 */
export function isBallConnected(
  ballId: string,
  completedConnections: CompletedConnection[]
): boolean {
  return completedConnections.some(
    (conn) => conn.fromBallId === ballId || conn.toBallId === ballId
  );
}

/**
 * Lấy danh sách điểm hiển thị thực tế của một đường nối đã hoàn thành
 */
export function getDisplayPointsForConnection(
  conn: CompletedConnection,
  balls: BallNode[],
  isLandscape: boolean
): Point[] {
  if (conn.points && conn.points.length >= 2) {
    return conn.points.map((pt) => mapBallPositionForOrientation(pt, isLandscape));
  }
  const fromBall = balls.find((b) => b.id === conn.fromBallId);
  const toBall = balls.find((b) => b.id === conn.toBallId);
  if (!fromBall || !toBall) return [];
  const p1 = mapBallPositionForOrientation(fromBall, isLandscape);
  const p2 = mapBallPositionForOrientation(toBall, isLandscape);
  return createCurvedConnectorPoints(p1, p2);
}

/**
 * Tìm quả bóng gần nhất nằm trong bán kính nhận diện (hitRadiusNormalized)
 */
export function findBallAtPoint(
  point: Point,
  balls: BallNode[],
  hitRadiusNormalized: number,
  isLandscape: boolean,
  excludeBallId?: string
): BallNode | null {
  let closestBall: BallNode | null = null;
  let minDistance = Infinity;

  for (const ball of balls) {
    if (excludeBallId && ball.id === excludeBallId) continue;
    const ballPos = mapBallPositionForOrientation(ball, isLandscape);
    const dist = distanceBetween(point, ballPos);
    if (dist <= hitRadiusNormalized && dist < minDistance) {
      minDistance = dist;
      closestBall = ball;
    }
  }

  return closestBall;
}

/**
 * Kiểm tra một đoạn thẳng hoặc đường gấp khúc có bị cắt/đè lên đường nối khác
 * hoặc đâm xuyên qua quả bóng khác trong chế độ Không Cắt Nhau hay không.
 */
export function detectNonCrossingCollision(params: {
  candidatePathDisplay: Point[];
  startBallId: string;
  targetBallId?: string | null;
  balls: BallNode[];
  completedConnections: CompletedConnection[];
  ballObstacleRadiusNormalized: number;
  isLandscape: boolean;
}): {
  collided: boolean;
  collisionPoint: Point | null;
  blockedByConnectionId: string | null;
  blockedByBallId: string | null;
} {
  const {
    candidatePathDisplay,
    startBallId,
    targetBallId,
    balls,
    completedConnections,
    ballObstacleRadiusNormalized,
    isLandscape
  } = params;

  // 1. Kiểm tra cắt hoặc đè lên các đường nối đã hoàn thành
  for (const existing of completedConnections) {
    const existingDisplay = getDisplayPointsForConnection(existing, balls, isLandscape);
    const hitPoint = findPolylinesCollisionPoint(
      candidatePathDisplay,
      existingDisplay,
      2.3 // Khoảng cách tối thiểu giữa tâm 2 dây để không đè lên nhau
    );
    if (hitPoint) {
      return {
        collided: true,
        collisionPoint: hitPoint,
        blockedByConnectionId: existing.id,
        blockedByBallId: null
      };
    }
  }

  // 2. Kiểm tra đường vẽ đâm xuyên qua quả bóng khác (vật cản bóng)
  const ignoreIds = [startBallId];
  if (targetBallId) ignoreIds.push(targetBallId);

  const ballHit = findPathObstacleBallCollision(
    candidatePathDisplay,
    balls,
    ballObstacleRadiusNormalized,
    ignoreIds,
    isLandscape
  );
  if (ballHit) {
    return {
      collided: true,
      collisionPoint: ballHit.point,
      blockedByConnectionId: null,
      blockedByBallId: ballHit.ball.id
    };
  }

  return {
    collided: false,
    collisionPoint: null,
    blockedByConnectionId: null,
    blockedByBallId: null
  };
}

/**
 * Kiểm tra kết quả khi người chơi thả ngón tay kết thúc thao tác kéo
 */
export function evaluateConnectionAttempt(params: {
  startBall: BallNode;
  releasePoint: Point;
  dragPathPoints: Point[];
  balls: BallNode[];
  completedConnections: CompletedConnection[];
  hitRadiusNormalized: number;
  visualRadiusNormalized?: number;
  isLandscape: boolean;
  preventCrossing: boolean;
}): ConnectionAttemptResult {
  const {
    startBall,
    releasePoint,
    dragPathPoints,
    balls,
    completedConnections,
    hitRadiusNormalized,
    visualRadiusNormalized = hitRadiusNormalized * 0.72,
    isLandscape,
    preventCrossing
  } = params;

  if (isBallConnected(startBall.id, completedConnections)) {
    return { status: 'already_connected' };
  }

  const hitBall = findBallAtPoint(releasePoint, balls, hitRadiusNormalized, isLandscape);

  if (!hitBall) {
    return { status: 'outside_target' };
  }

  if (hitBall.id === startBall.id) {
    return { status: 'same_ball', targetBall: hitBall };
  }

  if (isBallConnected(hitBall.id, completedConnections)) {
    return { status: 'already_connected', targetBall: hitBall };
  }

  if (hitBall.colorId !== startBall.colorId) {
    return { status: 'wrong_color', targetBall: hitBall };
  }

  const startPos = mapBallPositionForOrientation(startBall, isLandscape);
  const endPos = mapBallPositionForOrientation(hitBall, isLandscape);

  // Giữ nguyên đường đi vòng của người chơi (đã làm mượt) thay vì ép thành đường thẳng!
  const candidateDisplayPath = normalizeDrawnPath(dragPathPoints, startPos, endPos);

  if (preventCrossing) {
    const collisionCheck = detectNonCrossingCollision({
      candidatePathDisplay: candidateDisplayPath,
      startBallId: startBall.id,
      targetBallId: hitBall.id,
      balls,
      completedConnections,
      ballObstacleRadiusNormalized: Math.max(4.5, visualRadiusNormalized * 0.86),
      isLandscape
    });

    if (collisionCheck.collided) {
      return {
        status: 'crossing_blocked',
        targetBall: hitBall,
        collisionPoint: collisionCheck.collisionPoint ?? undefined
      };
    }
  }

  const storedPortraitPoints = candidateDisplayPath.map((pt) =>
    unmapPointFromOrientation(pt, isLandscape)
  );

  const connection: CompletedConnection = {
    id: `conn-${startBall.colorId}-${startBall.id}-${hitBall.id}`,
    colorId: startBall.colorId,
    fromBallId: startBall.id,
    toBallId: hitBall.id,
    points: storedPortraitPoints
  };

  return {
    status: 'valid',
    connection,
    targetBall: hitBall
  };
}

/**
 * Tìm một cặp bóng chưa nối để làm gợi ý
 */
export function findNextHintPair(
  balls: BallNode[],
  completedConnections: CompletedConnection[]
): HintPair | null {
  const connectedIds = new Set<string>();
  for (const c of completedConnections) {
    connectedIds.add(c.fromBallId);
    connectedIds.add(c.toBallId);
  }

  const remaining = balls.filter((b) => !connectedIds.has(b.id));
  if (remaining.length < 2) return null;

  const first = remaining[0];
  const partner = remaining.find((b) => b.id !== first.id && b.colorId === first.colorId);
  if (!partner) return null;

  return {
    fromBallId: first.id,
    toBallId: partner.id,
    colorId: first.colorId
  };
}
