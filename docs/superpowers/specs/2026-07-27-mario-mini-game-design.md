# Design Spec: Mini Game "Mèo Con Tìm Ký Ức" (Nostalgic Platformer)

**Ngày khởi tạo**: 2026-07-27  
**Trạng thái**: Đã phê duyệt (Approved)  
**Loại dự án**: Tích hợp game HTML5 Canvas 2D vào SPA (Vanilla JS / CSS)

---

## 1. Mục tiêu & Ý tưởng thiết kế (Core Concept)
Bổ sung một trò chơi nhỏ mang phong cách platformer (đi ngang như Mario) vào ứng dụng SPA **"123 Người"**. 
* **Chủ đề**: *"Hành trình tìm ký ức"*. Người chơi sẽ nhập vai một chú mèo con đáng yêu (`🐱`), nhảy qua các bục lơ lửng, thu thập các "lá thư tình" chứa ký ức (`✉️`), tránh các "đám mây nỗi buồn" (`☁️`) và hướng về hộp thư (`📬`) ở cuối màn để hoàn thành hành trình.
* **Mục đích**: Tăng tính tương tác lãng mạn, mang lại trải nghiệm thú vị cho người dùng khi khám phá các phần ẩn của website.

---

## 2. Giao diện & Điểm chạm tương tác (UI & Activation)

### 2.1. Nút kích hoạt máy Game Boy trên Bàn làm việc
* **Vị trí**: Đặt tại cụm đồ vật trang trí bên phải của Trang chủ (`.decor-stack-right`), ngay bên cạnh Máy ảnh cổ và Băng Cassette.
* **Tạo hình**: Thiết kế hoàn toàn bằng CSS để tạo hình một máy chơi game Game Boy màu hồng sữa ngọt ngào (`linear-gradient(145deg, #F3B3C3, #D98EA3)`), có các phím D-pad hướng, nút tròn A/B bóng bẩy, màn hình phát sáng nhẹ.
* **Hành vi**: Di chuột (Hover) sẽ tự động phóng to nhẹ, tạo hiệu ứng phát sáng vùng biên. Nhấn chuột sẽ kích hoạt mở Game Modal.

### 2.2. Khung cửa sổ Game Modal (`#game-modal`)
* Thiết kế Glassmorphic đồng nhất (`backdrop-filter: blur(12px)`), lớp nền overlay phủ đục tối màu lãng mạn (`rgba(62, 39, 35, 0.4)`).
* Bao gồm tiêu đề, phụ đề hướng dẫn cốt truyện và khu vực chơi game trung tâm.
* Nút đóng (`&times;`) ở góc trên bên phải để ẩn modal và reset game.

---

## 3. Kiến trúc kỹ thuật & Logic vật lý (Technical & Game Engine Spec)

### 3.1. Phần cứng Canvas
* Thẻ `<canvas id="game-canvas">` với kích thước nội bộ cố định `600px` x `350px` để đảm bảo hệ tọa độ vật lý không đổi.
* Tự động điều chỉnh tỷ lệ hiển thị (Responsive scaling) trên màn hình nhỏ thông qua CSS (`max-width: 100%; height: auto;`).

### 3.2. Bộ thông số vật lý (Physics Engine)
```javascript
const PHYSICS = {
  gravity: 0.5,       // Lực kéo xuống mỗi khung hình
  jumpForce: -9.5,    // Lực nhảy phóng lên Y
  speed: 3.5,         // Tốc độ đi ngang X
  friction: 0.85      // Độ ma sát hãm khi dừng phím
};
```

### 3.3. Các Thực thể trong Game (Entities & Draw Specs)
Tận dụng phương pháp vẽ Canvas hoặc Emojis chất lượng cao để hiển thị nhanh gọn, mượt mà:
1. **Player (Mèo Con 🐱)**:
   * Vẽ bằng ký tự Emoji `🐱` hoặc Sprite vòng tròn hồng phấn.
   * Xử lý di chuyển trái/phải bằng cách cộng trừ vận tốc `vx`. Nhảy bằng cách cộng thêm `jumpForce` vào `vy` khi đang đứng trên bục (`jumping === false`).
   * Trạng thái bất tử tạm thời (`invulnerable`) trong 90 khung hình sau khi bị thương, biểu diễn bằng hiệu ứng chớp tắt opacity.
2. **Platforms (Bục & Mặt đất)**:
   * Mặt đất cơ bản và các bục gỗ/bục mây lơ lửng được biểu diễn bằng hình chữ nhật bo góc glassmorphic mờ ảo (`rgba(255, 255, 255, 0.35)` viền trắng nhẹ).
   * Bục di động: Một vài bục di chuyển liên tục từ trái qua phải theo chu kỳ.
3. **Collectibles (Thư tình ✉️)**:
   * Phân bổ ngẫu nhiên ở các bục cao khó leo.
   * Người chơi chạm vào sẽ phát hiệu ứng nổ hạt (particles) nhẹ và tăng điểm `collectedLetters`.
4. **Enemies (Nỗi buồn ☁️)**:
   * Đám mây xám ẩm ướt di chuyển qua lại trên các bục nhất định.
   * Va chạm từ trên xuống (chân Mèo tiếp xúc đầu đám mây): Đám mây biến mất (bị tiêu diệt), Mèo nảy lên (`vy = -6`).
   * Va chạm ngang/dưới: Mèo mất 1 mạng (`lives--`).
5. **Goal (Hộp thư 📬)**:
   * Cột mốc hoàn thành. Chỉ kích hoạt thắng cuộc khi Mèo đã nhặt đủ 5 lá thư tình.

### 3.4. Hệ thống điều khiển đa nền tảng (Dual Controls)
* **Desktop**: Lắng nghe sự kiện `keydown` / `keyup` cho các phím `ArrowLeft`/`ArrowRight` / `KeyA` / `KeyD` và `Space` / `ArrowUp` / `KeyW`.
* **Mobile**: Thêm panel phím cảm ứng bên dưới Canvas chỉ hiển thị trên di động.
  * Phím Trái (`#btn-move-left`), Phím Phải (`#btn-move-right`): Gán hành vi giữ nút để di chuyển liên tục.
  * Phím Nhảy (`#btn-jump`): Gán hành vi click/tap để kích hoạt nhảy.

---

## 4. Kế hoạch Kiểm thử (Verification Plan)
1. **Kiểm thử Bố cục & Responsive**: Đảm bảo máy Game Boy hiển thị cân đối trên cả Desktop và Mobile. Canvas game co giãn vừa vặn, không bị méo lệch tỷ lệ hoặc tràn khung.
2. **Kiểm thử Vật lý**: Đảm bảo nhân vật nhảy lên đứng được chắc chắn trên bục, không bị rơi xuyên bục hoặc kẹt trong bục (collision resolution).
3. **Kiểm thử Cơ chế Chiến thắng/Thua cuộc**:
   * Kiểm tra khi mất hết 3 mạng sẽ hiển thị màn hình Game Over chính xác.
   * Thu thập đủ 5 lá thư và chạm vào hộp thư ở cuối bản đồ kích hoạt màn hình Win cùng thông báo chúc mừng mượt mà.
4. **Kiểm thử Hiệu năng**: Game chạy mượt mà ở mức ~60fps, không gây gián đoạn hoặc ngắt nhạc nền chung của website.
