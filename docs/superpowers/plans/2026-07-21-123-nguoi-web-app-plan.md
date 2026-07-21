# Implementation Plan: Website Tương Tác "123 Người" (Aesthetic SPA)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng website Single Page Application (SPA) nghệ thuật lãng mạn "123 Người" chuẩn xác theo 4 hình ảnh mẫu, hỗ trợ trắc nghiệm 12 câu hỏi, hũ ước nguyện lưu LocalStorage, trình phát nhạc cố định và các hiệu ứng động nền dịu dàng.

**Architecture:** Sử dụng HTML5 thuần, CSS3 (Glassmorphism, CSS Custom Properties, Keyframe Animations) và ES6 JavaScript Vanilla. Toàn bộ trải nghiệm gói gọn trong file SPA với hiệu ứng chuyển trang mượt mà không reload, phát nhạc liên tục.

**Tech Stack:** HTML5, CSS3, ES6 JavaScript, Google Fonts (`Caveat`, `Dancing Script`, `Be Vietnam Pro`), LocalStorage API, HTML5 Audio.

## Global Constraints
- Không dùng framework nặng (React/Vue/Tailwind) để đảm bảo tốc độ và trải nghiệm mượt mà.
- Font chữ tiếng Việt viết tay mượt mà.
- Hiệu ứng động nền dịu dàng, tự nhiên (không giật lắc, tối ưu GPU).

---

### Task 1: Khung Dự án & Hệ thống CSS Tokens & Animation Nền

**Files:**
- Create: `index.html`
- Create: `style.css`
- Create: `app.js`

**Interfaces:**
- Consumes: Google Fonts (`Caveat`, `Dancing Script`, `Be Vietnam Pro`)
- Produces: Base CSS styling system, CSS Variables, Background animations (`floatMotes`, `candleFlicker`, `slowSpin`, `gentleBreathe`)

- [ ] **Step 1: Khởi tạo file HTML nền tảng `index.html`**

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>123 Người ♡ - Bạn đang nhớ ai...</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Caveat:wght@400;600;700&family=Dancing+Script:wght@500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="ambient-container" class="ambient-container"></div>
  <main id="app-root"></main>
  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Viết hệ thống CSS Tokens & Keyframes trong `style.css`**

Thêm các CSS variables, style cho glassmorphism và 5 hiệu ứng nền động dịu dàng (`floatMotes`, `candleFlicker`, `slowSpin`, `gentleBreathe`, `floatHeart`).

- [ ] **Step 3: Khởi tạo file `app.js` với router cơ bản**

```javascript
document.addEventListener('DOMContentLoaded', () => {
  console.log('123 Người app initialized');
});
```

- [ ] **Step 4: Commit Task 1**

```bash
git add index.html style.css app.js
git commit -m "feat: initialize project scaffolding and css design system tokens"
```

---

### Task 2: Header cố định, Đồng hồ thời gian thực & Global Floating Audio Player

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `app.js`

**Interfaces:**
- Consumes: `app-root` element
- Produces: Header bar with live clock, Audio player with play/pause/mute state, tab router function `switchTab(tabId)`

- [ ] **Step 1: Thêm Header & Audio Player HTML vào `index.html`**

Thêm `<header>` chứa Logo "123 Người ♡", Navigation items (Trang chủ, 12 cánh cửa, Hồ sơ, Playlist, 123 Timeline, BTS), đồng hồ điện tử `#live-clock`, và `#audio-player-widget` ở góc trái bên dưới.

- [ ] **Step 2: Thêm style cho Header & Audio Player trong `style.css`**

Tạo style glassmorphism hồng cho Header, hiệu ứng đĩa đĩa đĩa đĩa đĩa CD/Cassette quay nhẹ trong player (`slowSpin`), thanh âm lượng, các icon điều khiển.

- [ ] **Step 3: Viết JS cho đồng hồ chạy & Audio Player logic trong `app.js`**

Cập nhật đồng hồ từng giây (`setInterval`), hỗ trợ bấm Play/Pause/Mute nhạc nền, và điều hướng active tab không reload.

- [ ] **Step 4: Commit Task 2**

```bash
git add index.html style.css app.js
git commit -m "feat: implement global header, real-time clock, and floating audio player"
```

---

### Task 3: Màn hình 1 - Trang Chủ (Home Landing Screen)

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `app.js`

**Interfaces:**
- Consumes: `switchTab('quiz')`
- Produces: Desk Calendar view, Start button with pulse heart effect, bottom story cards carousel, sticky note decor

- [ ] **Step 1: Xây dựng HTML Trang chủ `#home-view`**

Lịch để bàn lò xo với tựa "123 NGƯỜI", phụ đề *"Bạn đang nhớ ai... Hay chỉ đang nhớ cảm giác được yêu?"*, nút "BẮT ĐẦU" màu San hô Coral, dải thẻ lướt ở dưới, chai Lyre's decor, sticky note *"Cảm ơn vì đã từng ở đây. ♡"*.

- [ ] **Step 2: Viết CSS cho Trang chủ trong `style.css`**

Tạo hiệu ứng cuốn lịch nổi 3D mờ, dán giấy sticky note nghiêng góc nhẹ nghệ thuật, chai nước thuỷ tinh, hiệu ứng nhịp thở nảy tim trên nút "BẮT ĐẦU".

- [ ] **Step 3: Gắn sự kiện click nút "BẮT ĐẦU" trong `app.js`**

Khi bấm "BẮT ĐẦU", kích hoạt chuyển hiệu ứng mượt sang màn hình `#quiz-view` (`12 cánh cửa`).

- [ ] **Step 4: Commit Task 3**

