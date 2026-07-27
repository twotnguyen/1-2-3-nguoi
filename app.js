/* ==========================================================================
   123 NGƯỜI - CLIENT-SIDE ES6 JAVASCRIPT APP LOGIC
   SPA Routing, Quiz Engine, Wish Jar LocalStorage, Audio Player & Ambient Particles
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // ------------------------------------------------------------------------
  // 1. AMBIENT PARTICLES ENGINE
  // ------------------------------------------------------------------------
  function initAmbientParticles() {
    const container = document.getElementById('ambient-container');
    if (!container) return;

    // Detect mobile device to optimize rendering frame rates
    const isMobile = window.innerWidth <= 768;
    const moteCount = isMobile ? 10 : 25;

    for (let i = 0; i < moteCount; i++) {
      const mote = document.createElement('div');
      mote.className = 'mote';
      
      const size = Math.random() * 8 + 4; // 4px to 12px
      const left = Math.random() * 100; // 0% to 100%
      const duration = Math.random() * 12 + 10; // 10s to 22s
      const delay = Math.random() * 10; // 0s to 10s

      mote.style.width = `${size}px`;
      mote.style.height = `${size}px`;
      mote.style.left = `${left}%`;
      mote.style.animationDuration = `${duration}s`;
      mote.style.animationDelay = `${delay}s`;

      container.appendChild(mote);
    }
  }

  // ------------------------------------------------------------------------
  // 2. LIVE CLOCK ENGINE
  // ------------------------------------------------------------------------
  function initLiveClock() {
    const clockEl = document.getElementById('clock-display');
    if (!clockEl) return;

    function updateClock() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      clockEl.textContent = `${hours}:${minutes}:${seconds}`;
    }

    updateClock();
    setInterval(updateClock, 1000);
  }

  // ------------------------------------------------------------------------
  // 3. SPA ROUTER ENGINE
  // ------------------------------------------------------------------------
  const views = document.querySelectorAll('.view-section');
  const navLinks = document.querySelectorAll('.nav-link, .nav-item-link, .mobile-nav-item');

  function switchTab(tabId) {
    // Hide all views
    views.forEach(view => {
      view.classList.remove('active');
    });

    // Show target view
    const targetView = document.getElementById(`${tabId}-view`);
    if (targetView) {
      targetView.classList.add('active');
    } else {
      // Fallback to home view if tabId not found
      document.getElementById('home-view')?.classList.add('active');
    }

    // Update active state on navigation links
    navLinks.forEach(link => {
      if (link.getAttribute('data-tab') === tabId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update location hash
    window.location.hash = tabId;
  }

  // Attach click listeners to all navigation links
  document.querySelectorAll('[data-tab]').forEach(element => {
    element.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = element.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Check initial hash
  const initialTab = window.location.hash.replace('#', '') || 'home';
  switchTab(initialTab);

  // ------------------------------------------------------------------------
  // 4. FLOATING AUDIO PLAYER ENGINE
  // ------------------------------------------------------------------------
  const bgAudio = document.getElementById('bg-audio');
  const volumeToggleBtn = document.getElementById('volume-toggle-btn');
  const volumeIconOn = document.getElementById('volume-icon-on');
  const volumeIconOff = document.getElementById('volume-icon-off');
  
  const playerPlayBtn = document.getElementById('player-play-btn');
  const playerPrevBtn = document.getElementById('player-prev-btn');
  const playerNextBtn = document.getElementById('player-next-btn');
  const albumCover = document.getElementById('album-cover');
  const songTitleEl = document.querySelector('.song-title');
  const songArtistEl = document.querySelector('.song-artist');
  const albumCoverImg = albumCover ? albumCover.querySelector('img') : null;

  const playlist = [
    { title: "1 2 3 Người", artist: "Huyki", src: "music/1_2_3_nguoi_mixing (3).mp3", cover: "music/logo_1_2_3_nguoi.png" },
    { title: "Chỉ iu mình ems", artist: "Huyki", src: "music/chiiuminhems.mp3", cover: "music/logo_chiiuminhems.png" },
    { title: "Sao anh tồi thế", artist: "Huyki", src: "music/saoanhtoithe.mp3", cover: "music/logo_saoanhtoithe.png" }
  ];
  let currentTrackIndex = 0;
  let isPlaying = false;

  function loadTrack(index) {
    if (!bgAudio) return;
    const track = playlist[index];
    bgAudio.src = track.src;
    if (songTitleEl) songTitleEl.textContent = track.title;
    if (songArtistEl) songArtistEl.textContent = track.artist;
    if (albumCoverImg) albumCoverImg.src = track.cover;
    if (isPlaying) {
      bgAudio.play().catch(() => {});
    }
  }

  function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if(isPlaying) {
      playerPlayBtn.textContent = '⏸';
      albumCover.classList.add('playing');
    }
  }

  function playPrevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    if(isPlaying) {
      playerPlayBtn.textContent = '⏸';
      albumCover.classList.add('playing');
    }
  }

  function attemptAutoplay() {
    if (!bgAudio || isPlaying) return;
    bgAudio.play().then(() => {
      isPlaying = true;
      if (playerPlayBtn) playerPlayBtn.textContent = '⏸';
      if (albumCover) albumCover.classList.add('playing');
      if (volumeIconOn) volumeIconOn.classList.remove('hidden');
      if (volumeIconOff) volumeIconOff.classList.add('hidden');
    }).catch(() => {});
  }

  if (bgAudio) {
    bgAudio.addEventListener('ended', playNextTrack);
    // Initialize first track and attempt immediate play
    loadTrack(currentTrackIndex);
    attemptAutoplay();
  }

  function toggleAudio() {
    if (!bgAudio) return;

    if (isPlaying) {
      bgAudio.pause();
      isPlaying = false;
      playerPlayBtn.textContent = '▶';
      albumCover.classList.remove('playing');
      if (volumeIconOn) volumeIconOn.classList.add('hidden');
      if (volumeIconOff) volumeIconOff.classList.remove('hidden');
    } else {
      bgAudio.play().then(() => {
        isPlaying = true;
        playerPlayBtn.textContent = '⏸';
        albumCover.classList.add('playing');
        if (volumeIconOn) volumeIconOn.classList.remove('hidden');
        if (volumeIconOff) volumeIconOff.classList.add('hidden');
      }).catch(err => {
        console.log('Audio autoplay prevented by browser policy:', err);
      });
    }
  }

  if (volumeToggleBtn) volumeToggleBtn.addEventListener('click', toggleAudio);
  if (playerPlayBtn) playerPlayBtn.addEventListener('click', toggleAudio);
  if (playerNextBtn) playerNextBtn.addEventListener('click', playNextTrack);
  if (playerPrevBtn) playerPrevBtn.addEventListener('click', playPrevTrack);

  // Auto-play trigger on ANY initial user interaction (click, touch, scroll, key, pointer)
  const interactionEvents = ['click', 'touchstart', 'pointerdown', 'keydown', 'scroll', 'mousemove'];
  function handleFirstUserInteraction() {
    if (!isPlaying) {
      attemptAutoplay();
    }
    if (isPlaying) {
      interactionEvents.forEach(evt => window.removeEventListener(evt, handleFirstUserInteraction));
    }
  }
  interactionEvents.forEach(evt => window.addEventListener(evt, handleFirstUserInteraction, { passive: true }));

  // Audio Player Minimize Toggle
  const playerToggleMinimize = document.getElementById('player-toggle-minimize');
  const audioWidgetContainer = document.getElementById('audio-widget-container');

  if (playerToggleMinimize && audioWidgetContainer) {
    playerToggleMinimize.addEventListener('click', (e) => {
      e.stopPropagation();
      audioWidgetContainer.classList.toggle('minimized');
      playerToggleMinimize.textContent = audioWidgetContainer.classList.contains('minimized') ? '➕' : '➖';
    });
  }

  // Camera Interactive Trigger
  const cameraTrigger = document.getElementById('camera-trigger');
  if (cameraTrigger) {
    cameraTrigger.addEventListener('click', () => {
      // Flash effect
      const flash = document.createElement('div');
      flash.style.position = 'fixed';
      flash.style.top = '0';
      flash.style.left = '0';
      flash.style.width = '100vw';
      flash.style.height = '100vh';
      flash.style.background = '#FFF';
      flash.style.opacity = '0.9';
      flash.style.zIndex = '9999';
      flash.style.transition = 'opacity 0.5s ease-out';
      document.body.appendChild(flash);

      setTimeout(() => {
        flash.style.opacity = '0';
      }, 50);
      setTimeout(() => flash.remove(), 550);

      showModal('Olympus AF-1 📸', 'Đã chụp khoảnh khắc dịu dàng này! Kỷ niệm sẽ luôn ở lại cùng bạn. ♡');
    });
  }

  // 3D Microwave Interactive Trigger
  const microwaveTrigger = document.getElementById('microwave-trigger');
  if (microwaveTrigger) {
    microwaveTrigger.addEventListener('click', () => {
      // Warm pink glow flash feedback
      const warmFlash = document.createElement('div');
      warmFlash.style.position = 'fixed';
      warmFlash.style.inset = '0';
      warmFlash.style.background = 'radial-gradient(circle at center, rgba(255, 180, 200, 0.6), transparent 70%)';
      warmFlash.style.zIndex = '9999';
      warmFlash.style.pointerEvents = 'none';
      warmFlash.style.transition = 'opacity 0.4s ease-out';
      document.body.appendChild(warmFlash);

      setTimeout(() => warmFlash.style.opacity = '0', 50);
      setTimeout(() => warmFlash.remove(), 450);
    });
  }

  // ------------------------------------------------------------------------
  // 5. INTERACTIVE 12-QUESTION QUIZ ENGINE
  // ------------------------------------------------------------------------
  const quizQuestions = [
    {
      id: 1,
      question: "Bạn thường nhớ về một người khi nào nhất?",
      options: [
        { key: "A", text: "Khi nghe một bài hát cũ.", icon: "🎵" },
        { key: "B", text: "Khi nhìn thấy hoàng hôn.", icon: "🌅" },
        { key: "C", text: "Khi thấy ai đó rất giống họ.", icon: "👥" },
        { key: "D", text: "Khi một mình vào buổi đêm.", icon: "🌙" }
      ]
    },
    {
      id: 2,
      question: "Cảm giác cô đơn nhất đối với bạn là gì?",
      options: [
        { key: "A", text: "Ở giữa một đám đông náo nhiệt.", icon: "🎆" },
        { key: "B", text: "Khi có tin vui nhưng không biết khoe cùng ai.", icon: "📩" },
        { key: "C", text: "Khi nhớ một người nhưng không có lý do để nhắn tin.", icon: "💭" },
        { key: "D", text: "Khi nhận ra mình đã quen với việc một mình.", icon: "☕" }
      ]
    },
    {
      id: 3,
      question: "Nếu có thể quay lại quá khứ, bạn muốn làm gì nhất?",
      options: [
        { key: "A", text: "Nói một lời cảm ơn chân thành.", icon: "💌" },
        { key: "B", text: "Dũng cảm ôm người ấy một lần.", icon: "🫂" },
        { key: "C", text: "Thay đổi quyết định trong một ngày mưa.", icon: "🌧️" },
        { key: "D", text: "Giữ nguyên mọi thứ, vì quá khứ đã đẹp rồi.", icon: "✨" }
      ]
    },
    {
      id: 4,
      question: "Mùi hương nào gợi nhớ kỷ niệm nhất đối với bạn?",
      options: [
        { key: "A", text: "Mùi mưa đầu mùa trên phố.", icon: "🌦️" },
        { key: "B", text: "Mùi cà phê ấm trong căn phòng nhỏ.", icon: "☕" },
        { key: "C", text: "Mùi nước hoa đặc trưng của ai đó.", icon: "🌸" },
        { key: "D", text: "Mùi sách cũ trong thư viện.", icon: "📚" }
      ]
    },
    {
      id: 5,
      question: "Cách bạn đi qua một nỗi buồn là gì?",
      options: [
        { key: "A", text: "Viết thật nhiều lời tâm sự vào nhật ký.", icon: "📝" },
        { key: "B", text: "Bật nhạc lofi thật to và ngắm trời đêm.", icon: "🎧" },
        { key: "C", text: "Đi dạo một mình quanh những con phố quen.", icon: "🚶" },
        { key: "D", text: "Tập trung làm việc thật bận rộn.", icon: "💻" }
      ]
    },
    {
      id: 6,
      question: "Điều gì khiến bạn dễ rung động nhất ở một người?",
      options: [
        { key: "A", text: "Nụ cười ấm áp và ánh mắt chân thành.", icon: "😊" },
        { key: "B", text: "Sự tinh tế trong từng cử chỉ nhỏ.", icon: "🌷" },
        { key: "C", text: "Giọng nói trầm ấm khi kể chuyện.", icon: "🎙️" },
        { key: "D", text: "Sự thấu hiểu mà không cần nói ra.", icon: "🤍" }
      ]
    },
    {
      id: 7,
      question: "Món quà nào bạn muốn nhận nhất từ người mình thương?",
      options: [
        { key: "A", text: "Một bức thư tay viết riêng cho bạn.", icon: "✉️" },
        { key: "B", text: "Một danh sách bài hát dành riêng.", icon: "🎶" },
        { key: "C", text: "Một cuốn ảnh chụp những khoảnh khắc dịu dàng.", icon: "📸" },
        { key: "D", text: "Thời gian ở bên nhau trọn vẹn.", icon: "⏳" }
      ]
    },
    {
      id: 8,
      question: "Thời điểm nào trong ngày khiến bạn cảm thấy bình yên nhất?",
      options: [
        { key: "A", text: "Sáng sớm khi thành phố còn sương mù.", icon: "🌅" },
        { key: "B", text: "Chiều tà hoàng hôn rực rỡ.", icon: "🌇" },
        { key: "C", text: "Tối muộn sau khi hoàn thành mọi việc.", icon: "🌃" },
        { key: "D", text: "Nửa đêm lặng ngắm mưa rơi.", icon: "🌌" }
      ]
    },
    {
      id: 9,
      question: "Lời tỏ tình lý tưởng trong mơ của bạn là gì?",
      options: [
        { key: "A", text: "Nhẹ nhàng under-the-radar dưới ánh đèn đường.", icon: "💡" },
        { key: "B", text: "Bất ngờ qua một bài hát ngọt ngào.", icon: "🎸" },
        { key: "C", text: "Bên bờ biển chiều hoàng hôn.", icon: "🌊" },
        { key: "D", text: "Một câu nói chân thành giữa những điều bình dị.", icon: "🏡" }
      ]
    },
    {
      id: 10,
      question: "Khi thương ai đó, bạn thuộc tuýp người nào?",
      options: [
        { key: "A", text: "Âm thầm quan tâm và theo dõi từ xa.", icon: "🔭" },
        { key: "B", text: "Chủ động tạo ra những cuộc gặp gỡ.", icon: "✨" },
        { key: "C", text: "Dành trọn sự dịu dàng nhất cho người đó.", icon: "💖" },
        { key: "D", text: "Lắng nghe và ở bên mỗi khi người đó cần.", icon: "👂" }
      ]
    },
    {
      id: 11,
      question: "Một buổi hẹn hò hoàn hảo với bạn sẽ như thế nào?",
      options: [
        { key: "A", text: "Đi cà phê đĩa than và trò chuyện tới khuya.", icon: "📻" },
        { key: "B", text: "Cùng đi dạo và ngắm nhìn hoàng hôn.", icon: "🌆" },
        { key: "C", text: "Nấu ăn cùng nhau tại nhà.", icon: "🍳" },
        { key: "D", text: "Ghé thăm triển lãm nghệ thuật nhỏ.", icon: "🎨" }
      ]
    },
    {
      id: 12,
      question: "Bạn tin vào điều gì nhất trong tình yêu?",
      options: [
        { key: "A", text: "Đúng người, đúng thời điểm.", icon: "⌛" },
        { key: "B", text: "Sự chân thành sẽ chạm tới trái tim.", icon: "❤️" },
        { key: "C", text: "Duyên số mang những tâm hồn đồng điệu lại gần.", icon: "🌌" },
        { key: "D", text: "Tình yêu là cùng nhau trưởng thành.", icon: "🌱" }
      ]
    }
  ];

  let currentQuestionIndex = 0;
  const userAnswers = [];

  const quizProgressText = document.getElementById('quiz-progress-text');
  const quizProgressFill = document.getElementById('quiz-progress-fill');
  const questionTag = document.getElementById('question-tag');
  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('quiz-options-container');

  const btnQuizHeart = document.getElementById('btn-quiz-heart');
  const btnStartQuiz = document.getElementById('btn-start-quiz');

  if (btnStartQuiz) {
    btnStartQuiz.addEventListener('click', () => {
      switchTab('quiz');
    });
  }

  function renderQuestion(index) {
    const q = quizQuestions[index];
    if (!q) return;

    if (quizProgressText) {
      quizProgressText.innerHTML = `${String(q.id).padStart(2, '0')} <small>/12</small>`;
    }

    if (quizProgressFill) {
      const percentage = ((index + 1) / quizQuestions.length) * 100;
      quizProgressFill.style.width = `${percentage}%`;
    }

    if (questionTag) questionTag.textContent = `Question ${String(q.id).padStart(2, '0')}`;
    if (questionText) questionText.textContent = q.question;

    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-card';
        if (userAnswers[index] === opt.key) {
          btn.classList.add('selected');
        }
        btn.setAttribute('data-option', opt.key);
        btn.innerHTML = `
          <span class="option-badge">${opt.key}</span>
          <span class="option-text">${opt.text}</span>
          <span class="option-icon">${opt.icon}</span>
        `;

        btn.addEventListener('click', () => {
          document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
          btn.classList.add('selected');
          userAnswers[index] = opt.key;
          
          // Tự động chuyển câu sau 350ms
          setTimeout(() => {
            if (currentQuestionIndex < quizQuestions.length - 1) {
              currentQuestionIndex++;
              renderQuestion(currentQuestionIndex);
            } else {
              displayGirlMatch(calculateMatchedGirl(userAnswers));
            }
          }, 350);
        });

        optionsContainer.appendChild(btn);
      });
    }
  }

  if (btnQuizHeart) {
    btnQuizHeart.addEventListener('click', () => {
      const heart = document.createElement('div');
      heart.textContent = '💖';
      heart.style.position = 'fixed';
      heart.style.left = `${btnQuizHeart.getBoundingClientRect().left + 20}px`;
      heart.style.top = `${btnQuizHeart.getBoundingClientRect().top}px`;
      heart.style.fontSize = '2rem';
      heart.style.pointerEvents = 'none';
      heart.style.transition = 'all 1s ease-out';
      heart.style.zIndex = '9999';

      document.body.appendChild(heart);

      setTimeout(() => {
        heart.style.transform = 'translateY(-80px) scale(1.4)';
        heart.style.opacity = '0';
      }, 50);

      setTimeout(() => {
        heart.remove();
      }, 1000);
    });
  }

  renderQuestion(currentQuestionIndex);

  // ------------------------------------------------------------------------
  // 6. PRIVATE WISH JAR: TELEGRAM BOT & EMAIL NOTIFICATION ENGINE
  // ------------------------------------------------------------------------
  // A. CẤU HÌNH GỬI VỀ TELEGRAM
  const TELEGRAM_CONFIG = {
    botToken: "", // Nhập Telegram Bot Token (Ví dụ: "7123456789:AAFx-XXXXXXXXX")
    chatId: ""    // Nhập Telegram Chat ID của bạn (Ví dụ: "123456789")
  };

  // B. CẤU HÌNH GỬI VỀ EMAIL (Sử dụng Web3Forms hoặc Formspree miễn phí)
  const EMAIL_CONFIG = {
    web3FormsAccessKey: "0edf8d64-db00-41c3-8a8e-9d3eb6ed198a", // Access Key của bạn từ Web3Forms
    formspreeUrl: ""        // Hoặc nhập URL Formspree (Ví dụ: "https://formspree.io/f/xzzpbqrw")
  };

  async function sendWishToTelegram(wishText) {
    if (!TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.chatId) return;
    try {
      const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
      const dateStr = new Date().toLocaleString('vi-VN');
      const payload = {
        chat_id: TELEGRAM_CONFIG.chatId,
        parse_mode: 'HTML',
        text: `💌 <b>LỜI ƯỚC NGUYỆN MỚI</b>\n\n💬 <i>"${wishText}"</i>\n\n⏰ <code>${dateStr}</code>`
      };
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.log('Lỗi gửi Telegram:', e);
    }
  }

  async function sendWishToEmail(wishText) {
    const dateStr = new Date().toLocaleString('vi-VN');

    // 1. Gửi qua Web3Forms (Nếu có Access Key)
    if (EMAIL_CONFIG.web3FormsAccessKey) {
      try {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            access_key: EMAIL_CONFIG.web3FormsAccessKey,
            subject: "💌 Lời ước nguyện mới từ Web 123 Người",
            from_name: "123 Người Web",
            message: wishText,
            time: dateStr
          })
        });
      } catch (e) {
        console.log('Lỗi gửi Email Web3Forms:', e);
      }
    }

    // 2. Gửi qua Formspree (Nếu có URL Formspree)
    if (EMAIL_CONFIG.formspreeUrl) {
      try {
        await fetch(EMAIL_CONFIG.formspreeUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            subject: "💌 Lời ước nguyện mới từ Web 123 Người",
            message: wishText,
            time: dateStr
          })
        });
      } catch (e) {
        console.log('Lỗi gửi Email Formspree:', e);
      }
    }
  }

  const wishInput = document.getElementById('wish-input');
  const charCounter = document.getElementById('char-counter');
  const btnSubmitWish = document.getElementById('btn-submit-wish');
  const recentWishesList = document.getElementById('recent-wishes-list');
  const btnViewAllWishes = document.getElementById('btn-view-all-wishes');

  const allWishesModal = document.getElementById('all-wishes-modal');
  const allWishesContainer = document.getElementById('all-wishes-container');
  const wishesModalClose = document.getElementById('wishes-modal-close');
  const wishesModalOk = document.getElementById('wishes-modal-ok');

  let storedWishes = JSON.parse(localStorage.getItem('wish_jar_messages') || '[]');

  if (storedWishes.length === 0) {
    storedWishes = [
      'Làm sao để quên một người mình từng rất yêu?',
      'Có ai từng cảm thấy cô đơn giữa một đám đông?',
      'Giá như ngày đó mình dũng cảm hơn...',
      'Cảm ơn vì đã cho mình biết thế nào là được thương chiều.',
      'Hy vọng ở một nơi nào đó, bạn luôn bình an và mỉm cười.'
    ];
    localStorage.setItem('wish_jar_messages', JSON.stringify(storedWishes));
  }

  function renderRecentWishes() {
    if (!recentWishesList) return;
    recentWishesList.innerHTML = '';
    storedWishes.slice(0, 5).forEach(msg => {
      const li = document.createElement('li');
      li.textContent = `♡ "${msg}"`;
      recentWishesList.appendChild(li);
    });
  }

  // Interactive Folded Notes inside Mason Jar
  document.querySelectorAll('.folded-note').forEach(note => {
    note.addEventListener('click', () => {
      const randomMsg = storedWishes[Math.floor(Math.random() * storedWishes.length)];
      showModal('Một lá thư trong hũ... 💌', `"${randomMsg}"`);
    });
  });

  // View All Wishes Modal
  function openAllWishesModal() {
    if (!allWishesModal || !allWishesContainer) return;
    allWishesContainer.innerHTML = '';
    storedWishes.forEach((w, idx) => {
      const div = document.createElement('div');
      div.className = 'wish-item-card';
      div.innerHTML = `<strong>#${idx + 1}</strong> ♡ "${w}"`;
      allWishesContainer.appendChild(div);
    });
    allWishesModal.classList.remove('hidden');
  }

  function closeAllWishesModal() {
    if (allWishesModal) allWishesModal.classList.add('hidden');
  }

  if (btnViewAllWishes) {
    btnViewAllWishes.addEventListener('click', (e) => {
      e.preventDefault();
      openAllWishesModal();
    });
  }

  if (wishesModalClose) wishesModalClose.addEventListener('click', closeAllWishesModal);
  if (wishesModalOk) wishesModalOk.addEventListener('click', closeAllWishesModal);

  if (wishInput && charCounter) {
    wishInput.addEventListener('input', () => {
      charCounter.textContent = wishInput.value.length;
    });
  }

  if (btnSubmitWish) {
    btnSubmitWish.addEventListener('click', () => {
      const text = wishInput.value.trim();
      if (!text) {
        showModal('Nhắc nhở ♡', 'Vui lòng viết điều bạn muốn chia sẻ trước khi gửi nhé!');
        return;
      }

      // Tự động gửi về Telegram & Email cá nhân
      sendWishToTelegram(text);
      sendWishToEmail(text);

      storedWishes.unshift(text);
      localStorage.setItem('wish_jar_messages', JSON.stringify(storedWishes));
      renderRecentWishes();

      wishInput.value = '';
      if (charCounter) charCounter.textContent = '0';

      showModal('Bình Ước Nguyện ♡', 'Lời nhắn của bạn đã được gấp gọn và thả vào Bình Ước Nguyện. Cảm ơn bạn đã tin tưởng và chia sẻ! 💖');
    });
  }

  renderRecentWishes();

  // ------------------------------------------------------------------------
  // 7. MODAL DIALOG ENGINE & 12 MATCHED GIRLS LOGIC
  // ------------------------------------------------------------------------
  const matchedGirls = [
    {
      name: "Hân",
      age: 21,
      color: "Vàng pastel",
      colorHex: "#F6E0B5",
      personality: "Luôn cười, tích cực",
      likes: "Cà phê sáng, chụp ảnh film",
      dislikes: "Người đến muộn",
      quote: "Một nụ cười đôi khi cứu được cả một ngày.",
      loveLanguage: "Words of Affirmation",
      avatar: "images/han.png"
    },
    {
      name: "Ân",
      age: 22,
      color: "Kem",
      colorHex: "#FFF3DD",
      personality: "Quan tâm từng điều nhỏ",
      likes: "Nấu ăn, chăm sóc người khác",
      dislikes: "Bị phớt lờ",
      quote: "Không cần hoàn hảo, chỉ cần có mặt.",
      loveLanguage: "Acts of Service",
      avatar: "images/an.png"
    },
    {
      name: "Vy",
      age: 20,
      color: "Cam pastel",
      colorHex: "#FFD8BE",
      personality: "Hài hước",
      likes: "Meme, Uno, Boardgame",
      dislikes: "Không khí im lặng",
      quote: "Nếu em làm anh cười thì hôm nay đã đáng rồi.",
      loveLanguage: "Quality Time",
      avatar: "images/vy.png"
    },
    {
      name: "My",
      age: 21,
      color: "Tím pastel",
      colorHex: "#E4D5F7",
      personality: "Nhẹ nhàng",
      likes: "Nhật ký, hoa, hoàng hôn",
      dislikes: "Người vô tâm",
      quote: "Em tin tình yêu sẽ đến dù có muộn thì vẫn đến.",
      loveLanguage: "Quality Time",
      avatar: "images/my.png"
    },
    {
      name: "Trân",
      age: 22,
      color: "Tím nhạt",
      colorHex: "#E4D5F7",
      personality: "Nghệ thuật",
      likes: "Vẽ, triển lãm, indie music",
      dislikes: "Ồn ào",
      quote: "Có những cảm xúc không thể nói bằng lời.",
      loveLanguage: "Quality Time",
      avatar: "images/tran.png"
    },
    {
      name: "Thảo",
      age: 22,
      color: "Xanh navy",
      colorHex: "#C5D3E8",
      personality: "Trầm",
      likes: "Nhà sách, cà phê yên tĩnh",
      dislikes: "Bị cắt lời",
      quote: "Có người đọc sách để hiểu thế giới, có người để hiểu chính mình.",
      loveLanguage: "Words of Affirmation",
      avatar: "images/thao.png"
    },
    {
      name: "Nhi",
      age: 20,
      color: "Xanh lá",
      colorHex: "#C8E6C9",
      personality: "Thích trải nghiệm",
      likes: "Đi bộ, du lịch, trekking",
      dislikes: "Lập kế hoạch quá nhiều",
      quote: "Đi thôi, biết đâu hôm nay đẹp.",
      loveLanguage: "Quality Time",
      avatar: "images/nhi.png"
    },
    {
      name: "Đào",
      age: 23,
      color: "Xám xanh",
      colorHex: "#CFD8DC",
      personality: "Tự lập",
      likes: "Làm việc một mình",
      dislikes: "Phụ thuộc",
      quote: "Em ổn, nhưng có anh thì vui hơn.",
      loveLanguage: "Respect & Trust",
      avatar: "images/dao.png"
    },
    {
      name: "Phương",
      age: 21,
      color: "Hồng nhạt",
      colorHex: "#F8BBD0",
      personality: "Dịu dàng",
      likes: "Hoa, trà, mùi thơm",
      dislikes: "To tiếng",
      quote: "Không phải ai nhẹ nhàng cũng yếu đuối.",
      loveLanguage: "Physical Touch",
      avatar: "images/phuong.png"
    },
    {
      name: "Hương",
      age: 22,
      color: "Đỏ pastel",
      colorHex: "#FFCDD2",
      personality: "Lãng mạn",
      likes: "Viết thư tay",
      dislikes: "Quên ngày kỷ niệm",
      quote: "Yêu là nhớ cả những điều rất nhỏ.",
      loveLanguage: "Gift Giving",
      avatar: "images/huong.png"
    },
    {
      name: "Thương",
      age: 23,
      color: "Trắng",
      colorHex: "#FFFFFF",
      personality: "Chung thủy",
      likes: "Gia đình",
      dislikes: "Nói dối",
      quote: "Ở lại đôi khi cần nhiều dũng cảm hơn rời đi.",
      loveLanguage: "Acts of Service",
      avatar: "images/thuong.png"
    },
    {
      name: "Ngân",
      age: 22,
      color: "Xanh pastel",
      colorHex: "#B3E5FC",
      personality: "Bình yên",
      likes: "Hoàng hôn, biển, âm nhạc",
      dislikes: "So sánh",
      quote: "Có lẽ bình yên là khi không cần cố gắng trở thành ai khác.",
      loveLanguage: "Quality Time",
      avatar: "images/ngan.png"
    },
    {
      name: "Như",
      age: 21,
      color: "Hồng đào",
      colorHex: "#FFB7B2",
      personality: "Sâu sắc, lắng nghe",
      likes: "Trà hoa cúc, đọc sách, ngắm mưa",
      dislikes: "Sự dối trá, nơi quá ồn ào",
      quote: "Dù đi qua bao nhiêu bão giông, lòng vẫn giữ một khoảng bình yên.",
      loveLanguage: "Words of Affirmation",
      avatar: "images/nhu.png"
    },
    {
      name: "Ty",
      age: 20,
      color: "Xanh da trời",
      colorHex: "#AEC6CF",
      personality: "Năng động, cá tính",
      likes: "Chụp ảnh Polaroid, du lịch phượt, nhạc Indie",
      dislikes: "Sự gò bó, tính toán chi li",
      quote: "Cuộc đời quá ngắn để chần chừ một cái ôm.",
      loveLanguage: "Quality Time",
      avatar: "images/ty.png"
    },
    {
      name: "Hiền",
      age: 20,
      color: "Hồng pastel",
      colorHex: "#FFD1DC",
      personality: "Mộng mơ",
      likes: "Gấu bông, concert, biển",
      dislikes: "Người thực dụng",
      quote: "Em tin mọi cuộc gặp đều có lý do.",
      loveLanguage: "Gift Giving",
      avatar: "images/hien.jpg"
    }
  ];

  const matchGirlModal = document.getElementById('match-girl-modal');
  const matchGirlAvatar = document.getElementById('match-girl-avatar');
  const matchGirlAvatarFrame = document.getElementById('match-girl-avatar-frame');
  const matchGirlName = document.getElementById('match-girl-name');
  const matchGirlMeta = document.getElementById('match-girl-meta');
  const matchGirlPersonality = document.getElementById('match-girl-personality');
  const matchGirlLove = document.getElementById('match-girl-love');
  const matchGirlLikes = document.getElementById('match-girl-likes');
  const matchGirlDislikes = document.getElementById('match-girl-dislikes');
  const matchGirlQuote = document.getElementById('match-girl-quote');
  const matchModalClose = document.getElementById('match-modal-close');
  const matchModalOk = document.getElementById('match-modal-ok');
  const btnRematch = document.getElementById('btn-rematch');

  let currentGirl = null;

  function getRecentMatchHistory() {
    try {
      return JSON.parse(sessionStorage.getItem('recent_matched_girls_history') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveRecentMatchHistory(history) {
    try {
      sessionStorage.setItem('recent_matched_girls_history', JSON.stringify(history.slice(0, 10)));
    } catch (e) {}
  }

  function getRandomGirl() {
    return calculateMatchedGirl([]);
  }

  function calculateMatchedGirl(answers) {
    const history = getRecentMatchHistory();
    
    // Kết hợp yếu tố ngẫu nhiên động cùng câu trả lời để kết quả luôn tươi mới, bất ngờ
    let score = Math.floor(Math.random() * 10007);
    if (answers && answers.length > 0) {
      const optionMap = { 'A': 1, 'B': 3, 'C': 7, 'D': 11 };
      answers.forEach((ans, idx) => {
        const val = optionMap[ans] || Math.floor(Math.random() * 10);
        score += val * (idx + 1) * (Math.floor(Math.random() * 13) + 1);
      });
    }

    let chosenIndex = Math.abs(score) % matchedGirls.length;
    let chosenGirl = matchedGirls[chosenIndex];

    // Kiểm tra quy tắc: Không trùng 1 nhân vật 3 lần liên tiếp (tối đa 2 lần liên tiếp)
    if (history.length >= 2 && history[0] === chosenGirl.name && history[1] === chosenGirl.name) {
      const validGirls = matchedGirls.filter(g => g.name !== chosenGirl.name);
      chosenGirl = validGirls[Math.floor(Math.random() * validGirls.length)];
    }

    // Lưu vào lịch sử
    history.unshift(chosenGirl.name);
    saveRecentMatchHistory(history);

    return chosenGirl;
  }

  function displayGirlMatch(girl) {
    if (!girl) girl = calculateMatchedGirl(userAnswers);
    currentGirl = girl;

    if (matchGirlAvatar) matchGirlAvatar.src = girl.avatar;
    if (matchGirlName) matchGirlName.textContent = girl.name;
    if (matchGirlMeta) matchGirlMeta.textContent = `${girl.age} tuổi • Màu đại diện: ${girl.color}`;
    if (matchGirlPersonality) matchGirlPersonality.textContent = girl.personality;
    if (matchGirlLove) matchGirlLove.textContent = girl.loveLanguage;
    if (matchGirlLikes) matchGirlLikes.textContent = girl.likes;
    if (matchGirlDislikes) matchGirlDislikes.textContent = girl.dislikes;
    if (matchGirlQuote) matchGirlQuote.textContent = `"${girl.quote}"`;

    if (matchGirlAvatarFrame && girl.colorHex) {
      matchGirlAvatarFrame.style.background = `linear-gradient(135deg, ${girl.colorHex}, var(--primary-rose))`;
    }

    if (matchGirlModal) {
      matchGirlModal.classList.remove('hidden');
    }
  }

  function closeGirlMatchModal() {
    if (matchGirlModal) matchGirlModal.classList.add('hidden');
  }

  if (matchModalClose) matchModalClose.addEventListener('click', closeGirlMatchModal);

  // Mini Game Modal Event Listeners
  const gameModal = document.getElementById('game-modal');
  const gameboyTrigger = document.getElementById('gameboy-trigger');
  const gameModalClose = document.getElementById('game-modal-close');
  let activeGame = null;

  function openGameModal() {
    if (gameModal) {
      gameModal.classList.remove('hidden');
      // Tạo đối tượng game mới và kích hoạt loop
      if (!activeGame) {
        activeGame = new MemoryGame('game-canvas');
      } else {
        activeGame.reset();
      }
      activeGame.start();
    }
  }

  function closeGameModal() {
    if (gameModal) {
      gameModal.classList.add('hidden');
      if (activeGame) {
        activeGame.destroy();
        activeGame = null;
      }
    }
  }

  if (gameboyTrigger) gameboyTrigger.addEventListener('click', openGameModal);
  if (gameModalClose) gameModalClose.addEventListener('click', closeGameModal);
  
  const socialShareModal = document.getElementById('social-share-modal');
  const shareModalClose = document.getElementById('share-modal-close');
  const shareModalOk = document.getElementById('share-modal-ok');
  const shareUrlInput = document.getElementById('share-url-input');
  const btnCopyShareUrl = document.getElementById('btn-copy-share-url');
  const shareFb = document.getElementById('share-fb');
  const shareTiktok = document.getElementById('share-tiktok');
  const shareInsta = document.getElementById('share-insta');
  const shareZalo = document.getElementById('share-zalo');

  function openSocialShareModal(girl) {
    const currentUrl = window.location.href;
    const shareText = `✨ Kết quả 123 Người: Người phù hợp của mình là ${girl ? girl.name : 'Người ấy'} (${girl ? girl.age : 20} tuổi - ${girl ? girl.personality : 'Bình yên'}) ♡ "${girl ? girl.quote : ''}"`;
    
    if (shareUrlInput) shareUrlInput.value = currentUrl;

    if (shareFb) {
      shareFb.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(shareText)}`;
    }
    if (shareZalo) {
      shareZalo.href = `https://sp.zalo.me/share_inline?link=${encodeURIComponent(currentUrl)}&content=${encodeURIComponent(shareText)}`;
    }
    if (shareTiktok) {
      shareTiktok.onclick = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(`${shareText}\n${currentUrl}`).then(() => {
          showModal('TikTok Share 🎵', 'Đã sao chép nội dung kết quả! Bạn có thể dán vào bài đăng TikTok nhé! 💖');
          window.open('https://www.tiktok.com/', '_blank');
        }).catch(() => {
          window.open('https://www.tiktok.com/', '_blank');
        });
      };
    }
    if (shareInsta) {
      shareInsta.onclick = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(`${shareText}\n${currentUrl}`).then(() => {
          showModal('Instagram Share 📸', 'Đã sao chép nội dung kết quả! Bạn có thể dán vào Story hoặc bài đăng Instagram nhé! 💖');
          window.open('https://www.instagram.com/', '_blank');
        }).catch(() => {
          window.open('https://www.instagram.com/', '_blank');
        });
      };
    }

    // Try Web Share API first if supported on mobile
    if (navigator.share) {
      navigator.share({
        title: '123 Người ♡',
        text: shareText,
        url: currentUrl
      }).catch(() => {
        if (socialShareModal) socialShareModal.classList.remove('hidden');
      });
    } else {
      if (socialShareModal) socialShareModal.classList.remove('hidden');
    }
  }

  function closeSocialShareModal() {
    if (socialShareModal) socialShareModal.classList.add('hidden');
  }

  if (shareModalClose) shareModalClose.addEventListener('click', closeSocialShareModal);
  if (shareModalOk) shareModalOk.addEventListener('click', closeSocialShareModal);

  if (btnCopyShareUrl) {
    btnCopyShareUrl.addEventListener('click', () => {
      const currentUrl = shareUrlInput ? shareUrlInput.value : window.location.href;
      const girl = currentGirl;
      const shareText = `✨ Kết quả 123 Người: Người phù hợp của mình là ${girl ? girl.name : 'Người ấy'} (${girl ? girl.age : 20} tuổi - ${girl ? girl.personality : 'Bình yên'}) ♡ "${girl ? girl.quote : ''}"\n${currentUrl}`;

      navigator.clipboard.writeText(shareText).then(() => {
        btnCopyShareUrl.textContent = 'Đã chép! ✓';
        setTimeout(() => btnCopyShareUrl.textContent = 'Sao chép 📋', 2000);
      }).catch(() => {
        showModal('Nhắc nhở', 'Vui lòng sao chép đường dẫn thủ công: ' + currentUrl);
      });
    });
  }

  if (matchModalOk) {
    matchModalOk.addEventListener('click', () => {
      closeGirlMatchModal();
      openSocialShareModal(currentGirl);
    });
  }

  if (btnRematch) {
    btnRematch.addEventListener('click', () => {
      closeGirlMatchModal();
      currentQuestionIndex = 0;
      userAnswers.length = 0;
      renderQuestion(0);
      switchTab('quiz');
    });
  }

  const modal = document.getElementById('action-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalOkBtn = document.getElementById('modal-ok-btn');

  function showModal(title, message) {
    if (!modal) return;
    if (modalTitle) modalTitle.textContent = title;
    if (modalBody) modalBody.textContent = message;
    modal.classList.remove('hidden');
  }

  function closeModal() {
    if (modal) modal.classList.add('hidden');
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOkBtn) modalOkBtn.addEventListener('click', closeModal);

  // ------------------------------------------------------------------------
  // 8. INTERACTIVE PHOTO GALLERY ENGINE (CURATED PRESETS)
  // ------------------------------------------------------------------------
  const presetFrames = [
    { id: 1, title: "Kỷ niệm #1 ♡", desc: "Khoảnh khắc dịu dàng lưu giữ cùng thời gian.", src: "images/gallery/0 (1).png", style: "polaroid" },
    { id: 2, title: "Kỷ niệm #2 👑", desc: "Góc nhỏ thân thương của những ngày đã qua.", src: "images/gallery/1 (1).png", style: "vintage-gold" },
    { id: 3, title: "Kỷ niệm #3 💖", desc: "Nụ cười trong vắt sưởi ấm tâm hồn.", src: "images/gallery/2.1.png", style: "sparkle-heart" },
    { id: 4, title: "Kỷ niệm #4 🎬", desc: "Thước phim ký ức trôi qua nhè nhẹ.", src: "images/gallery/3 (1).png", style: "film-strip" },
    { id: 5, title: "Kỷ niệm #5 ✉️", desc: "Gửi vào quá khứ lời cảm ơn chân thành.", src: "images/gallery/4 (1).png", style: "postcard" },
    { id: 6, title: "Kỷ niệm #6 🌅", desc: "Vệt nắng chiều nhuộm hồng kỷ niệm.", src: "images/gallery/5 (1).png", style: "polaroid" },
    { id: 7, title: "Kỷ niệm #7 🌙", desc: "Thành phố về đêm thì thầm ngàn lời yêu.", src: "images/gallery/6 (1).png", style: "vintage-gold" },
    { id: 8, title: "Kỷ niệm #8 ✨", desc: "Ánh mắt biết nói trao trọn niềm tin.", src: "images/gallery/7 (1).png", style: "sparkle-heart" },
    { id: 9, title: "Kỷ niệm #9 ☕", desc: "Góc nhỏ cà phê và buổi chiều thanh bình.", src: "images/gallery/8 (1).png", style: "film-strip" },
    { id: 10, title: "Kỷ niệm #10 🌸", desc: "Sắc hoa rực rỡ bên ô cửa sổ.", src: "images/gallery/9 (1).png", style: "postcard" },
    { id: 11, title: "Kỷ niệm #11 ♡", desc: "Bình yên là khi có ai đó luôn chờ đợi.", src: "images/gallery/10 (1).png", style: "polaroid" },
    { id: 12, title: "Kỷ niệm #12 🌅", desc: "Hoàng hôn lãng mạn phủ kín chân trời.", src: "images/gallery/1759588731958.JPG", style: "vintage-gold" },
    { id: 13, title: "Kỷ niệm #13 💖", desc: "Tình yêu bắt đầu từ những điều giản dị.", src: "images/gallery/1761373756774.png", style: "sparkle-heart" },
    { id: 14, title: "Kỷ niệm #14 🌙", desc: "Đêm muộn đong đầy nỗi nhớ khôn nguôi.", src: "images/gallery/1761373757339.jpg", style: "film-strip" },
    { id: 15, title: "Kỷ niệm #15 ✉️", desc: "Một bức thư chưa dám gửi cho người ấy.", src: "images/gallery/1761373757851.jpg", style: "postcard" },
    { id: 16, title: "Kỷ niệm #16 🍃", desc: "Cơn gió nhẹ thổi qua ngày nắng hạ.", src: "images/gallery/1761373757884.jpg", style: "polaroid" },
    { id: 17, title: "Kỷ niệm #17 ☕", desc: "Ấm áp tách trà nóng giữa ngày đông.", src: "images/gallery/1761373757918.jpg", style: "vintage-gold" },
    { id: 18, title: "Kỷ niệm #18 🌧️", desc: "Tiếng mưa rơi nhè nhẹ ngoài hiên.", src: "images/gallery/1761374022371.jpg", style: "sparkle-heart" },
    { id: 19, title: "Kỷ niệm #19 🎬", desc: "Từng khung hình quay chậm đáng giá.", src: "images/gallery/1761374022434.jpg", style: "film-strip" },
    { id: 20, title: "Kỷ niệm #20 ✉️", desc: "Lời hứa thanh xuân ngàn năm giữ trọn.", src: "images/gallery/1761374022751.jpeg", style: "postcard" },
    { id: 21, title: "Kỷ niệm #21 ♡", desc: "Nụ cười rạng rỡ thắp sáng ngàn ánh sao.", src: "images/gallery/IMG_1748518542492_1748518583671.jpg", style: "polaroid" },
    { id: 22, title: "Kỷ niệm #22 🌆", desc: "Chiều dịu dàng nghiêng mình bóng xế.", src: "images/gallery/IMG_1910-Enhanced-NR.jpg", style: "vintage-gold" },
    { id: 23, title: "Kỷ niệm #23 ✨", desc: "Khoảnh khắc tuyệt vời nhất từng trải qua.", src: "images/gallery/IMG_2131.JPG", style: "sparkle-heart" },
    { id: 24, title: "Kỷ niệm #24 🎬", desc: "Trân trọng từng ngày tháng bên nhau.", src: "images/gallery/z6304858052609_e7af4a941c7265a1ccc06a9e6ad8fb6a.jpg", style: "film-strip" }
  ];

  const galleryGrid = document.getElementById('gallery-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxOkBtn = document.getElementById('lightbox-ok-btn');
  const lightboxDownloadBtn = document.getElementById('lightbox-download-btn');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxFrameContainer = document.getElementById('lightbox-frame-container');

  function createFrameElement(item) {
    const frameDiv = document.createElement('div');
    frameDiv.className = `gallery-frame frame-style-${item.style}`;
    frameDiv.setAttribute('data-style', item.style);

    let innerHTML = '';
    if (item.style === 'polaroid') {
      innerHTML = `
        <div class="frame-tape-strip"></div>
        <div class="frame-img-box">
          <img src="${item.src}" alt="${item.title}">
        </div>
        <div class="frame-stamp">123 NGƯỜI</div>
      `;
    } else if (item.style === 'vintage-gold') {
      innerHTML = `
        <div class="frame-img-box">
          <img src="${item.src}" alt="${item.title}">
        </div>
      `;
    } else if (item.style === 'sparkle-heart') {
      innerHTML = `
        <div class="frame-img-box">
          <img src="${item.src}" alt="${item.title}">
          <div class="sparkle-overlay"></div>
        </div>
      `;
    } else if (item.style === 'film-strip') {
      innerHTML = `
        <div class="frame-img-box">
          <img src="${item.src}" alt="${item.title}">
        </div>
      `;
    } else if (item.style === 'postcard') {
      innerHTML = `
        <div class="frame-img-box">
          <img src="${item.src}" alt="${item.title}">
        </div>
        <div class="frame-stamp">📮</div>
      `;
    }

    frameDiv.innerHTML = innerHTML;

    frameDiv.addEventListener('click', () => {
      openLightboxModal(item);
    });

    return frameDiv;
  }

  function renderGallery(filter = 'all') {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';

    const filteredItems = filter === 'all' 
      ? presetFrames 
      : presetFrames.filter(item => item.style === filter);

    filteredItems.forEach(item => {
      galleryGrid.appendChild(createFrameElement(item));
    });
  }

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderGallery(filter);
    });
  });

  // Lightbox Modal Handling
  function openLightboxModal(item) {
    if (!lightboxModal || !lightboxFrameContainer) return;

    lightboxFrameContainer.innerHTML = '';
    lightboxFrameContainer.appendChild(createFrameElement(item));

    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxDesc) lightboxDesc.textContent = item.desc;

    lightboxModal.classList.remove('hidden');
  }

  function closeLightboxModal() {
    if (lightboxModal) lightboxModal.classList.add('hidden');
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightboxModal);
  if (lightboxOkBtn) lightboxOkBtn.addEventListener('click', closeLightboxModal);

  if (lightboxDownloadBtn) {
    lightboxDownloadBtn.addEventListener('click', () => {
      showModal('Lưu Khoảnh Khắc 💾', 'Đã lưu khoảnh khắc dịu dàng này! ♡');
      closeLightboxModal();
    });
  }

  // Render initial gallery grid
  renderGallery();

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
        btnLeft.onmouseup = btnLeft.onmouseleave = btnLeft.ontouchend = btnLeft.ontouchcancel = () => { this.keys.left = false; };
      }
      if (btnRight) {
        btnRight.onmousedown = btnRight.ontouchstart = (e) => { e.preventDefault(); this.keys.right = true; };
        btnRight.onmouseup = btnRight.onmouseleave = btnRight.ontouchend = btnRight.ontouchcancel = () => { this.keys.right = false; };
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
            if (typeof closeGameModal === 'function') {
              closeGameModal();
            } else {
              document.getElementById('game-modal').classList.add('hidden');
            }
            const wishJarTab = document.querySelector('[data-tab="wish-jar"]');
            if (wishJarTab) wishJarTab.click();
          }
        }
      };
    }
    
    destroy() {
      this.stop();
      window.removeEventListener('keydown', this.keyHandler);
      window.removeEventListener('keyup', this.keyHandler);
      
      const btnLeft = document.getElementById('btn-move-left');
      const btnRight = document.getElementById('btn-move-right');
      const btnJump = document.getElementById('btn-jump');
      
      if (btnLeft) {
        btnLeft.onmousedown = btnLeft.ontouchstart = null;
        btnLeft.onmouseup = btnLeft.onmouseleave = btnLeft.ontouchend = btnLeft.ontouchcancel = null;
      }
      if (btnRight) {
        btnRight.onmousedown = btnRight.ontouchstart = null;
        btnRight.onmouseup = btnRight.onmouseleave = btnRight.ontouchend = btnRight.ontouchcancel = null;
      }
      if (btnJump) {
        btnJump.onmousedown = btnJump.ontouchstart = null;
      }
      if (this.canvas) {
        this.canvas.onclick = null;
      }
    }
    
    checkCollision(rect1, rect2) {
      return rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.y + rect1.height > rect2.y;
    }

    start() {
      this.active = true;
      this.gameLoop();
    }

    stop() {
      this.active = false;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }

    gameLoop() {
      if (!this.active) return;
      this.update();
      this.draw();
      this.animationId = requestAnimationFrame(() => this.gameLoop());
    }

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
        this.damagePlayer(true);
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
    
    damagePlayer(force = false) {
      if (this.player.invulnerable > 0 && !force) return;
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

    draw() {
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'top';
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
        if (this.ctx.roundRect) {
          this.ctx.roundRect(p.x, p.y, p.width, p.height, p.type === 'cloud' || p.type === 'moving' ? 6 : 0);
        } else {
          this.ctx.rect(p.x, p.y, p.width, p.height);
        }
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
        if (this.ctx.roundRect) {
          this.ctx.roundRect(this.canvas.width/2 - 60, this.canvas.height/2 + 35, 120, 32, 6);
        } else {
          this.ctx.rect(this.canvas.width/2 - 60, this.canvas.height/2 + 35, 120, 32);
        }
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
        if (this.ctx.roundRect) {
          this.ctx.roundRect(this.canvas.width/2 - 70, this.canvas.height/2 + 55, 140, 32, 6);
        } else {
          this.ctx.rect(this.canvas.width/2 - 70, this.canvas.height/2 + 55, 140, 32);
        }
        this.ctx.fill();
        
        this.ctx.fillStyle = '#5A2D36';
        this.ctx.font = 'bold 12px sans-serif';
        this.ctx.fillText('ĐÓNG & VIẾT ƯỚC NGUYỆN', this.canvas.width/2, this.canvas.height/2 + 75);
      }
    }
  }

  // Initialize background animations and live clock
  initAmbientParticles();
  initLiveClock();

});

