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
    { title: "1 2 3 Người", artist: "Huyki", src: "music/1_2_3_nguoi.mp3", cover: "music/logo_1_2_3_nguoi.png" },
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
              displayGirlMatch();
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
  // 6. WISH JAR & LOCALSTORAGE ENGINE
  // ------------------------------------------------------------------------
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
      avatar: "images/han.jpg"
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
      avatar: "images/tran.jpg"
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
      avatar: "images/ngan.jpg"
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

  function getRandomGirl() {
    return matchedGirls[Math.floor(Math.random() * matchedGirls.length)];
  }

  function displayGirlMatch(girl) {
    if (!girl) girl = getRandomGirl();
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
  // 8. INTERACTIVE PHOTO GALLERY ENGINE & FRAME CREATOR
  // ------------------------------------------------------------------------
  const presetFrames = [
    {
      id: 1,
      title: "Hoàng hôn năm ấy... ♡",
      desc: "Những ngày hoàng hôn nhuộm hồng góc biển, nơi chúng ta từng cùng ngắm nhìn bầu trời.",
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      style: "polaroid",
      caption: "Hoàng hôn năm ấy... ♡"
    },
    {
      id: 2,
      title: "Đèn phố đêm 🌙",
      desc: "Ánh đèn lung linh của thành phố lúc về đêm, nơi lưu giữ những câu chuyện thì thầm.",
      src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
      style: "vintage-gold",
      caption: "Cùng em qua phố đêm 🌙"
    },
    {
      id: 3,
      title: "Mặt hồ tĩnh lặng 🏔️",
      desc: "Bình yên là khi tâm mình dịu lại giữa thiên nhiên rộng lớn.",
      src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
      style: "sparkle-heart",
      caption: "Cảm giác bình yên 💖"
    },
    {
      id: 4,
      title: "Góc phố vintage 🎬",
      desc: "Từng bước chân trôi chậm như cuốn phim cũ chưa bao giờ phai màu.",
      src: "https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=600&q=80",
      style: "film-strip",
      caption: "Ký ức mờ ảo 🎬"
    },
    {
      id: 5,
      title: "Tách cà phê chiều ☕",
      desc: "Hương cà phê ấm nồng giữa những buổi chiều se lạnh.",
      src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
      style: "postcard",
      caption: "Chiều nhẹ nhàng ☕"
    },
    {
      id: 6,
      title: "Hoa anh đào bay 🌸",
      desc: "Một mùa hoa đẹp nhất là khi có ai đó cạnh bên.",
      src: "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=600&q=80",
      style: "polaroid",
      caption: "Mùa hoa kỷ niệm 🌸"
    },
    {
      id: 7,
      title: "Bầu trời sao đêm ✨",
      desc: "Mỗi ngôi sao là một nguyện ước dành tặng riêng bạn.",
      src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80",
      style: "sparkle-heart",
      caption: "Ước nguyện sao trời ✨"
    },
    {
      id: 8,
      title: "Mưa đêm lãng mạn 🌧️",
      desc: "Tiếng mưa rơi bên ngoài cửa sổ mang theo nỗi nhớ dịu êm.",
      src: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
      style: "film-strip",
      caption: "Mưa đêm bên cửa 🌧️"
    }
  ];

  const galleryGrid = document.getElementById('gallery-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const samplePhotoBtns = document.querySelectorAll('.sample-photo-btn');
  const styleBtns = document.querySelectorAll('.style-btn');
  const customFramePreview = document.getElementById('custom-frame-preview');
  const previewImg = document.getElementById('preview-img');
  const previewCaptionText = document.getElementById('preview-caption-text');
  const customCaptionInput = document.getElementById('custom-caption-input');
  const uploadPhotoInput = document.getElementById('upload-photo-input');
  const btnSaveFrame = document.getElementById('btn-save-frame');
  const btnShareFrame = document.getElementById('btn-share-frame');

  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxOkBtn = document.getElementById('lightbox-ok-btn');
  const lightboxDownloadBtn = document.getElementById('lightbox-download-btn');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxFrameContainer = document.getElementById('lightbox-frame-container');

  let currentSelectedStyle = 'polaroid';
  let currentActiveFilter = 'all';

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
        <div class="frame-caption">${item.caption}</div>
        <div class="frame-stamp">123 NGƯỜI</div>
      `;
    } else if (item.style === 'vintage-gold') {
      innerHTML = `
        <div class="frame-img-box">
          <img src="${item.src}" alt="${item.title}">
        </div>
        <div class="frame-caption">${item.caption}</div>
      `;
    } else if (item.style === 'sparkle-heart') {
      innerHTML = `
        <div class="frame-img-box">
          <img src="${item.src}" alt="${item.title}">
          <div class="sparkle-overlay"></div>
        </div>
        <div class="frame-caption">${item.caption}</div>
      `;
    } else if (item.style === 'film-strip') {
      innerHTML = `
        <div class="frame-img-box">
          <img src="${item.src}" alt="${item.title}">
        </div>
        <div class="frame-caption">${item.caption}</div>
      `;
    } else if (item.style === 'postcard') {
      innerHTML = `
        <div class="frame-img-box">
          <img src="${item.src}" alt="${item.title}">
        </div>
        <div class="frame-caption">${item.caption}</div>
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
      currentActiveFilter = btn.getAttribute('data-filter');
      renderGallery(currentActiveFilter);
    });
  });

  // Creator Work Space - Sample Photo Selection
  samplePhotoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      samplePhotoBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const src = btn.getAttribute('data-src');
      if (previewImg) previewImg.src = src;
    });
  });

  // Creator Work Space - Upload Custom Photo
  if (uploadPhotoInput) {
    uploadPhotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          if (previewImg) previewImg.src = evt.target.result;
          samplePhotoBtns.forEach(b => b.classList.remove('active'));
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Creator Work Space - Style Selector
  styleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      styleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSelectedStyle = btn.getAttribute('data-style');
      if (customFramePreview) {
        customFramePreview.className = `gallery-frame frame-style-${currentSelectedStyle}`;
      }
    });
  });

  // Creator Work Space - Live Caption Update
  if (customCaptionInput && previewCaptionText) {
    customCaptionInput.addEventListener('input', () => {
      previewCaptionText.textContent = customCaptionInput.value.trim() || 'Hoàng hôn năm ấy... ♡';
    });
  }

  // Save Custom Frame to Gallery
  if (btnSaveFrame) {
    btnSaveFrame.addEventListener('click', () => {
      const newFrame = {
        id: Date.now(),
        title: customCaptionInput ? customCaptionInput.value : "Khung ảnh mới",
        desc: "Khung ảnh cá nhân được bạn tạo với tình cảm dịu dàng. ♡",
        src: previewImg ? previewImg.src : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
        style: currentSelectedStyle,
        caption: customCaptionInput ? customCaptionInput.value : "Hoàng hôn năm ấy... ♡"
      };

      presetFrames.unshift(newFrame);
      renderGallery(currentActiveFilter);
      showModal('Khung Ảnh Đã Lưu ♡', 'Khung ảnh của bạn đã được thêm vào Bộ Sưu Tập Kỷ Niệm bên dưới! 💖');
    });
  }

  if (btnShareFrame) {
    btnShareFrame.addEventListener('click', () => {
      openSocialShareModal({
        name: customCaptionInput ? customCaptionInput.value : "Hoàng hôn năm ấy",
        age: 20,
        personality: "Kỷ niệm dịu dàng",
        quote: previewCaptionText ? previewCaptionText.textContent : "Hoàng hôn năm ấy... ♡"
      });
    });
  }

  // Lightbox Modal Handling
  let activeLightboxItem = null;

  function openLightboxModal(item) {
    if (!lightboxModal || !lightboxFrameContainer) return;
    activeLightboxItem = item;

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
      showModal('Tải Khung Ảnh 💾', 'Đã lưu khoảnh khắc dịu dàng này! Bạn có thể lưu ảnh hoặc chia sẻ cùng người thương. ♡');
      closeLightboxModal();
    });
  }

  // Render initial gallery grid
  renderGallery();

  // Initialize background animations and live clock
  initAmbientParticles();
  initLiveClock();

});