```bash
git add index.html style.css app.js
git commit -m "feat: build home landing view with calendar desk aesthetic"
```

---

### Task 4: Màn hình 2 - 12 Cánh Cửa (Interactive Quiz Engine)

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `app.js`

**Interfaces:**
- Consumes: User answers array
- Produces: 12 Questions slides, selection state, calculation of matching persona (#07)

- [ ] **Step 1: Xây dựng HTML màn hình trắc nghiệm `#quiz-view`**

Khung sổ tay mở trung tâm, badge `Câu hỏi 01 / 12`, tiêu đề câu hỏi, 4 thẻ đáp án A, B, C, D (mô phỏng chính xác theo `2.png`), cùng bộ 3 nút bấm Quay lại / Trái tim / Tiếp theo.

- [ ] **Step 2: Thêm style glassmorphic cho thẻ câu hỏi & hiệu ứng chọn đáp án**

Glass card trong suốt có icon (nhạc, hoàng hôn, con người, ánh trăng đêm), viền lấp lánh khi hoán đổi hoặc hover.

- [ ] **Step 3: Khai báo mảng 12 câu hỏi tâm sự & logic Quiz Engine trong `app.js`**

Xây dựng dữ liệu 12 câu hỏi trắc nghiệm tâm sự cảm xúc sâu sắc. Viết hàm chuyển câu hỏi mượt, lưu câu trả lời vào mảng, và tự động chuyển sang Màn hình Kết quả (`#result-view`) sau câu 12.

- [ ] **Step 4: Commit Task 4**

```bash
git add index.html style.css app.js
git commit -m "feat: implement 12-question interactive quiz engine with smooth sliding transitions"
```

---

### Task 5: Màn hình 3 - Bình Ước Nguyện (Wish Jar & LocalStorage)

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `app.js`

**Interfaces:**
- Consumes: LocalStorage `wish_jar_messages`
- Produces: Message submission form, paper drop animation into Mason Jar, recent messages display list

- [ ] **Step 1: Xây dựng HTML màn hình `#wish-jar-view`**

Tựa đề "Gửi vào đây nhé... ♡", 3 badge tính năng (Ẩn danh tuyệt đối, Đọc & Hồi đáp, Lan tỏa yêu thương), hũ thuỷ tinh "Bình Ước Nguyện", khung textarea 0/500, checkbox ẩn danh, nút "GỬI VÀO BÌNH ƯỚC NGUYỆN", và thẻ danh sách "Những lời nhắn gần đây" (theo `3.png`).

- [ ] **Step 2: Viết CSS cho Hũ ước nguyện thuỷ tinh & hiệu ứng thả lá thư**

Style hũ thuỷ tinh lấp lánh lấp đầy bởi các cuộn giấy gấp trái tim hồng, animation thư thu nhỏ bay thả vào hũ khi gửi thành công.

- [ ] **Step 3: Lập trình lưu & hiển thị danh sách tâm sự trong `app.js`**

Đọc/Ghi dữ liệu `LocalStorage`. Thêm bài viết mới vào đầu danh sách "Những lời nhắn gần đây" với hiệu ứng xuất hiện tức thì.

- [ ] **Step 4: Commit Task 5**

```bash
git add index.html style.css app.js
git commit -m "feat: build wish jar page with paper animation and localstorage persistence"
```

---

### Task 6: Màn hình 4 - Kết Quả Matching & 3 Gợi Ý Hành Động (Result View)

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `app.js`

**Interfaces:**
- Consumes: Quiz calculation result
- Produces: Matched persona (#07) card, 3 actionable approach cards with modal popup info

- [ ] **Step 1: Xây dựng HTML màn hình kết quả `#result-view`**

Badge góc trái `Người phù hợp của bạn: #07 ♡` với ảnh đại diện lãng mạn, tiêu đề "Bước tiếp theo là của bạn ♡", 3 thẻ phương án tiếp cận (01 - Thư tay bí mật, 02 - Playlist dành riêng, 03 - Rủ đi ngắm hoàng hôn), tiến trình 6 chấm ở dưới (theo `4.png`).

- [ ] **Step 2: Viết CSS cho màn hình kết quả & 3 thẻ bài hành động**

Style thẻ card nổi 3D, hiệu ứng khi chọn nút "CHỌN CÁCH NÀY".

- [ ] **Step 3: Thêm Modal thông điệp/hướng dẫn cho từng phương án tiếp cận trong `app.js`**

Khi bấm "CHỌN CÁCH NÀY", hiển thị popup / modal gợi ý chi tiết hoặc cho phép viết thư tay / tạo playlist cá nhân.

- [ ] **Step 4: Commit Task 6**

```bash
git add index.html style.css app.js
git commit -m "feat: implement matching result view and interactive action approach cards"
```

---

### Task 7: Đồ hoạ Nền Động (Ambient Particles) & Kiểm thử Toàn bộ

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `app.js`

- [ ] **Step 1: Hoàn thiện hiệu ứng các hạt bụi nắng vàng hồng lơ lửng bối cảnh nền**

Viết JS khởi tạo 25 hạt ánh sáng bokeh/mote bay chầm chậm lơ lửng tự nhiên trên khắp khung hình.

- [ ] **Step 2: Kiểm thử mượt mà trên nhiều kích thước màn hình & trình duyệt**

Đảm bảo nhạc chạy liên tục, đồng hồ chuẩn, trắc nghiệm 12 câu lưu kết quả tốt, hũ ước nguyện hoạt động mượt mà.

- [ ] **Step 3: Commit Task 7**

```bash
git add index.html style.css app.js
git commit -m "feat: add ambient dust particle engine and finalize full SPA experience"
```
