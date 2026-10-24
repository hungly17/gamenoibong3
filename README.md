# 🎈 Bé Nối Bóng Màu — Web Game Giáo Dục Cho Trẻ 3–4 Tuổi

**Bé Nối Bóng Màu** là trò chơi giáo dục tương tác chạy trực tiếp trên trình duyệt (Mobile, iPad/Tablet, Desktop) được thiết kế chuyên biệt cho trẻ mầm non từ **3 đến 4 tuổi**, giúp trẻ:
- Nhận biết và phân biệt 6 màu sắc tươi sáng (Đỏ, Vàng, Xanh dương, Xanh lá, Cam, Tím).
- Rèn luyện kỹ năng vận động tinh (Fine Motor Skills) và phối hợp tay – mắt.
- Phát triển khả năng quan sát, tìm cặp tương ứng và tư duy giải quyết vấn đề.

---

## ✨ Tính năng nổi bật

1. **4 Màn hình hoàn chỉnh**:
   - **Trang chủ**: Chọn độ tuổi (**Bé 3 tuổi** / **Bé 4 tuổi**), bật/tắt âm thanh, mở danh sách 20 màn chơi, nút lớn **BẮT ĐẦU CHƠI**.
   - **Hướng dẫn tương tác**: Nhân vật **Thỏ Bông** và bàn tay minh họa trực quan thao tác chạm – kéo nối hai quả bóng cùng màu (trẻ có thể tự kéo thử ngay trên màn hướng dẫn hoặc bấm bỏ qua).
   - **Màn chơi chính**: Hiển thị tiến độ trực quan, lời khích lệ của Thỏ Bông, bảng chơi cảm ứng mượt mà chiếm phần lớn diện tích màn hình, nút **Gợi ý** và **Chơi lại**.
   - **Màn hình chiến thắng**: Hiệu ứng bóng phát sáng, mưa giấy màu (tôn trọng `prefers-reduced-motion`), 3 ngôi sao lấp lánh, lời khen tiếng Việt, nút **CHƠI TIẾP** và **VỀ TRANG CHỦ**.
2. **Tối ưu thao tác cảm ứng (Touch & Pointer Events)**:
   - Hỗ trợ đầy đủ `pointerdown`, `pointermove`, `pointerup`, `pointercancel` và `setPointerCapture`.
   - Ngăn cuộn trang và thu phóng ngoài ý muốn (`touch-action: none`).
   - Vùng nhận diện mục tiêu rộng hơn đường viền bóng và tự hút nhẹ khi ngón tay bé đến gần quả bóng cùng màu.
3. **20 Màn chơi thiết kế riêng + Level Generator + Độ khó thích ứng**:
   - **Màn 1–10 (Bé 3 tuổi)**: Từ 2 cặp (4 bóng lớn) đến 3 cặp (6 bóng), bố cục trực quan, dễ quan sát.
   - **Màn 11–20 (Bé 4 tuổi)**: Từ 3–4 cặp đến 5 cặp (8–10 bóng), bố cục đa dạng, hỗ trợ chế độ nâng cao không cắt đường nối.
   - **Độ khó thích ứng (Adaptive Difficulty)**: Tự động điều chỉnh kích thước bóng, tần suất gợi ý và số cặp bóng nếu phát hiện bé gặp khó khăn.
4. **Âm thanh Web Audio API tự thân**:
   - Không phụ thuộc file âm thanh bên ngoài, hoạt động 100% offline.

---

## 🚀 Hướng dẫn cài đặt và chạy dự án

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Sau khi chạy, mở trình duyệt tại địa chỉ `http://localhost:5173`.

### 3. Chạy kiểm thử tự động (Unit & Logic Tests)
```bash
npm test
```

### 4. Build bản Production
```bash
npm run build
```
Kết quả build tĩnh sẽ nằm trong thư mục `dist/`. Để xem thử bản build production tại máy:
```bash
npm run preview
```

---

## 🌐 Triển khai (Deployment)
Dự án là ứng dụng Single Page Application (SPA) tĩnh hoàn toàn, không yêu cầu backend. Bạn có thể tải trực tiếp thư mục `dist/` lên bất kỳ dịch vụ hosting web tĩnh nào như **Vercel**, **Netlify**, **Cloudflare Pages**, hoặc **GitHub Pages**.
