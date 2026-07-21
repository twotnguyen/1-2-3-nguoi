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

    const moteCount = 25;
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
    { title: "Chỉ iu mình ems", artist: "Unknown", src: "music/chiiuminhems.mp3", cover: "music/logo_chiiuminhems.png" },
    { title: "Sao anh tồi thế", artist: "Unknown", src: "music/saoanhtoithe.mp3", cover: "music/logo_saoanhtoithe.png" }
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

  if (bgAudio) {
    bgAudio.addEventListener('ended', playNextTrack);
    // Initialize first track without playing
    loadTrack(currentTrackIndex);
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

  // Auto-play attempt on user first interaction anywhere
  document.body.addEventListener('click', () => {
    if (!isPlaying && bgAudio) {
      bgAudio.play().then(() => {
        isPlaying = true;
        if (playerPlayBtn) playerPlayBtn.textContent = '⏸';
        if (albumCover) albumCover.classList.add('playing');
        if (volumeIconOn) volumeIconOn.classList.remove('hidden');
        if (volumeIconOff) volumeIconOff.classList.add('hidden');
      }).catch(() => {});
    }
  }, { once: true });

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

  const btnQuizPrev = document.getElementById('btn-quiz-prev');
  const btnQuizNext = document.getElementById('btn-quiz-next');
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
              switchTab('result');
            }
          }, 350);
        });

        optionsContainer.appendChild(btn);
      });
    }

    if (btnQuizPrev) btnQuizPrev.style.opacity = index === 0 ? '0.5' : '1';
  }

  if (btnQuizPrev) {
    btnQuizPrev.addEventListener('click', () => {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion(currentQuestionIndex);
      }
    });
  }

  if (btnQuizNext) {
    btnQuizNext.addEventListener('click', () => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        renderQuestion(currentQuestionIndex);
      } else {
        switchTab('result');
      }
    });
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
  // 7. RESULT VIEW & MODAL ENGINE
  // ------------------------------------------------------------------------
  const modal = document.getElementById('action-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalOkBtn = document.getElementById('modal-ok-btn');

  const btnResultPrev = document.getElementById('btn-result-prev');
  const btnResultFinish = document.getElementById('btn-result-finish');

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

  document.querySelectorAll('.btn-choose-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      let msg = '';
      if (action === 'Thư tay bí mật') {
        msg = 'Bắt đầu viết một bức thư chân thành. Hãy để cảm xúc dẫn lối và chia sẻ kỷ niệm đáng nhớ nhất của hai bạn!';
      } else if (action === 'Playlist dành riêng') {
        msg = 'Hãy chọn ra 5 bài hát thể hiện đúng nhất cảm xúc của bạn lúc này để gửi tới người ấy nhé!';
      } else if (action === 'Rủ đi ngắm hoàng hôn') {
        msg = 'Một lời mời nhẹ nhàng vào một chiều thứ Bảy hoàng hôn đẹp trời sẽ là món quà tuyệt vời nhất!';
      }
      showModal(action, msg);
    });
  });

  if (btnResultPrev) {
    btnResultPrev.addEventListener('click', () => {
      switchTab('quiz');
    });
  }

  if (btnResultFinish) {
    btnResultFinish.addEventListener('click', () => {
      showModal('Kết Quả Matching #07 ♡', 'Chúc mừng bạn đã hoàn thành hành trình 123 Người. Hãy luôn tin vào tình yêu và sự chân thành nhé!');
    });
  }

  // Initialize background animations and live clock
  initAmbientParticles();
  initLiveClock();

});

