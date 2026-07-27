# Mini Game "Mèo Con Tìm Ký Ức" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng và tích hợp trò chơi đi cảnh 2D HTML5 Canvas mini (mô phỏng Mario) tên "Mèo Con Tìm Ký Ức" kích hoạt từ thiết bị Game Boy trên màn hình chính của ứng dụng web SPA "123 Người".

**Architecture:** 
1. Thêm một thực thể máy Game Boy bằng mã HTML/CSS 3D vào cụm đồ trang trí bên phải của bàn làm việc (`.decor-stack-right`) trên Trang chủ.
2. Thêm HTML cấu trúc khung modal chứa `<canvas>` game cùng bảng phím bấm di động ảo chỉ hiển thị ở chế độ Mobile.
3. Khởi tạo lớp game loop `MemoryGame` trong [app.js](file:///Users/twot/Documents/CODE/HuyKi/app.js) để chạy engine vật lý 2D, kiểm soát va chạm (bounding box), di chuyển của Mèo con, tuần tra của quái "nỗi buồn", ăn thư tình và xử lý thắng/thua.

**Tech Stack:** Vanilla HTML5, CSS3, ES6 JavaScript (HTML5 Canvas 2D Context, requestAnimationFrame).

## Global Constraints
- Phong cách thẩm mỹ: Vintage Rose, Glassmorphism đồng nhất với trang web.
- Mã nguồn thuần túy: Không sử dụng framework hay thư viện ngoài (như Phaser hay Kaboom), giữ cho trang web nhẹ nhất.
- Hỗ trợ di động: Điều khiển nhạy trên cả phím cứng bàn phím máy tính và phím bấm chạm đa điểm (touch events) di động.

---

### Task 1: Thiết lập giao diện máy Game Boy và Modal Game trong HTML & CSS

**Files:**
- Modify: [index.html](file:///Users/twot/Documents/CODE/HuyKi/index.html)
- Modify: [style.css](file:///Users/twot/Documents/CODE/HuyKi/style.css)
- Modify: [app.js](file:///Users/twot/Documents/CODE/HuyKi/app.js)

**Interfaces:**
- Consumes: Bố cục hiện tại của bàn làm việc và modal lớp phủ trên website.
- Produces: Biến kích hoạt nút Game Boy bấm mở `#game-modal` hiển thị đầy đủ canvas và bảng nút ảo di động.

- [ ] **Step 1: Thêm máy chơi game Game Boy vào cụm đồ dùng Trang chủ**
  Mở tệp [index.html](file:///Users/twot/Documents/CODE/HuyKi/index.html), tìm đến lớp `.decor-stack-right` (quanh dòng 190) chứa Máy ảnh cổ và Băng Cassette, chèn mã HTML của máy Game Boy ngay dưới lớp Băng Cassette:
  ```html
            <!-- Pink Game Boy Mini-Game Trigger -->
            <div id="gameboy-trigger" class="gameboy-wrapper floating-element" title="Bấm để chơi game Mèo Con Tìm Ký Ức ♡" style="cursor: pointer;">
              <div class="gameboy-body">
                <div class="gameboy-screen">
                  <div class="gameboy-screen-glass">
                    <span class="gameboy-screen-text">PLAY ♡</span>
                  </div>
                </div>
                <div class="gameboy-dpad">
                  <span class="dpad-vertical"></span>
                  <span class="dpad-horizontal"></span>
                </div>
                <div class="gameboy-buttons">
                  <span class="gb-btn gb-b">B</span>
                  <span class="gb-btn gb-a">A</span>
                </div>
                <div class="gameboy-pills">
                  <span class="gb-pill"></span>
                  <span class="gb-pill"></span>
                </div>
              </div>
              <span class="gameboy-caption">Trò chơi 🎮</span>
            </div>
  ```

- [ ] **Step 2: Thêm HTML cấu trúc Modal Game ẩn**
  Cũng trong tệp [index.html](file:///Users/twot/Documents/CODE/HuyKi/index.html), chèn cấu trúc `#game-modal` vào ngay phía trên Lightbox Modal (quanh dòng 565):
  ```html
  <!-- Mini Game Modal -->
  <div id="game-modal" class="modal-overlay hidden">
    <div class="modal-card game-modal-card">
      <button id="game-modal-close" class="modal-close">&times;</button>
      <div class="sparkle-badge">🎮 MINI GAME 🎮</div>
      <h3 class="modal-title" style="font-family: 'Dancing Script', cursive; font-size: 2.2rem; margin-bottom: 4px;">Mèo Con Tìm Ký Ức</h3>
      <p class="modal-subtitle-sm" style="margin-bottom: 12px;">Giúp chú mèo vượt qua các nỗi buồn để nhặt thư tình gửi người ấy nhé! ♡</p>
      
      <div class="game-container" style="position: relative; background: rgba(255, 255, 255, 0.2); border-radius: 12px; border: 1.5px solid rgba(255, 255, 255, 0.4); padding: 5px; box-shadow: inset 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
        <canvas id="game-canvas" width="600" height="350" style="display: block; width: 100%; height: auto; background: linear-gradient(to bottom, #FFEAEF, #FFDFE6); border-radius: 8px;"></canvas>
        
        <!-- Mobile Controls Panel -->
        <div id="game-mobile-controls" class="game-mobile-controls">
          <div class="dpad-controls">
            <button id="btn-move-left" class="control-btn" aria-label="Move Left">◀</button>
            <button id="btn-move-right" class="control-btn" aria-label="Move Right">▶</button>
          </div>
          <div class="action-controls">
            <button id="btn-jump" class="control-btn-jump" aria-label="Jump">JUMP</button>
          </div>
        </div>
      </div>
      
      <div class="game-instructions" style="margin-top: 10px; font-size: 0.85rem; color: var(--text-muted); font-family: 'Be Vietnam Pro', sans-serif; text-align: center;">
        <span>⌨️ Máy tính: Phím mũi tên ◀ ▶ (hoặc A/D) để di chuyển, phím Space (hoặc W) để nhảy!</span>
      </div>
    </div>
  </div>
  ```

- [ ] **Step 3: Thêm kiểu CSS cho Game Boy & Modal Game**
  Mở tệp [style.css](file:///Users/twot/Documents/CODE/HuyKi/style.css), kéo xuống cuối tệp và thêm mã CSS sau:
  ```css
  /* ==========================================================================
     MINI GAME & GAME BOY DECOR STYLING
     ========================================================================== */
  .gameboy-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    position: relative;
    transition: transform 0.25s ease;
  }

  .gameboy-wrapper:hover {
    transform: scale(1.05) rotate(-2deg);
  }

  .gameboy-body {
    width: 80px;
    height: 120px;
    background: linear-gradient(145deg, #F3B3C3, #D98EA3);
    border-radius: 8px 8px 24px 8px;
    border: 2px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 8px 20px rgba(217, 142, 163, 0.25), inset 0 2px 4px rgba(255, 255, 255, 0.5);
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    box-sizing: border-box;
  }

  .gameboy-screen {
    width: 100%;
    height: 48px;
    background: #EAE3D2;
    border-radius: 4px;
    border: 1.5px solid #8B7E74;
    padding: 4px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .gameboy-screen-glass {
    width: 100%;
    height: 100%;
    background: #A0C334;
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  }

  .gameboy-screen-text {
    font-family: monospace;
    font-size: 0.6rem;
    font-weight: bold;
    color: #3f4f14;
    letter-spacing: 1px;
    animation: gbPulse 2s infinite alternate;
  }

  @keyframes gbPulse {
    0% { opacity: 0.3; }
    100% { opacity: 1; }
  }

  .gameboy-dpad {
    position: absolute;
    top: 68px;
    left: 10px;
    width: 24px;
    height: 24px;
  }

  .dpad-vertical, .dpad-horizontal {
    position: absolute;
    background: #5A4E53;
    border-radius: 2px;
  }

  .dpad-vertical {
    top: 0;
    left: 8px;
    width: 8px;
    height: 24px;
  }

  .dpad-horizontal {
    top: 8px;
    left: 0;
    width: 24px;
    height: 8px;
  }

  .gameboy-buttons {
    position: absolute;
    top: 72px;
    right: 8px;
    width: 32px;
    height: 20px;
    display: flex;
    justify-content: space-between;
    transform: rotate(-15deg);
  }

  .gb-btn {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #880E4F;
    border: 1px solid rgba(255,255,255,0.4);
    font-size: 0.45rem;
    color: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  .gameboy-pills {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: auto;
    padding-bottom: 2px;
  }

  .gb-pill {
    width: 12px;
    height: 4px;
    background: #7E6F74;
    transform: rotate(-28deg);
    border-radius: 2px;
    border: 0.5px solid rgba(255,255,255,0.3);
  }

  .gameboy-caption {
    font-family: 'Caveat', cursive;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-dark);
    text-shadow: 0 1px 2px rgba(255,255,255,0.8);
  }

  /* Game Modal Card */
  .game-modal-card {
    max-width: 650px;
    width: 95%;
    padding: 24px;
  }

  /* Mobile Game Controls Styling */
  .game-mobile-controls {
    display: none;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .dpad-controls {
    display: flex;
    gap: 12px;
  }

  .control-btn, .control-btn-jump {
    background: linear-gradient(135deg, #F9D8E1, #E8A8BA);
    border: 1.5px solid rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    color: #3E2723;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    touch-action: manipulation;
    transition: transform 0.1s;
  }

  .control-btn:active, .control-btn-jump:active {
    transform: scale(0.92);
    background: linear-gradient(135deg, #E8A8BA, #C47B8E);
  }

  .control-btn {
    width: 52px;
    height: 52px;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .control-btn-jump {
    width: 76px;
    height: 52px;
    border-radius: 26px;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Responsive display for mobile buttons */
  @media (max-width: 768px) {
    .game-mobile-controls {
      display: flex;
    }
  }
  ```

- [ ] **Step 4: Ràng buộc sự kiện mở/đóng Modal cơ bản trong app.js**
  Mở tệp [app.js](file:///Users/twot/Documents/CODE/HuyKi/app.js), di chuyển xuống vị trí khai báo sự kiện các modal (khoảng dòng 940-960), thêm các định nghĩa ẩn/hiển thị đơn giản cho `#game-modal`:
  ```javascript
  const gameModal = document.getElementById('game-modal');
  const gameboyTrigger = document.getElementById('gameboy-trigger');
  const gameModalClose = document.getElementById('game-modal-close');

  function openGameModal() {
    if (gameModal) {
      gameModal.classList.remove('hidden');
    }
  }

  function closeGameModal() {
    if (gameModal) {
      gameModal.classList.add('hidden');
    }
  }

  if (gameboyTrigger) gameboyTrigger.addEventListener('click', openGameModal);
  if (gameModalClose) gameModalClose.addEventListener('click', closeGameModal);
  ```

- [ ] **Step 5: Commit kết quả Task 1**
  Chạy lệnh trong terminal:
  ```bash
  git add index.html style.css app.js
  git commit -m "feat: setup Game Boy trigger UI and Game Modal structure"
  ```

---

### Task 2: Triển khai Engine vật lý và Vòng lặp game cốt lõi trong `app.js`

**Files:**
- Modify: [app.js](file:///Users/twot/Documents/CODE/HuyKi/app.js)

**Interfaces:**
- Consumes: Thẻ canvas `#game-canvas` và sự kiện click từ Task 1.
- Produces: Lớp `MemoryGame` quản lý cập nhật chuyển động ngang, trọng lực, nhảy và vẽ bục tĩnh/bục di động lên canvas.

- [ ] **Step 1: Định nghĩa lớp `MemoryGame` hoàn chỉnh**
  Thêm định nghĩa lớp `MemoryGame` vào cuối tệp [app.js](file:///Users/twot/Documents/CODE/HuyKi/app.js) (ngay trên dòng kết thúc hoặc phạm vi phù hợp):
  ```javascript
  class MemoryGame {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      
      // Khởi tạo các hằng số vật lý
      this.gravity = 0.45;
      this.jumpForce = -9.0;
      this.speed = 3.2;
      this.friction = 0.85;
      
      this.reset();
      this.setupControls();
    }
    
    reset() {
      this.player = {
        x: 50,
        y: 200,
        width: 24,
        height: 24,
        vx: 0,
        vy: 0,
        jumping: true,
        lives: 3,
        collectedLetters: 0,
        invulnerable: 0
      };
      
      this.gameState = 'PLAY'; // PLAY, GAMEOVER, WIN
      this.cameraX = 0;
      this.worldWidth = 1500;
      
      // Bố trí bản đồ các bục
      this.platforms = [
        { x: 0, y: 320, width: 300, height: 30, type: 'ground' },
        { x: 380, y: 320, width: 250, height: 30, type: 'ground' },
        { x: 700, y: 320, width: 400, height: 30, type: 'ground' },
        { x: 1180, y: 320, width: 320, height: 30, type: 'ground' },
        
        // Bục mây lơ lửng
        { x: 200, y: 240, width: 100, height: 12, type: 'cloud' },
        { x: 330, y: 170, width: 80, height: 12, type: 'cloud' },
        { x: 480, y: 220, width: 100, height: 12, type: 'cloud' },
        
        // Bục di động tuần tra
        { x: 620, y: 160, width: 90, height: 12, type: 'moving', minX: 580, maxX: 800, dir: 1, speed: 1.0 },
        
        { x: 860, y: 230, width: 120, height: 12, type: 'cloud' },
        { x: 920, y: 140, width: 80, height: 12, type: 'cloud' },
        { x: 1060, y: 200, width: 100, height: 12, type: 'cloud' }
      ];
      
      // Thư tình cần nhặt (5 lá)
      this.letters = [
        { x: 240, y: 200, width: 16, height: 16, collected: false },
        { x: 360, y: 130, width: 16, height: 16, collected: false },
        { x: 660, y: 100, width: 16, height: 16, collected: false },
        { x: 950, y: 100, width: 16, height: 16, collected: false },
        { x: 1100, y: 160, width: 16, height: 16, collected: false }
      ];
      
      // Quái nỗi buồn
      this.enemies = [
        { x: 420, y: 295, width: 24, height: 20, speed: 0.8, dir: 1, minX: 390, maxX: 610 },
        { x: 800, y: 295, width: 24, height: 20, speed: 1.0, dir: -1, minX: 710, maxX: 1080 },
        { x: 880, y: 205, width: 24, height: 20, speed: 0.6, dir: 1, minX: 865, maxX: 960 }
      ];
      
      this.mailbox = { x: 1400, y: 270, width: 30, height: 50 };
      this.keys = { left: false, right: false, up: false };
    }
    
    setupControls() {
      this.keyHandler = (e) => {
        const isDown = e.type === 'keydown';
        if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = isDown;
        if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = isDown;
        if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) this.keys.up = isDown;
        
        // Ngăn chặn cuộn trang
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code) && this.gameState === 'PLAY') {
          e.preventDefault();
        }
      };
      
      window.addEventListener('keydown', this.keyHandler);
      window.addEventListener('keyup', this.keyHandler);
      
      // Bắt sự kiện phím cảm ứng trên Mobile
      const btnLeft = document.getElementById('btn-move-left');
      const btnRight = document.getElementById('btn-move-right');
      const btnJump = document.getElementById('btn-jump');
      
      if (btnLeft) {
        btnLeft.onmousedown = btnLeft.ontouchstart = (e) => { e.preventDefault(); this.keys.left = true; };
        btnLeft.onmouseup = btnLeft.onmouseleave = btnLeft.ontouchend = () => { this.keys.left = false; };
      }
      if (btnRight) {
        btnRight.onmousedown = btnRight.ontouchstart = (e) => { e.preventDefault(); this.keys.right = true; };
        btnRight.onmouseup = btnRight.onmouseleave = btnRight.ontouchend = () => { this.keys.right = false; };
      }
      if (btnJump) {
        btnJump.onmousedown = btnJump.ontouchstart = (e) => {
          e.preventDefault();
          this.keys.up = true;
          setTimeout(() => { this.keys.up = false; }, 80);
        };
      }
      
      // Nút click chuột khởi động lại hoặc đóng
      this.canvas.onclick = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const clickY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        
        if (this.gameState === 'GAMEOVER') {
          // Restart button: center-60 -> center+60 (240-360), height/2+35 -> height/2+67 (210-242)
          if (clickX >= this.canvas.width/2 - 60 && clickX <= this.canvas.width/2 + 60 &&
              clickY >= this.canvas.height/2 + 35 && clickY <= this.canvas.height/2 + 67) {
            this.reset();
          }
        } else if (this.gameState === 'WIN') {
          // Finish button: center-70 -> center+70 (230-370), height/2+55 -> height/2+87 (230-262)
          if (clickX >= this.canvas.width/2 - 70 && clickX <= this.canvas.width/2 + 70 &&
              clickY >= this.canvas.height/2 + 55 && clickY <= this.canvas.height/2 + 87) {
            document.getElementById('game-modal').classList.add('hidden');
            const wishJarTab = document.querySelector('[data-tab="wish-jar"]');
            if (wishJarTab) wishJarTab.click();
          }
        }
      };
    }
    
    destroy() {
      window.removeEventListener('keydown', this.keyHandler);
      window.removeEventListener('keyup', this.keyHandler);
    }
    
    checkCollision(rect1, rect2) {
      return rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.y + rect1.height > rect2.y;
    }
  }
  ```

- [ ] **Step 2: Cập nhật hàm xử lý va chạm và cập nhật vị trí (`update` & `damagePlayer`)**
  Thêm mã xử lý vật lý sau vào bên trong lớp `MemoryGame`:
  ```javascript
    update() {
      if (this.gameState !== 'PLAY') return;
      
      // 1. Xử lý di chuyển ngang
      if (this.keys.left) {
        this.player.vx = -this.speed;
      } else if (this.keys.right) {
        this.player.vx = this.speed;
      } else {
        this.player.vx *= this.friction;
      }
      
      // 2. Trọng lực
      this.player.vy += this.gravity;
      
      // 3. Nhảy
      if (this.keys.up && !this.player.jumping) {
        this.player.vy = this.jumpForce;
        this.player.jumping = true;
      }
      
      // Cập nhật vị trí
      this.player.x += this.player.vx;
      this.player.y += this.player.vy;
      
      // Thời gian nhấp nháy bất tử
      if (this.player.invulnerable > 0) {
        this.player.invulnerable--;
      }
      
      // Giới hạn biên thế giới
      if (this.player.x < 0) this.player.x = 0;
      if (this.player.x > this.worldWidth - this.player.width) this.player.x = this.worldWidth - this.player.width;
      
      // Camera bám theo nhân vật
      this.cameraX = this.player.x - this.canvas.width / 3;
      if (this.cameraX < 0) this.cameraX = 0;
      if (this.cameraX > this.worldWidth - this.canvas.width) this.cameraX = this.worldWidth - this.canvas.width;
      
      // Rơi xuống hố sâu
      if (this.player.y > this.canvas.height + 40) {
        this.damagePlayer();
      }
      
      // Di chuyển các bục di động
      this.platforms.forEach(p => {
        if (p.type === 'moving') {
          p.x += p.speed * p.dir;
          if (p.x > p.maxX || p.x < p.minX) {
            p.dir *= -1;
          }
        }
      });
      
      // 4. Kiểm tra va chạm với các bục
      let wasOnGround = false;
      this.platforms.forEach(p => {
        if (this.checkCollision(this.player, p)) {
          const overlapX = Math.min(this.player.x + this.player.width, p.x + p.width) - Math.max(this.player.x, p.x);
          const overlapY = Math.min(this.player.y + this.player.height, p.y + p.height) - Math.max(this.player.y, p.y);
          
          if (overlapX > overlapY) {
            // Đáp đất từ phía trên
            if (this.player.vy > 0 && this.player.y + this.player.height - this.player.vy <= p.y + 4) {
              this.player.y = p.y - this.player.height;
              this.player.vy = 0;
              this.player.jumping = false;
              wasOnGround = true;
              
              if (p.type === 'moving') {
                this.player.x += p.speed * p.dir;
              }
            } 
            // Đụng từ dưới lên
            else if (this.player.vy < 0 && this.player.y >= p.y + p.height - 4) {
              this.player.y = p.y + p.height;
              this.player.vy = 0.5;
            }
          } else {
            // Đụng cạnh bên
            if (this.player.x < p.x) {
              this.player.x = p.x - this.player.width;
            } else {
              this.player.x = p.x + p.width;
            }
            this.player.vx = 0;
          }
        }
      });
      
      if (!wasOnGround && this.player.vy !== 0) {
        this.player.jumping = true;
      }
      
      // 5. Ăn thư tình
      this.letters.forEach(item => {
        if (!item.collected && this.checkCollision(this.player, item)) {
          item.collected = true;
          this.player.collectedLetters++;
        }
      });
      
      // 6. Va chạm quái Nỗi buồn
      this.enemies.forEach(enemy => {
        enemy.x += enemy.speed * enemy.dir;
        if (enemy.x > enemy.maxX || enemy.x < enemy.minX) {
          enemy.dir *= -1;
        }
        
        if (this.checkCollision(this.player, enemy)) {
          const isStomping = this.player.vy > 0 && (this.player.y + this.player.height - this.player.vy <= enemy.y + 8);
          if (isStomping) {
            this.enemies = this.enemies.filter(e => e !== enemy);
            this.player.vy = -6.0; // Mèo nhảy nẩy lên
          } else {
            this.damagePlayer();
          }
        }
      });
      
      // 7. Đích đến
      if (this.checkCollision(this.player, this.mailbox)) {
        if (this.player.collectedLetters >= 5) {
          this.gameState = 'WIN';
        }
      }
    }
    
    damagePlayer() {
      if (this.player.invulnerable > 0) return;
      this.player.lives--;
      if (this.player.lives <= 0) {
        this.gameState = 'GAMEOVER';
      } else {
        this.player.invulnerable = 90;
        this.player.x = 50;
        this.player.y = 200;
        this.player.vx = 0;
        this.player.vy = 0;
      }
    }
  ```

- [ ] **Step 3: Cập nhật hàm vẽ giao diện (`draw`)**
  Thêm mã vẽ canvas nghệ thuật sau vào bên trong lớp `MemoryGame`:
  ```javascript
    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Nền hoàng hôn hồng
      let skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      skyGradient.addColorStop(0, '#FFEAEF');
      skyGradient.addColorStop(0.5, '#FFDFE6');
      skyGradient.addColorStop(1, '#FFC2D1');
      this.ctx.fillStyle = skyGradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.save();
      this.ctx.translate(-this.cameraX, 0);
      
      // Vẽ Mặt trăng/mặt trời mờ
      this.ctx.fillStyle = 'rgba(255, 235, 238, 0.5)';
      this.ctx.beginPath();
      this.ctx.arc(this.cameraX * 0.2 + 150, 75, 45, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Vẽ các bục nhảy
      this.platforms.forEach(p => {
        if (p.type === 'ground') {
          this.ctx.fillStyle = 'rgba(197, 123, 136, 0.85)';
        } else {
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        }
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.roundRect(p.x, p.y, p.width, p.height, p.type === 'cloud' || p.type === 'moving' ? 6 : 0);
        this.ctx.fill();
        this.ctx.stroke();
      });
      
      // Vẽ Hộp thư đích 📬
      this.ctx.font = '36px serif';
      this.ctx.textBaseline = 'top';
      this.ctx.fillText('📬', this.mailbox.x, this.mailbox.y);
      
      // Vẽ các lá thư tình ✉️
      this.letters.forEach(item => {
        if (!item.collected) {
          this.ctx.font = '16px serif';
          this.ctx.fillText('✉️', item.x, item.y - 2);
        }
      });
      
      // Vẽ quái Nỗi buồn ☁️
      this.enemies.forEach(e => {
        this.ctx.font = '22px serif';
        this.ctx.fillText('☁️', e.x, e.y - 4);
      });
      
      // Vẽ Mèo con 🐱 (nhấp nháy bất tử nếu cần)
      if (this.player.invulnerable === 0 || Math.floor(this.player.invulnerable / 6) % 2 === 0) {
        this.ctx.font = '24px serif';
        this.ctx.fillText('🐱', this.player.x - 2, this.player.y - 2);
      }
      
      this.ctx.restore();
      
      // Vẽ giao diện HUD (Thông số chơi game)
      let heartsStr = '';
      for (let i = 0; i < 3; i++) {
        heartsStr += i < this.player.lives ? '❤️' : '🖤';
      }
      this.ctx.font = '14px sans-serif';
      this.ctx.fillStyle = '#3E2723';
      this.ctx.textAlign = 'left';
      this.ctx.fillText('Mạng: ' + heartsStr, 15, 25);
      this.ctx.fillText('Thư tình: ✉️ ' + this.player.collectedLetters + ' / 5', 15, 45);
      
      // Overlay Thua cuộc
      if (this.gameState === 'GAMEOVER') {
        this.ctx.fillStyle = 'rgba(62, 39, 35, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.font = 'bold 24px sans-serif';
        this.ctx.fillStyle = '#FFEBEE';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('TRÒ CHƠI KẾT THÚC 💔', this.canvas.width/2, this.canvas.height/2 - 20);
        
        this.ctx.font = '15px sans-serif';
        this.ctx.fillStyle = '#FFC2D1';
        this.ctx.fillText('Đừng nản lòng nhé! Hãy thử lại.', this.canvas.width/2, this.canvas.height/2 + 10);
        
        this.ctx.fillStyle = '#F3B3C3';
        this.ctx.beginPath();
        this.ctx.roundRect(this.canvas.width/2 - 60, this.canvas.height/2 + 35, 120, 32, 6);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#3E2723';
        this.ctx.font = 'bold 13px sans-serif';
        this.ctx.fillText('CHƠI LẠI 🎲', this.canvas.width/2, this.canvas.height/2 + 55);
      } 
      // Overlay Chiến thắng
      else if (this.gameState === 'WIN') {
        this.ctx.fillStyle = 'rgba(90, 45, 54, 0.85)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.font = 'bold 26px sans-serif';
        this.ctx.fillStyle = '#FFEBEF';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('CHIẾN THẮNG 🎉💖', this.canvas.width/2, this.canvas.height/2 - 40);
        
        this.ctx.font = '14px sans-serif';
        this.ctx.fillStyle = '#FFD1DC';
        this.ctx.fillText('Bạn đã thu thập đủ 5 lá thư tình đã mất.', this.canvas.width/2, this.canvas.height/2 - 10);
        
        this.ctx.font = 'italic 13px sans-serif';
        this.ctx.fillStyle = '#FFEAEF';
        this.ctx.fillText('"Hành trình tìm lại ký ức đã hoàn thành..."', this.canvas.width/2, this.canvas.height/2 + 15);
        
        this.ctx.font = '13px sans-serif';
        this.ctx.fillStyle = '#FFEBEE';
        this.ctx.fillText('Hãy viết lời chúc gửi vào Bình Ước Nguyện nhé! ♡', this.canvas.width/2, this.canvas.height/2 + 35);
        
        this.ctx.fillStyle = '#FFE5EC';
        this.ctx.beginPath();
        this.ctx.roundRect(this.canvas.width/2 - 70, this.canvas.height/2 + 55, 140, 32, 6);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#5A2D36';
        this.ctx.font = 'bold 12px sans-serif';
        this.ctx.fillText('ĐÓNG & VIẾT ƯỚC NGUYỆN', this.canvas.width/2, this.canvas.height/2 + 75);
      }
    }
  ```

---

### Task 3: Liên kết Vòng lặp game vào Trình đóng/mở Modal và Thử nghiệm game

**Files:**
- Modify: [app.js](file:///Users/twot/Documents/CODE/HuyKi/app.js)

**Interfaces:**
- Consumes: Hàm `openGameModal` và `closeGameModal` từ Task 1 và lớp `MemoryGame` từ Task 2.
- Produces: Hệ thống game tự động khởi chạy và tắt vòng lặp đúng chu kỳ khi mở/đóng modal.

- [ ] **Step 1: Liên kết vòng lặp hoạt họa của game vào sự kiện mở modal**
  Sửa đổi mã sự kiện mở/đóng modal cơ bản đã đăng ký ở Task 1 (Step 4) trong tệp [app.js](file:///Users/twot/Documents/CODE/HuyKi/app.js) để khởi tạo và dừng đối tượng game khi cần thiết:
  ```javascript
  let activeGame = null;
  let gameLoopId = null;

  function runGameLoop() {
    if (activeGame) {
      activeGame.update();
      activeGame.draw();
      gameLoopId = requestAnimationFrame(runGameLoop);
    }
  }

  function openGameModal() {
    if (gameModal) {
      gameModal.classList.remove('hidden');
      // Tạo đối tượng game mới và kích hoạt loop
      if (!activeGame) {
        activeGame = new MemoryGame('game-canvas');
      } else {
        activeGame.reset();
      }
      if (!gameLoopId) {
        runGameLoop();
      }
    }
  }

  function closeGameModal() {
    if (gameModal) {
      gameModal.classList.add('hidden');
      // Hủy game loop để tối ưu tài nguyên
      if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
      }
      if (activeGame) {
        activeGame.destroy();
        activeGame = null;
      }
    }
  }
  ```

- [ ] **Step 2: Commit và hoàn thiện nhánh phát triển**
  Chạy lệnh trong terminal:
  ```bash
  git add app.js
  git commit -m "feat: implement game engine physics loop and binding logic"
  ```

---

## Kế hoạch Xác minh thủ công (Manual Verification)
1. **Kiểm tra Giao diện trên Desktop**:
   * Mở tệp `index.html` trên trình duyệt.
   * Xác nhận sự xuất hiện của mô hình Game Boy hồng nhấp nháy chữ `PLAY ♡` bên cạnh Cassette.
   * Di chuột vào Game Boy để xác nhận hiệu ứng zoom/rotate.
   * Click vào Game Boy, modal game phải xuất hiện đúng hiệu ứng kính mờ và chứa Canvas.
2. **Kiểm tra Cơ chế chơi và điều khiển**:
   * Bấm phím mũi tên Trái/Phải hoặc phím A/D để chú mèo di chuyển.
   * Bấm phím Space hoặc W để chú mèo nhảy qua các bục lơ lửng.
   * Chạm vào bức thư tình `✉️` để tăng số lượng thu thập.
   * Thử nhảy dẫm lên đỉnh đám mây `☁️` để tiêu diệt nó. Thử đụng vào sườn đám mây để xem bị trừ mạng `❤️` và hồi sinh.
3. **Kiểm tra Thắng/Thua**:
   * Để mạng tụt về 0, màn hình phải hiển thị "TRÒ CHƠI KẾT THÚC". Click "CHƠI LẠI 🎲" để chơi lại.
   * Thu thập đủ 5 lá thư tình và đi đến hộp thư `📬`, màn hình phải báo "CHIẾN THẮNG". Click "ĐÓNG & VIẾT ƯỚC NGUYỆN" sẽ tự động đóng modal và đưa người dùng đến tab "Bình Ước Nguyện".
