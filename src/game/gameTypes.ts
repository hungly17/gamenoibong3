export type BallColorId = 'red' | 'yellow' | 'blue' | 'green' | 'orange' | 'purple';

export type GameMode = 'classic' | 'animals' | 'shapes';

export interface ColorDefinition {
  id: BallColorId;
  nameVi: string;
  hex: string;
  lightHex: string;
  darkHex: string;
  glowHex: string;
  symbol: 'star' | 'heart' | 'sun' | 'leaf' | 'flower' | 'moon';
  shapeNameVi: string;
  animalPair: {
    animalEmoji: string;
    animalNameVi: string;
    foodEmoji: string;
    foodNameVi: string;
  };
}

export const BALL_COLORS: Record<BallColorId, ColorDefinition> = {
  red: {
    id: 'red',
    nameVi: 'Màu Đỏ',
    hex: '#FF5C5C',
    lightHex: '#FF8A8A',
    darkHex: '#D93838',
    glowHex: 'rgba(255, 92, 92, 0.55)',
    symbol: 'heart',
    shapeNameVi: 'Trái Tim Đỏ',
    animalPair: {
      animalEmoji: '🐞',
      animalNameVi: 'Bọ Rùa Đỏ',
      foodEmoji: '🍓',
      foodNameVi: 'Dâu Tây Đỏ'
    }
  },
  yellow: {
    id: 'yellow',
    nameVi: 'Màu Vàng',
    hex: '#FFC83D',
    lightHex: '#FFE082',
    darkHex: '#E09F15',
    glowHex: 'rgba(255, 200, 61, 0.6)',
    symbol: 'sun',
    shapeNameVi: 'Hình Tròn Vàng',
    animalPair: {
      animalEmoji: '🐵',
      animalNameVi: 'Khỉ Con',
      foodEmoji: '🍌',
      foodNameVi: 'Chuối Vàng'
    }
  },
  blue: {
    id: 'blue',
    nameVi: 'Màu Xanh Dương',
    hex: '#4D96FF',
    lightHex: '#82B6FF',
    darkHex: '#256CD9',
    glowHex: 'rgba(77, 150, 255, 0.55)',
    symbol: 'star',
    shapeNameVi: 'Ngôi Sao Xanh',
    animalPair: {
      animalEmoji: '🐱',
      animalNameVi: 'Mèo Con',
      foodEmoji: '🐟',
      foodNameVi: 'Cá Xanh'
    }
  },
  green: {
    id: 'green',
    nameVi: 'Màu Xanh Lá',
    hex: '#55C98A',
    lightHex: '#85E0AD',
    darkHex: '#2FA164',
    glowHex: 'rgba(85, 201, 138, 0.55)',
    symbol: 'leaf',
    shapeNameVi: 'Chiếc Lá Xanh',
    animalPair: {
      animalEmoji: '🐼',
      animalNameVi: 'Gấu Trúc',
      foodEmoji: '🎋',
      foodNameVi: 'Trúc Xanh'
    }
  },
  orange: {
    id: 'orange',
    nameVi: 'Màu Cam',
    hex: '#FF9855',
    lightHex: '#FFB988',
    darkHex: '#E06E26',
    glowHex: 'rgba(255, 152, 85, 0.55)',
    symbol: 'flower',
    shapeNameVi: 'Bông Hoa Cam',
    animalPair: {
      animalEmoji: '🐰',
      animalNameVi: 'Thỏ Con',
      foodEmoji: '🥕',
      foodNameVi: 'Cà Rốt Cam'
    }
  },
  purple: {
    id: 'purple',
    nameVi: 'Màu Tím',
    hex: '#A78BFA',
    lightHex: '#C7B5FD',
    darkHex: '#7C5CE0',
    glowHex: 'rgba(167, 139, 250, 0.55)',
    symbol: 'moon',
    shapeNameVi: 'Mặt Trăng Tím',
    animalPair: {
      animalEmoji: '🦋',
      animalNameVi: 'Bướm Tím',
      foodEmoji: '🍇',
      foodNameVi: 'Nho Tím'
    }
  }
};

export interface StickerDefinition {
  id: string;
  emoji: string;
  nameVi: string;
  requiredStars: number;
  bgHex: string;
}

export const STICKER_COLLECTION: StickerDefinition[] = [
  { id: 'stk-bunny', emoji: '🐰', nameVi: 'Thỏ Bông Ngoan', requiredStars: 2, bgHex: '#FFE4E6' },
  { id: 'stk-rainbow', emoji: '🌈', nameVi: 'Cầu Vồng Bảy Sắc', requiredStars: 6, bgHex: '#E0F2FE' },
  { id: 'stk-teddy', emoji: '🧸', nameVi: 'Gấu Bông Ấm Áp', requiredStars: 12, bgHex: '#FEF3C7' },
  { id: 'stk-dino', emoji: '🦕', nameVi: 'Khủng Long Nhỏ', requiredStars: 18, bgHex: '#DCFCE7' },
  { id: 'stk-dolphin', emoji: '🐬', nameVi: 'Cá Heo Thông Minh', requiredStars: 24, bgHex: '#DBEAFE' },
  { id: 'stk-unicorn', emoji: '🦄', nameVi: 'Kỳ Lân Phép Thuật', requiredStars: 30, bgHex: '#F3E8FF' },
  { id: 'stk-rocket', emoji: '🚀', nameVi: 'Tên Lửa Vũ Trụ', requiredStars: 38, bgHex: '#FFEDD5' },
  { id: 'stk-crown', emoji: '👑', nameVi: 'Siêu Nhí Nối Bóng', requiredStars: 48, bgHex: '#FEF9C3' }
];

export type AgeGroup = 3 | 4;

export type ScreenName = 'home' | 'tutorial' | 'game' | 'victory';

export interface Point {
  x: number;
  y: number;
}

export interface BallNode {
  id: string;
  colorId: BallColorId;
  /** Tọa độ chuẩn hóa từ 0 đến 100 theo khung chuẩn dọc (portrait) */
  x: number;
  y: number;
  /** Vị trí thứ nhất (0) hay thứ hai (1) trong cặp màu để hiển thị Thú - Thức ăn */
  pairRole?: 0 | 1;
}

export interface CompletedConnection {
  id: string;
  colorId: BallColorId;
  fromBallId: string;
  toBallId: string;
  /** Danh sách các điểm chuẩn hóa (0..100) của đường nối */
  points: Point[];
}

export interface LevelConfig {
  id: number;
  ageGroup: AgeGroup;
  title: string;
  pairsCount: number;
  colors: BallColorId[];
  balls: BallNode[];
  preventCrossing: boolean;
  hintLevel: 'high' | 'medium' | 'low';
  ballSizeScale: number;
  description: string;
}

export interface AdaptivePerformance {
  wrongAttemptsInLevel: number;
  hintsUsedInLevel: number;
  totalCompletedLevels: number;
  consecutiveCleanLevels: number;
  strugglingStreak: number;
  assistanceBoost: boolean;
  challengeBoost: boolean;
}

export interface ActiveDragState {
  startBallId: string;
  colorId: BallColorId;
  currentPoint: Point;
  pathPoints: Point[];
  hoveredTargetBallId: string | null;
  collisionPoint?: Point | null;
  blockedByBallId?: string | null;
  blockedByConnectionId?: string | null;
}

export interface HintPair {
  fromBallId: string;
  toBallId: string;
  colorId: BallColorId;
}

export interface SparkleEffect {
  id: string;
  colorHex: string;
  points: [Point, Point];
  labelVi: string;
}
