# 1 2 3 Người ♡

> *"Bạn đang nhớ ai... Hay chỉ đang nhớ cảm giác được yêu?"*

Trải nghiệm tương tác trắc nghiệm tâm sự lãng mạn, gửi lời nhắn ẩn danh vào bình ước nguyện, và khám phá bộ sưu tập khung ảnh kỷ niệm.

## Demo

Xem tại: [https://twotnguyen.github.io/1-2-3-nguoi/](https://twotnguyen.github.io/1-2-3-nguoi/)

## Tính năng

- **12 Câu hỏi trắc nghiệm** - Trả lời 12 câu hỏi tâm lý để tìm ra "người phù hợp" trong 15 nhân vật nữ
- **Bình Ước Nguyện** - Gửi lời nhắn ẩn danh, lưu trữ qua LocalStorage, gửi tự động qua Telegram/Email
- **Bộ sưu tập khung ảnh** - 24 khung ảnh kỷ niệm với 5 phong cách (Polaroid, Vintage Gold, Sparkle Heart, Film Strip, Postcard)
- **Mini Game** - Trò chơi "Mèo Con Tìm Ký Ức" trên nền canvas
- **Trình phát nhạc** - 3 bài hát nền phát liên tục khi chuyển trang
- **Hiệu ứng động** - Hạt bụi ánh sáng, đồng hồ thời gian thực, hoạt ảnh glassmorphism

## Công nghệ

- **HTML5** - Ngữ nghĩa, SPA routing qua hash
- **CSS3** - Custom Properties, Glassmorphism, Keyframe Animations, Responsive
- **ES6 JavaScript** - Không sử dụng framework bên ngoài

## Cấu trúc dự án

```
HuyKi/
├── index.html              # Shell chính (header, modals, audio player)
├── app.js                  # Logic SPA, router, quiz engine, game engine
├── style.css               # Toàn bộ样式
├── templates/              # HTML templates (load động qua fetch)
│   ├── home.html           # Trang chủ lịch để bàn
│   ├── quiz.html           # 12 câu hỏi trắc nghiệm
│   ├── wish-jar.html       # Bình ước nguyện
│   └── gallery.html        # Bộ sưu tập khung ảnh
├── images/                 # Ảnh nhân vật, avatar, gallery
├── music/                  # File nhạc nền MP3
└── docs/                   # Thiết kế & kế hoạch
```

## Cách chạy

```bash
# Clone repository
git clone https://github.com/twotnguyen/1-2-3-nguoi.git
cd 1-2-3-nguoi

# Chạy qua HTTP server (bắt buộc do CORS cho fetch templates)
python3 -m http.server 8080

# Mở trình duyệt
open http://localhost:8080
```

## Tác giả

**Huyki** - [GitHub](https://github.com/twotnguyen)
