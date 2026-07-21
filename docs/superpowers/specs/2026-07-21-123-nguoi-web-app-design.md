# Design Spec: Website Tương Tác "123 Người" (Aesthetic SPA)

**Ngày khởi tạo**: 2026-07-21  
**Trạng thái**: Đã phê duyệt (Approved)  
**Loại dự án**: Web SPA (HTML5 / CSS3 Vanilla / ES6 JavaScript)

---

## 1. Mụс tiêu & Tổng quan Dự án (Project Overview)
Xây dựng website SPA tương tác lãng mạn nghệ thuật mang tên **"123 Người"** dựa trên 4 mẫu thiết kế giao diện trong `/images`. 
Website mang phong cách hoài niệm vintage hồng dịu dàng (Pink & Vintage Studio Vibe), cho phép người dùng trải nghiệm trắc nghiệm tâm sự 12 câu hỏi, gửi lời nhắn ẩn danh vào hũ ước nguyện, nhận kết quả ghép đôi/gợi ý hành động, cùng trình phát nhạc nền cố định và hiệu ứng nền động sống động dịu dàng.

---

## 2. Kiến trúc & Công nghệ (Tech Architecture)
- **Công nghệ**: HTML5 ngữ nghĩa, CSS3 (Custom Properties, Glassmorphism, CSS Keyframe Animations), ES6 JavaScript (No external frameworks needed for lightning fast loading).
- **Cấu trúc lưu trữ**: Single Page Application với các View Section:
  - `#home`: Trang chủ lịch để bàn
  - `#quiz`: 12 Cánh cửa (Bộ trắc nghiệm)
  - `#wish-jar`: Bình Ước Nguyện (Nhập & Xem tin nhắn)
  - `#result`: Kết quả & Gợi ý hành động
- **Quản lý dữ liệu (State & Storage)**:
  - `LocalStorage`: Lưu trữ các câu trả lời trắc nghiệm, các tin nhắn trong Bình Ước Nguyện, trạng thái nhạc/âm lượng.
- **Audio Engine**: HTML5 Audio Element phát nhạc nền liên tục không bị gián đoạn khi người dùng chuyển các trang.

---

## 3. Hệ thống Thiết kế & Hiệu ứng Động Nền (Design System & Background Animations)

### Colors & Typography
- **Colors**:
  - Main Background: Vintage Rose `#E89CAE`, Sunset Peach `#F7D6D0`, Warm Blush `#C57B88`
  - Glass Cards: `rgba(255, 255, 255, 0.42)` + `backdrop-filter: blur(16px)` + Border `rgba(255, 255, 255, 0.6)`
  - Accent Color: Soft Coral/Terracotta `#D87A7A` & Rose Gold `#E0A39A`
  - Text: Dark Mocha `#3E2723`, Deep Crimson `#5A2D36`
- **Fonts**:
  - `Caveat` & `Dancing Script` (Google Fonts): Tiêu đề và ghi chú chữ viết tay lãng mạn.
  - `Be Vietnam Pro` (Google Fonts): Thẻ câu hỏi và nội dung văn bản chính.

### Hiệu ứng Động Nền Dịu Dàng (Gentle Background Animations)
1. **Hạt bụi ánh sáng (Golden Motes / Bokeh Dust)**: Các hạt ánh sáng/bụi nắng vàng hồng lấp lánh chầm chậm lơ lửng bối cảnh nền (`@keyframes floatMotes`).
2. **Ánh nến lung linh (Candle Flame Flicker)**: Ngọn nến trên bàn rực nhẹ và rung động tự nhiên (`@keyframes candleFlicker`).
3. **Băng Cassette quay nhẹ (Cassette Tape Spin)**: Bánh răng cuộn băng cassette quay nhịp nhàng khi nhạc phát (`@keyframes slowSpin`).
4. **Hiệu ứng nhịp thở hoa lá & ảnh polaroid (Gentle Breathe)**: Hoa hồng trong bình thuỷ tinh và ảnh polaroid đung đưa nhẹ như có gió thổi khẽ (`@keyframes gentleBreathe`).
5. **Trái tim nổi tự nhiên (Floating Hearts)**: Nhấn nút hoặc hoán đổi trang sinh ra hạt trái tim hồng mờ nhẹ nhàng bay lên rồi tan biến.

---

## 4. Chi tiết Chức năng từng Màn hình

### Header & Floating Audio Player (Global)
- Header cố định trên cùng: Logo `123 Người ♡`, danh mục trang, đồng hồ số thời gian thực (`HH:mm:ss`), nút Mute/Unmute audio.
- Audio Player cố định góc dưới trái: Phát bài nhạc thư thái, đầy đủ nút Play/Pause, tua nhạc, hiển thị tên bài hát.

### Màn hình 1: Trang chủ (Home)
- Lịch để bàn trung tâm với tựa đề "123 NGƯỜI", phụ đề *"Bạn đang nhớ ai... Hay chỉ đang nhớ cảm giác được yêu?"*, nút **BẮT ĐẦU** chuyển mượt sang bộ 12 Cánh Cửa.
- Thanh thẻ lướt lời thoại bên dưới (*"Xin lỗi vì anh còn nhớ..."*, *"... 1 ..."*, *"... 2 ..."*, *"... 3 ..."*, *"... người"*).
- Giấy ghi chú dán góc phải.

### Màn hình 2: 12 Cánh cửa (Quiz Page)
- Cuốn sổ mở hiển thị tiến trình (`Câu hỏi 01 / 12`).
- 4 đáp án A, B, C, D khung kính mờ có icon đi kèm.
- Nút bấm Quay lại, Trái tim, Tiếp theo. Lưu đáp án và tính toán kết quả cuối cùng.

### Màn hình 3: Bình Ước Nguyện (Wish Jar)
- Hũ thuỷ tinh trong suốt chứa các mảnh giấy gấp.
- Form nhập tâm sự ẩn danh (0/500 ký tự), checkbox gửi ẩn danh, nút "GỬI VÀO BÌNH ƯỚC NGUYỆN".
- Khi gửi, lá thư có hiệu ứng hoạ tiết gấp lại bay thả vào hũ, đồng thời thêm vào danh sách "Những lời nhắn gần đây" lưu ở LocalStorage.

### Màn hình 4: Kết quả (Result Matching & Next Steps)
- Hiển thị chân dung & số hiệu người phù hợp (`Người phù hợp của bạn: #07 ♡`).
- 3 thẻ gợi ý hành động: *Thư tay bí mật*, *Playlist dành riêng*, *Rủ đi ngắm hoàng hôn*.
- Tiến trình dots pagination và nút xem kết quả / chia sẻ.

---

## 5. Kế hoạch Kiểm thử (Verification Plan)
- Kiểm tra hiển thị responsive & mượt mà trên trình duyệt desktop & di động.
- Kiểm tra tính năng phát nhạc liên tục không ngắt khi bấm chuyển giữa các tab.
- Kiểm tra luồng trả lời 12 câu trắc nghiệm & lưu tin nhắn hũ ước nguyện vào LocalStorage.
