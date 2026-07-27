# 1 2 3 Người ♡ - Vintage Pink Interactive SPA

> *"Bạn đang nhớ ai... Hay chỉ đang nhớ cảm giác được yêu?"*

**1 2 3 Người** là một ứng dụng web dạng trang đơn (SPA) tương tác lãng mạn, mang đậm phong cách hoài niệm vintage hồng dịu dàng (Pink & Vintage Studio Vibe). Website đưa người dùng đi qua những cung bậc cảm xúc hoài niệm thông qua bài trắc nghiệm tâm sự, bình ước nguyện gửi gắm những lời nhắn gửi ẩn danh, bộ sưu tập khung ảnh kỷ niệm nghệ thuật, cùng trò chơi nhỏ hoài cổ "Mèo Con Tìm Ký Ức" tích hợp mượt mà.

---

## 📸 Demo Trực Tuyến
Trải nghiệm ứng dụng tại: **[https://twotnguyen.github.io/1-2-3-nguoi/](https://twotnguyen.github.io/1-2-3-nguoi/)**

---

## ✨ Các Tính Năng Nổi Bật

### 1. 📅 Trang Chủ Lịch Để Bàn (Home Desk Screen)
* Mô phỏng một góc bàn làm việc vintage chân thực với các đồ dùng trang trí chuyển động nhẹ nhàng (ly nước 🍓, chai rượu hồng Lyre's, máy ảnh AF-1 📷, băng cassette quay chậm phát nhạc 📼).
* Lịch để bàn trung tâm tích hợp nút bấm bắt đầu hành trình.
* Hiệu ứng tương tác độc đáo khi click vào các đồ vật:
  * Click máy ảnh cổ chụp nháy sáng màn hình.
  * Click lò vi sóng 3D hâm nóng kỷ niệm.
  * Click máy chơi game Game Boy để mở Mini Game.

### 2. 🔑 12 Cánh Cửa Tâm Sự (Quiz Engine)
* Giao diện mở sổ ghi chép tinh tế hiển thị tiến trình trả lời `Câu hỏi 01 / 12`.
* 12 câu hỏi trắc nghiệm tâm lý lãng mạn giúp phân tích tính cách, sở thích và Love Language.
* Thuật toán tự động ghép đôi và tìm ra "Người phù hợp" trong số **15 nhân vật nữ** độc bản, hiển thị kết quả kèm theo hồ sơ chi tiết (Màu sắc pastel yêu thích, Tính cách, Thích/Ghét, Love Language, Câu trích dẫn và ảnh đại diện Polaroid).

### 3. 🖼️ Khung Ảnh Kỷ Niệm (Photo Gallery)
* Bộ sưu tập gồm 24 khung ảnh kỷ niệm mang phong cách nghệ thuật với 5 kiểu thiết kế độc đáo:
  * **Polaroid**: Đơn giản cổ điển kèm chữ viết tay.
  * **Vintage Gold**: Viền vàng cổ điển lấp lánh quý phái.
  * **Sparkle Heart**: Trái tim tình yêu bay bổng lãng mạn.
  * **Film Strip**: Dải phim âm bản độc lạ.
  * **Postcard**: Bưu thiếp hành trình gửi tương lai.
* Hỗ trợ xem phóng to dưới dạng kính mờ (Lightbox) và tải ảnh đã lồng khung về máy (`💾 Lưu khung ảnh`).

### 4. 🫙 Bình Ước Nguyện (Wish Jar Confessions)
* Một hũ ước nguyện thủy tinh chứa các mảnh giấy gấp chứa đựng tâm tư ẩn danh.
* Người dùng có thể viết lời nhắn ẩn danh (hỗ trợ tối đa 500 ký tự) và gửi vào hũ với hiệu ứng giấy gấp lại bay thả vào bình sinh động.
* Tích hợp lưu trữ dữ liệu tại máy (`LocalStorage`) giúp xem lại các lời nhắn gần đây.
* Hỗ trợ tích hợp gửi tự động dữ liệu confession qua các cổng Telegram API hoặc Email Forms (Web3Forms/Formspree).

### 5. 🎮 Mini Game "Mèo Con Tìm Ký Ức"
* Trò chơi đi cảnh 2D (Platformer) mô phỏng cơ chế Mario cổ điển được xây dựng hoàn toàn bằng **HTML5 Canvas 2D**.
* Người chơi điều khiển chú mèo con `🐱` nhảy qua các bục lơ lửng, thu thập các "lá thư tình" `✉️`, dẫm đầu tiêu diệt các đám mây "nỗi buồn" `☁️` và đi đến hộp thư đích `📬`.
* Hỗ trợ điều khiển mượt mà qua cả bàn phím máy tính (Arrow Keys / WASD / Space) và bảng nút bấm ảo di động cảm ứng đa điểm (Touch Controls) chống trễ nhịp.

### 6. 🎵 Trình Phát Nhạc Cố Định (Global Sound System)
* Trình phát nhạc cassette cố định ở góc dưới giúp âm nhạc phát liên tục không bị gián đoạn khi người dùng chuyển đổi các tab/trang trong ứng dụng.
* Hỗ trợ phím tắt bật/tắt (mute) nhạc nhanh trên thanh header.

---

## 🛠️ Công Nghệ & Kiến Trúc Dự Án

Dự án được xây dựng theo tiêu chuẩn phát triển web hiện đại nhưng đảm bảo độ siêu nhẹ, không sử dụng framework cồng kềnh ngoài để mang lại tốc độ phản hồi tối ưu:

* **Core Stack**: HTML5 ngữ nghĩa, CSS3 Vanilla, JavaScript ES6+.
* **Design System**: 
  * Sử dụng hệ màu curated dịu mắt (`Vintage Rose #E89CAE`, `Warm Blush #C57B88`, `Mocha #3E2723`).
  * Phong cách thiết kế **Glassmorphism** mịn màng (`backdrop-filter: blur(16px)` kết hợp viền bán trong suốt).
  * Typography lãng mạn với các Google Fonts: `Caveat`, `Dancing Script`, `Be Vietnam Pro`.
* **SPA Routing Engine**: Router tự chế tải động (fetch) các phần giao diện trong thư mục `templates/` vào tệp chính `index.html` và lưu trữ đệm (client-side caching) để tối ưu băng thông.
* **Background Animations**: Hiệu ứng hạt bụi nắng lấp lánh (Golden Bokeh Motes) trôi chậm tự nhiên bằng CSS keyframe animation.
* **Game Engine**: Trình xử lý va chạm AABB (Axis-Aligned Bounding Box) tự lập trình, điều khiển vòng lặp hoạt họa thông qua `requestAnimationFrame` và dọn dẹp biến (Garbage Collection) hoàn toàn sạch sẽ khi đóng để tránh rò rỉ bộ nhớ (Memory Leak).

---

## 📂 Cấu Trúc Thư Mục Dự Án

```
HuyKi/
├── index.html              # Trang chính (Layout vỏ, Header, Modals, Trình phát nhạc)
├── style.css               # Hệ thống Stylesheet, Glassmorphism & Keyframe Animations
├── app.js                  # Engine định tuyến SPA, logic Quiz, hũ ước nguyện và Game engine
├── templates/              # Các phân đoạn giao diện con tải động qua Fetch
│   ├── home.html           # Trang chủ bàn làm việc tương tác
│   ├── quiz.html           # Cuốn sổ 12 câu hỏi trắc nghiệm
│   ├── wish-jar.html       # Bình ước nguyện thủy tinh & Form gửi tâm sự
│   └── gallery.html        # Bộ sưu tập 24 khung ảnh kỷ niệm
├── images/                 # Tài nguyên hình ảnh nhân vật, khung ảnh, avatar trang trí
│   └── gallery/            # Các ảnh Polaroid nền kỷ niệm
├── music/                  # File âm thanh nhạc nền MP3
├── docs/                   # Tài liệu đặc tả thiết kế & kế hoạch triển khai của dự án
└── .superpowers/           # Bộ lưu vết phân tích phát triển và kiểm tra nhánh
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Thử Tại Máy

Vì ứng dụng sử dụng công nghệ fetch tải động template nên trình duyệt sẽ chặn nếu bạn mở trực tiếp tệp `index.html` (do chính sách bảo mật CORS). Bạn cần chạy qua một local server đơn giản:

### Bước 1: Tải mã nguồn về máy
```bash
git clone https://github.com/twotnguyen/1-2-3-nguoi.git
cd 1-2-3-nguoi
```

### Bước 2: Khởi động Server cục bộ
Bạn có thể dùng một trong các cách cực nhanh sau:

* **Sử dụng Python 3 (Có sẵn trên macOS/Linux)**:
  ```bash
  python3 -m http.server 8080
  ```
* **Sử dụng Node.js (Nếu đã cài npm)**:
  ```bash
  npx http-server -p 8080
  ```
* **Sử dụng extension Live Server** trên VS Code (Cổng mặc định là `5500` hoặc `5501`).

### Bước 3: Trải nghiệm
Mở trình duyệt bất kỳ và truy cập địa chỉ tương ứng:
```text
http://localhost:8080
```

---

## ✍️ Tác Giả

* **Huyki** - Nhà phát triển chính - [GitHub Profile](https://github.com/twotnguyen)
* Phát triển bằng sự trân trọng những kỷ niệm và cảm xúc lãng mạn. ♡
