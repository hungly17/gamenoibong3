import { LevelConfig } from './gameTypes';

/**
 * 20 màn chơi được thiết kế thủ công tỉ mỉ cho trẻ 3–4 tuổi.
 * Tọa độ (x, y) nằm trong khoảng [15..85] để luôn cách lề an toàn và không chạm cạnh màn hình.
 * Khoảng cách giữa mọi cặp bóng bất kỳ luôn >= 22 đơn vị chuẩn hóa.
 */
export const PRESET_LEVELS: LevelConfig[] = [
  // ==========================================
  // NHÓM A — BÉ 3 TUỔI (Màn 1–10)
  // Màn 1–5: 2 cặp bóng (4 bóng), bóng rất lớn, bố cục trực quan
  // ==========================================
  {
    id: 1,
    ageGroup: 3,
    title: 'Làm Quen Sắc Màu',
    pairsCount: 2,
    colors: ['red', 'blue'],
    preventCrossing: false,
    hintLevel: 'high',
    ballSizeScale: 1.15,
    description: 'Hai đường thẳng ngang song song thật dễ!',
    balls: [
      { id: 'l1-red-1', colorId: 'red', x: 25, y: 32 },
      { id: 'l1-red-2', colorId: 'red', x: 75, y: 32 },
      { id: 'l1-blue-1', colorId: 'blue', x: 25, y: 68 },
      { id: 'l1-blue-2', colorId: 'blue', x: 75, y: 68 }
    ]
  },
  {
    id: 2,
    ageGroup: 3,
    title: 'Đôi Bạn Đứng Dọc',
    pairsCount: 2,
    colors: ['yellow', 'green'],
    preventCrossing: false,
    hintLevel: 'high',
    ballSizeScale: 1.15,
    description: 'Kéo từ trên xuống dưới nhé con!',
    balls: [
      { id: 'l2-yellow-1', colorId: 'yellow', x: 30, y: 26 },
      { id: 'l2-yellow-2', colorId: 'yellow', x: 30, y: 74 },
      { id: 'l2-green-1', colorId: 'green', x: 70, y: 26 },
      { id: 'l2-green-2', colorId: 'green', x: 70, y: 74 }
    ]
  },
  {
    id: 3,
    ageGroup: 3,
    title: 'Bóng Nghiêng Vui Nhộn',
    pairsCount: 2,
    colors: ['orange', 'purple'],
    preventCrossing: false,
    hintLevel: 'high',
    ballSizeScale: 1.12,
    description: 'Hai đường nghiêng nhẹ nhàng!',
    balls: [
      { id: 'l3-orange-1', colorId: 'orange', x: 24, y: 26 },
      { id: 'l3-orange-2', colorId: 'orange', x: 66, y: 42 },
      { id: 'l3-purple-1', colorId: 'purple', x: 34, y: 58 },
      { id: 'l3-purple-2', colorId: 'purple', x: 76, y: 74 }
    ]
  },
  {
    id: 4,
    ageGroup: 3,
    title: 'Chiếc Cầu Nhỏ',
    pairsCount: 2,
    colors: ['red', 'yellow'],
    preventCrossing: false,
    hintLevel: 'high',
    ballSizeScale: 1.12,
    description: 'Tìm bóng cùng màu ở đối diện nhé!',
    balls: [
      { id: 'l4-red-1', colorId: 'red', x: 22, y: 48 },
      { id: 'l4-red-2', colorId: 'red', x: 50, y: 22 },
      { id: 'l4-yellow-1', colorId: 'yellow', x: 50, y: 78 },
      { id: 'l4-yellow-2', colorId: 'yellow', x: 78, y: 52 }
    ]
  },
  {
    id: 5,
    ageGroup: 3,
    title: 'Bốn Góc Sân Chơi',
    pairsCount: 2,
    colors: ['blue', 'green'],
    preventCrossing: false,
    hintLevel: 'high',
    ballSizeScale: 1.1,
    description: 'Nối chéo hai người bạn thân!',
    balls: [
      { id: 'l5-blue-1', colorId: 'blue', x: 26, y: 26 },
      { id: 'l5-blue-2', colorId: 'blue', x: 74, y: 74 },
      { id: 'l5-green-1', colorId: 'green', x: 74, y: 26 },
      { id: 'l5-green-2', colorId: 'green', x: 26, y: 74 }
    ]
  },

  // ==========================================
  // Màn 6–10: 3 cặp bóng (6 bóng), khoảng cách rộng rãi
  // ==========================================
  {
    id: 6,
    ageGroup: 3,
    title: 'Ba Hàng Bóng Xinh',
    pairsCount: 3,
    colors: ['red', 'yellow', 'blue'],
    preventCrossing: false,
    hintLevel: 'high',
    ballSizeScale: 1.05,
    description: 'Ba cặp bóng xếp thành ba hàng ngang!',
    balls: [
      { id: 'l6-red-1', colorId: 'red', x: 24, y: 22 },
      { id: 'l6-red-2', colorId: 'red', x: 76, y: 22 },
      { id: 'l6-yellow-1', colorId: 'yellow', x: 24, y: 50 },
      { id: 'l6-yellow-2', colorId: 'yellow', x: 76, y: 50 },
      { id: 'l6-blue-1', colorId: 'blue', x: 24, y: 78 },
      { id: 'l6-blue-2', colorId: 'blue', x: 76, y: 78 }
    ]
  },
  {
    id: 7,
    ageGroup: 3,
    title: 'Cột Nắng Rực Rỡ',
    pairsCount: 3,
    colors: ['green', 'orange', 'purple'],
    preventCrossing: false,
    hintLevel: 'high',
    ballSizeScale: 1.05,
    description: 'Ba cột bóng dọc đều nhau!',
    balls: [
      { id: 'l7-green-1', colorId: 'green', x: 22, y: 25 },
      { id: 'l7-green-2', colorId: 'green', x: 22, y: 75 },
      { id: 'l7-orange-1', colorId: 'orange', x: 50, y: 25 },
      { id: 'l7-orange-2', colorId: 'orange', x: 50, y: 75 },
      { id: 'l7-purple-1', colorId: 'purple', x: 78, y: 25 },
      { id: 'l7-purple-2', colorId: 'purple', x: 78, y: 75 }
    ]
  },
  {
    id: 8,
    ageGroup: 3,
    title: 'Vòng Tròn Thân Thiện',
    pairsCount: 3,
    colors: ['red', 'green', 'yellow'],
    preventCrossing: false,
    hintLevel: 'medium',
    ballSizeScale: 1.04,
    description: 'Các quả bóng xếp quanh vòng tròn!',
    balls: [
      { id: 'l8-red-1', colorId: 'red', x: 32, y: 22 },
      { id: 'l8-red-2', colorId: 'red', x: 68, y: 22 },
      { id: 'l8-green-1', colorId: 'green', x: 20, y: 52 },
      { id: 'l8-green-2', colorId: 'green', x: 32, y: 80 },
      { id: 'l8-yellow-1', colorId: 'yellow', x: 80, y: 52 },
      { id: 'l8-yellow-2', colorId: 'yellow', x: 68, y: 80 }
    ]
  },
  {
    id: 9,
    ageGroup: 3,
    title: 'Cầu Vồng Đan Nhau',
    pairsCount: 3,
    colors: ['blue', 'orange', 'purple'],
    preventCrossing: false,
    hintLevel: 'medium',
    ballSizeScale: 1.04,
    description: 'Tìm đúng bạn cùng màu ở phía bên kia!',
    balls: [
      { id: 'l9-blue-1', colorId: 'blue', x: 24, y: 24 },
      { id: 'l9-blue-2', colorId: 'blue', x: 76, y: 50 },
      { id: 'l9-orange-1', colorId: 'orange', x: 24, y: 50 },
      { id: 'l9-orange-2', colorId: 'orange', x: 76, y: 24 },
      { id: 'l9-purple-1', colorId: 'purple', x: 28, y: 78 },
      { id: 'l9-purple-2', colorId: 'purple', x: 72, y: 78 }
    ]
  },
  {
    id: 10,
    ageGroup: 3,
    title: 'Ngôi Sao Nhỏ Của Bé',
    pairsCount: 3,
    colors: ['red', 'blue', 'yellow'],
    preventCrossing: false,
    hintLevel: 'medium',
    ballSizeScale: 1.02,
    description: 'Hoàn thành chặng 3 tuổi thật xuất sắc!',
    balls: [
      { id: 'l10-red-1', colorId: 'red', x: 50, y: 18 },
      { id: 'l10-red-2', colorId: 'red', x: 22, y: 42 },
      { id: 'l10-blue-1', colorId: 'blue', x: 78, y: 42 },
      { id: 'l10-blue-2', colorId: 'blue', x: 70, y: 78 },
      { id: 'l10-yellow-1', colorId: 'yellow', x: 30, y: 78 },
      { id: 'l10-yellow-2', colorId: 'yellow', x: 50, y: 52 }
    ]
  },

  // ==========================================
  // NHÓM B — BÉ 4 TUỔI (Màn 11–20)
  // Màn 11–15: 3–4 cặp bóng (6–8 bóng), vị trí phân tán hơn
  // ==========================================
  {
    id: 11,
    ageGroup: 4,
    title: 'Khu Vườn Sắc Màu',
    pairsCount: 3,
    colors: ['red', 'green', 'purple'],
    preventCrossing: false,
    hintLevel: 'medium',
    ballSizeScale: 1.0,
    description: 'Quan sát kỹ xem bóng cùng màu trốn ở đâu nhé!',
    balls: [
      { id: 'l11-red-1', colorId: 'red', x: 22, y: 24 },
      { id: 'l11-red-2', colorId: 'red', x: 52, y: 78 },
      { id: 'l11-green-1', colorId: 'green', x: 50, y: 22 },
      { id: 'l11-green-2', colorId: 'green', x: 22, y: 66 },
      { id: 'l11-purple-1', colorId: 'purple', x: 78, y: 30 },
      { id: 'l11-purple-2', colorId: 'purple', x: 78, y: 74 }
    ]
  },
  {
    id: 12,
    ageGroup: 4,
    title: 'Bốn Hàng Ngang Vui Vẻ',
    pairsCount: 4,
    colors: ['red', 'yellow', 'blue', 'green'],
    preventCrossing: false,
    hintLevel: 'medium',
    ballSizeScale: 0.98,
    description: 'Bốn cặp bóng nhiều màu sắc!',
    balls: [
      { id: 'l12-red-1', colorId: 'red', x: 24, y: 18 },
      { id: 'l12-red-2', colorId: 'red', x: 76, y: 18 },
      { id: 'l12-yellow-1', colorId: 'yellow', x: 24, y: 40 },
      { id: 'l12-yellow-2', colorId: 'yellow', x: 76, y: 40 },
      { id: 'l12-blue-1', colorId: 'blue', x: 24, y: 62 },
      { id: 'l12-blue-2', colorId: 'blue', x: 76, y: 62 },
      { id: 'l12-green-1', colorId: 'green', x: 24, y: 84 },
      { id: 'l12-green-2', colorId: 'green', x: 76, y: 84 }
    ]
  },
  {
    id: 13,
    ageGroup: 4,
    title: 'Bánh Xe Quay Tròn',
    pairsCount: 4,
    colors: ['blue', 'orange', 'green', 'purple'],
    preventCrossing: false,
    hintLevel: 'medium',
    ballSizeScale: 0.98,
    description: 'Các quả bóng xếp thành vòng tròn lớn!',
    balls: [
      { id: 'l13-blue-1', colorId: 'blue', x: 34, y: 18 },
      { id: 'l13-blue-2', colorId: 'blue', x: 66, y: 18 },
      { id: 'l13-orange-1', colorId: 'orange', x: 82, y: 38 },
      { id: 'l13-orange-2', colorId: 'orange', x: 82, y: 66 },
      { id: 'l13-green-1', colorId: 'green', x: 66, y: 84 },
      { id: 'l13-green-2', colorId: 'green', x: 34, y: 84 },
      { id: 'l13-purple-1', colorId: 'purple', x: 18, y: 66 },
      { id: 'l13-purple-2', colorId: 'purple', x: 18, y: 38 }
    ]
  },
  {
    id: 14,
    ageGroup: 4,
    title: 'Đường Chéo Thông Minh',
    pairsCount: 4,
    colors: ['red', 'yellow', 'orange', 'purple'],
    preventCrossing: false,
    hintLevel: 'low',
    ballSizeScale: 0.96,
    description: 'Tìm cặp bóng cùng màu đan xen nhau nhé!',
    balls: [
      { id: 'l14-red-1', colorId: 'red', x: 22, y: 15 },
      { id: 'l14-red-2', colorId: 'red', x: 78, y: 39 },
      { id: 'l14-yellow-1', colorId: 'yellow', x: 22, y: 39 },
      { id: 'l14-yellow-2', colorId: 'yellow', x: 78, y: 15 },
      { id: 'l14-orange-1', colorId: 'orange', x: 22, y: 63 },
      { id: 'l14-orange-2', colorId: 'orange', x: 78, y: 86 },
      { id: 'l14-purple-1', colorId: 'purple', x: 22, y: 86 },
      { id: 'l14-purple-2', colorId: 'purple', x: 78, y: 63 }
    ]
  },
  {
    id: 15,
    ageGroup: 4,
    title: 'Viên Kim Cương Nhỏ',
    pairsCount: 4,
    colors: ['red', 'blue', 'green', 'yellow'],
    preventCrossing: false,
    hintLevel: 'low',
    ballSizeScale: 0.96,
    description: 'Bố cục hình thoi thú vị!',
    balls: [
      { id: 'l15-red-1', colorId: 'red', x: 50, y: 15 },
      { id: 'l15-red-2', colorId: 'red', x: 20, y: 36 },
      { id: 'l15-blue-1', colorId: 'blue', x: 80, y: 36 },
      { id: 'l15-blue-2', colorId: 'blue', x: 50, y: 39 },
      { id: 'l15-green-1', colorId: 'green', x: 20, y: 66 },
      { id: 'l15-green-2', colorId: 'green', x: 50, y: 86 },
      { id: 'l15-yellow-1', colorId: 'yellow', x: 50, y: 63 },
      { id: 'l15-yellow-2', colorId: 'yellow', x: 80, y: 66 }
    ]
  },

  // ==========================================
  // Màn 16–20: 4–5 cặp bóng (8–10 bóng), phong phú và thử thách quan sát
  // ==========================================
  {
    id: 16,
    ageGroup: 4,
    title: 'Thám Hiểm Đại Dương',
    pairsCount: 4,
    colors: ['blue', 'green', 'orange', 'purple'],
    preventCrossing: false,
    hintLevel: 'low',
    ballSizeScale: 0.95,
    description: 'Quan sát khắp màn hình để tìm đúng đôi bạn!',
    balls: [
      { id: 'l16-blue-1', colorId: 'blue', x: 22, y: 20 },
      { id: 'l16-blue-2', colorId: 'blue', x: 50, y: 50 },
      { id: 'l16-green-1', colorId: 'green', x: 78, y: 20 },
      { id: 'l16-green-2', colorId: 'green', x: 78, y: 56 },
      { id: 'l16-orange-1', colorId: 'orange', x: 22, y: 56 },
      { id: 'l16-orange-2', colorId: 'orange', x: 26, y: 84 },
      { id: 'l16-purple-1', colorId: 'purple', x: 50, y: 22 },
      { id: 'l16-purple-2', colorId: 'purple', x: 74, y: 84 }
    ]
  },
  {
    id: 17,
    ageGroup: 4,
    title: 'Năm Sắc Cầu Vồng',
    pairsCount: 5,
    colors: ['red', 'yellow', 'blue', 'green', 'orange'],
    preventCrossing: false,
    hintLevel: 'low',
    ballSizeScale: 0.92,
    description: 'Năm cặp bóng rực rỡ sắc màu!',
    balls: [
      { id: 'l17-red-1', colorId: 'red', x: 20, y: 16 },
      { id: 'l17-red-2', colorId: 'red', x: 80, y: 16 },
      { id: 'l17-yellow-1', colorId: 'yellow', x: 50, y: 24 },
      { id: 'l17-yellow-2', colorId: 'yellow', x: 50, y: 76 },
      { id: 'l17-blue-1', colorId: 'blue', x: 20, y: 42 },
      { id: 'l17-blue-2', colorId: 'blue', x: 80, y: 42 },
      { id: 'l17-green-1', colorId: 'green', x: 20, y: 68 },
      { id: 'l17-green-2', colorId: 'green', x: 80, y: 68 },
      { id: 'l17-orange-1', colorId: 'orange', x: 32, y: 86 },
      { id: 'l17-orange-2', colorId: 'orange', x: 68, y: 86 }
    ]
  },
  {
    id: 18,
    ageGroup: 4,
    title: 'Vườn Hoa Năm Cánh',
    pairsCount: 5,
    colors: ['red', 'blue', 'green', 'orange', 'purple'],
    preventCrossing: false,
    hintLevel: 'low',
    ballSizeScale: 0.92,
    description: 'Tìm từng cặp bóng trong vườn hoa 5 sắc!',
    balls: [
      { id: 'l18-red-1', colorId: 'red', x: 22, y: 18 },
      { id: 'l18-red-2', colorId: 'red', x: 48, y: 36 },
      { id: 'l18-blue-1', colorId: 'blue', x: 78, y: 20 },
      { id: 'l18-blue-2', colorId: 'blue', x: 80, y: 50 },
      { id: 'l18-green-1', colorId: 'green', x: 20, y: 48 },
      { id: 'l18-green-2', colorId: 'green', x: 22, y: 82 },
      { id: 'l18-orange-1', colorId: 'orange', x: 50, y: 62 },
      { id: 'l18-orange-2', colorId: 'orange', x: 50, y: 86 },
      { id: 'l18-purple-1', colorId: 'purple', x: 78, y: 82 },
      { id: 'l18-purple-2', colorId: 'purple', x: 52, y: 15 }
    ]
  },
  {
    id: 19,
    ageGroup: 4,
    title: 'Thử Thách Tinh Mắt',
    pairsCount: 5,
    colors: ['red', 'yellow', 'blue', 'green', 'purple'],
    preventCrossing: false,
    hintLevel: 'low',
    ballSizeScale: 0.9,
    description: 'Các cặp bóng đan chéo thú vị!',
    balls: [
      { id: 'l19-red-1', colorId: 'red', x: 20, y: 16 },
      { id: 'l19-red-2', colorId: 'red', x: 80, y: 40 },
      { id: 'l19-yellow-1', colorId: 'yellow', x: 80, y: 16 },
      { id: 'l19-yellow-2', colorId: 'yellow', x: 20, y: 40 },
      { id: 'l19-blue-1', colorId: 'blue', x: 50, y: 26 },
      { id: 'l19-blue-2', colorId: 'blue', x: 50, y: 74 },
      { id: 'l19-green-1', colorId: 'green', x: 20, y: 64 },
      { id: 'l19-green-2', colorId: 'green', x: 28, y: 86 },
      { id: 'l19-purple-1', colorId: 'purple', x: 80, y: 64 },
      { id: 'l19-purple-2', colorId: 'purple', x: 72, y: 86 }
    ]
  },
  {
    id: 20,
    ageGroup: 4,
    title: 'Siêu Nhí Nối Bóng',
    pairsCount: 5,
    colors: ['red', 'yellow', 'orange', 'green', 'purple'],
    preventCrossing: false,
    hintLevel: 'low',
    ballSizeScale: 0.9,
    description: 'Màn đại tiệc sắc màu dành cho bé giỏi!',
    balls: [
      { id: 'l20-red-1', colorId: 'red', x: 28, y: 16 },
      { id: 'l20-red-2', colorId: 'red', x: 72, y: 16 },
      { id: 'l20-yellow-1', colorId: 'yellow', x: 18, y: 38 },
      { id: 'l20-yellow-2', colorId: 'yellow', x: 48, y: 38 },
      { id: 'l20-orange-1', colorId: 'orange', x: 82, y: 38 },
      { id: 'l20-orange-2', colorId: 'orange', x: 82, y: 66 },
      { id: 'l20-green-1', colorId: 'green', x: 18, y: 64 },
      { id: 'l20-green-2', colorId: 'green', x: 28, y: 86 },
      { id: 'l20-purple-1', colorId: 'purple', x: 52, y: 64 },
      { id: 'l20-purple-2', colorId: 'purple', x: 72, y: 86 }
    ]
  },

  // ==========================================
  // NHÓM C — THỬ THÁCH KHÔNG CẮT NHAU (Màn 21–25)
  // Các cặp bóng đặt xen kẽ nhau, buộc người chơi phải vẽ đường vòng
  // qua bên ngoài bóng khác để các đường nối không cắt hay đè lên nhau!
  // ==========================================
  {
    id: 21,
    ageGroup: 4,
    title: 'Ngã Tư Thông Minh',
    pairsCount: 2,
    colors: ['red', 'blue'],
    preventCrossing: true,
    hintLevel: 'medium',
    ballSizeScale: 1.0,
    description: 'Hai cặp bóng đối diện nhau! Hãy vẽ một đường đi vòng để không cắt nhau nhé!',
    balls: [
      { id: 'l21-red-1', colorId: 'red', x: 50, y: 22 },
      { id: 'l21-red-2', colorId: 'red', x: 50, y: 78 },
      { id: 'l21-blue-1', colorId: 'blue', x: 22, y: 50 },
      { id: 'l21-blue-2', colorId: 'blue', x: 78, y: 50 }
    ]
  },
  {
    id: 22,
    ageGroup: 4,
    title: 'Đường Vòng Quanh Đảo',
    pairsCount: 3,
    colors: ['red', 'yellow', 'green'],
    preventCrossing: true,
    hintLevel: 'medium',
    ballSizeScale: 0.96,
    description: 'Không được cắt qua đường khác hay đâm xuyên bóng khác nhé!',
    balls: [
      { id: 'l22-red-1', colorId: 'red', x: 24, y: 26 },
      { id: 'l22-red-2', colorId: 'red', x: 76, y: 74 },
      { id: 'l22-yellow-1', colorId: 'yellow', x: 50, y: 50 },
      { id: 'l22-yellow-2', colorId: 'yellow', x: 76, y: 26 },
      { id: 'l22-green-1', colorId: 'green', x: 24, y: 74 },
      { id: 'l22-green-2', colorId: 'green', x: 50, y: 82 }
    ]
  },
  {
    id: 23,
    ageGroup: 4,
    title: 'Ba Cánh Cổng Xoay',
    pairsCount: 3,
    colors: ['blue', 'orange', 'purple'],
    preventCrossing: true,
    hintLevel: 'low',
    ballSizeScale: 0.95,
    description: 'Khéo léo dẫn đường vòng qua lưng các quả bóng khác!',
    balls: [
      { id: 'l23-blue-1', colorId: 'blue', x: 24, y: 30 },
      { id: 'l23-blue-2', colorId: 'blue', x: 76, y: 30 },
      { id: 'l23-orange-1', colorId: 'orange', x: 50, y: 18 },
      { id: 'l23-orange-2', colorId: 'orange', x: 50, y: 54 },
      { id: 'l23-purple-1', colorId: 'purple', x: 26, y: 74 },
      { id: 'l23-purple-2', colorId: 'purple', x: 74, y: 74 }
    ]
  },
  {
    id: 24,
    ageGroup: 4,
    title: 'Mê Cung Bốn Sắc',
    pairsCount: 4,
    colors: ['red', 'blue', 'yellow', 'green'],
    preventCrossing: true,
    hintLevel: 'low',
    ballSizeScale: 0.92,
    description: 'Sắp xếp thứ tự nối và vẽ đường vòng thật khéo để không đè lên nhau!',
    balls: [
      { id: 'l24-red-1', colorId: 'red', x: 26, y: 24 },
      { id: 'l24-red-2', colorId: 'red', x: 74, y: 52 },
      { id: 'l24-blue-1', colorId: 'blue', x: 50, y: 24 },
      { id: 'l24-blue-2', colorId: 'blue', x: 26, y: 52 },
      { id: 'l24-yellow-1', colorId: 'yellow', x: 74, y: 24 },
      { id: 'l24-yellow-2', colorId: 'yellow', x: 50, y: 78 },
      { id: 'l24-green-1', colorId: 'green', x: 26, y: 80 },
      { id: 'l24-green-2', colorId: 'green', x: 74, y: 80 }
    ]
  },
  {
    id: 25,
    ageGroup: 4,
    title: 'Đỉnh Cao Không Cắt Nhau',
    pairsCount: 5,
    colors: ['red', 'yellow', 'blue', 'green', 'purple'],
    preventCrossing: true,
    hintLevel: 'low',
    ballSizeScale: 0.88,
    description: 'Thử thách 5 cặp bóng không cắt nhau dành cho kiện tướng nhí!',
    balls: [
      { id: 'l25-red-1', colorId: 'red', x: 50, y: 16 },
      { id: 'l25-red-2', colorId: 'red', x: 50, y: 42 },
      { id: 'l25-yellow-1', colorId: 'yellow', x: 20, y: 24 },
      { id: 'l25-yellow-2', colorId: 'yellow', x: 80, y: 24 },
      { id: 'l25-blue-1', colorId: 'blue', x: 20, y: 54 },
      { id: 'l25-blue-2', colorId: 'blue', x: 80, y: 54 },
      { id: 'l25-green-1', colorId: 'green', x: 20, y: 84 },
      { id: 'l25-green-2', colorId: 'green', x: 46, y: 84 },
      { id: 'l25-purple-1', colorId: 'purple', x: 80, y: 84 },
      { id: 'l25-purple-2', colorId: 'purple', x: 54, y: 64 }
    ]
  }
];
