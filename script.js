/* =========================
   DOM取得（存在チェック付き）
========================= */
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('section');
const skillBars = document.querySelectorAll('.skill-fill');
const contactForm = document.querySelector('.contact-form');
const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

/* =========================
   ユーティリティ
========================= */
// スロットリング
function throttle(func, limit) {
  let inThrottle;
  return function () {
    if (!inThrottle) {
      func.apply(this, arguments);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// 通知（a11y対応）
function showNotification(message, type = 'info') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const n = document.createElement('div');
  n.className = `notification notification-${type}`;
  n.textContent = message;
  n.setAttribute('role', 'status');
  n.setAttribute('aria-live', 'polite');
  n.style.cssText = `
    position: fixed; top: 100px; right: 20px; padding: 1rem 2rem;
    border-radius: 10px; color: #fff; font-weight: 600; z-index: 10000;
    transform: translateX(100%); transition: transform .3s ease;
    max-width: 300px; word-wrap: break-word;
  `;
  n.style.background =
    type === 'success'
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : type === 'error'
      ? '#e74c3c'
      : '#3498db';

  document.body.appendChild(n);
  // reduced motion配慮
  if (reduceMotion) {
    n.style.transform = 'translateX(0)';
  } else {
    requestAnimationFrame(() => (n.style.transform = 'translateX(0)'));
    setTimeout(() => {
      n.style.transform = 'translateX(100%)';
      setTimeout(() => n.remove(), 300);
    }, 5000);
  }
}

/* =========================
   ハンバーガー & ナビ（a11y同期）
========================= */
if (hamburger && navMenu) {
  if (!navMenu.id) navMenu.id = 'primary-nav';
  hamburger.setAttribute('role', 'button');
  hamburger.setAttribute('aria-controls', navMenu.id);
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('tabindex', '0');

  const toggleMenu = (open) => {
    const willOpen = open ?? !navMenu.classList.contains('active');
    hamburger.classList.toggle('active', willOpen);
    navMenu.classList.toggle('active', willOpen);
    hamburger.setAttribute('aria-expanded', String(willOpen));
  };

  hamburger.addEventListener('click', () => toggleMenu());
  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
    if (e.key === 'Escape') toggleMenu(false);
  });

  // メニュー内リンククリックで閉じる
  navMenu.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (a) toggleMenu(false);
  });
}

/* =========================
   スムーズスクロール（ヘッダー高さ考慮）
========================= */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    const headerHeight = header ? header.offsetHeight : 0;
    const y = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
});

/* =========================
   ヘッダーのスクロールスタイル
========================= */
function updateHeaderOnScroll() {
  if (!header) return;
  if (window.scrollY > 100) {
    header.style.background = 'rgba(255, 255, 255, 0.98)';
    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.background = 'rgba(255, 255, 255, 0.95)';
    header.style.boxShadow = 'none';
  }
}

/* =========================
   セクションのフェードイン（IntersectionObserver）
========================= */
(function setupSectionReveal() {
  if (!sections.length) return;

  const hero = document.querySelector('.hero');

  // 初期状態（reduced motionは即表示）
  sections.forEach((sec) => {
    if (reduceMotion) {
      sec.style.opacity = '1';
      sec.style.transform = 'none';
      sec.style.transition = 'none';
    } else {
      sec.style.opacity = '0';
      sec.style.transform = 'translateY(30px)';
      sec.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    }
  });

  if (reduceMotion) return; // ここで終了

  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.style.opacity = '1';
              e.target.style.transform = 'translateY(0)';
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
      )
    : null;

  sections.forEach((sec) => io && io.observe(sec));

  // ヒーローは即時表示
  if (hero) {
    hero.style.opacity = '1';
    hero.style.transform = 'translateY(0)';
    io?.unobserve(hero);
  }
})();

/* =========================
   スキルバー（初期幅退避→表示時に伸長）
========================= */
function initSkillBars() {
  skillBars.forEach((bar) => {
    const initial = (bar.style.width || '0%').trim();
    bar.dataset.targetWidth = initial.replace(';', '');
    bar.style.width = reduceMotion ? initial : '0%';
  });
}
function animateSkillBars() {
  if (reduceMotion) return; // すでに適用済み
  const vh = window.innerHeight;
  skillBars.forEach((bar) => {
    const top = bar.getBoundingClientRect().top;
    if (top < vh - 100) {
      const target = bar.dataset.targetWidth || '0%';
      bar.style.width = target;
    }
  });
}

/* =========================
   プロジェクトカード・ホバー（軽め）
========================= */
document.querySelectorAll('.project-card').forEach((card) => {
  if (reduceMotion) return;
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-10px) scale(1.02)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) scale(1)';
  });
});

/* =========================
   お問い合わせフォーム
========================= */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('input[name="name"]').value.trim();
    const email = contactForm.querySelector('input[name="email"]').value.trim();
    const message = contactForm.querySelector('textarea[name="message"]').value.trim();

    // ハニーポットがあれば検査
    const hp = contactForm.querySelector('input[name="hp_field"]');
    if (hp && hp.value) return; // bot

    if (!name || !email || !message) {
      showNotification('すべての項目を入力してください。', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showNotification('有効なメールアドレスを入力してください。', 'error');
      return;
    }

    const subject = 'お問い合わせ - 濱田慎一郎ポートフォリオサイト';
    const body = `お名前: ${name}\nメールアドレス: ${email}\n\nメッセージ:\n${message}`;
    const mailtoUrl = `mailto:hamada.shinichiro9351@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // 起動 + フォールバック
    const opened = window.open(mailtoUrl, '_blank');
    if (!opened) location.href = mailtoUrl;

    showNotification('メールクライアントが開きました。内容を確認して送信してください。', 'success');
    contactForm.reset();
  });
}

/* =========================
   タッチデバイス：スワイプ検知（現状ログのみ）
========================= */
let touchStartY = 0;
let touchEndY = 0;
document.addEventListener('touchstart', (e) => {
  touchStartY = e.changedTouches[0].screenY;
});
document.addEventListener('touchend', (e) => {
  touchEndY = e.changedTouches[0].screenY;
  const diff = touchStartY - touchEndY;
  if (Math.abs(diff) > 50) {
    // 上/下スワイプ（必要になったら実装）
  }
});

/* =========================
   モーダル（画像/動画）— .is-openで開閉
========================= */
const modalOverlay = document.getElementById('modal-overlay');
const modalImage = document.getElementById('modal-image');
const modalVideo = document.getElementById('modal-video');
const modalClose = document.querySelector('.modal-close');

let modalImages = [];
let currentModalIndex = 0;

function updateModalNavigation() {
  const prevButton = document.querySelector('.modal-prev');
  const nextButton = document.querySelector('.modal-next');
  if (!prevButton || !nextButton) return;

  if (modalImages.length <= 1) {
    prevButton.style.display = 'none';
    nextButton.style.display = 'none';
    return;
  }

  const src = modalImage?.src || '';
  if (src.includes('LP_project3_1.png')) {
    prevButton.style.display = 'none';
    nextButton.style.display = 'flex';
  } else if (src.includes('LP_project3_2.png')) {
    prevButton.style.display = 'flex';
    nextButton.style.display = 'none';
  } else {
    prevButton.style.display = 'flex';
    nextButton.style.display = 'flex';
  }
}

function openModal(src, alt, type, evt) {
  const ev = evt || window.event || null;
  let clickedImage = ev && ev.target ? ev.target : null;

  if (type === 'image') {
    const projectCard =
      clickedImage?.closest('.project-card') ||
      document.querySelector(`img[src="${src}"]`)?.closest('.project-card');

    const projectImages = projectCard
      ? projectCard.querySelectorAll('.project-screenshot, .gallery-image')
      : [];
    modalImages = Array.from(projectImages).map((img) => ({ src: img.src, alt: img.alt }));

    const projectTitle = projectCard?.querySelector('h3')?.textContent?.trim() || '';
    if (projectTitle === '議事録ワークフロー') {
      currentModalIndex = 0;
      modalImage.src = 'LP_project3_1.png';
      modalImage.alt = '議事録ワークフロー（入力画面）';
    } else {
      const idx = modalImages.findIndex((i) => i.src === src);
      currentModalIndex = Math.max(0, idx);
      modalImage.src = src;
      modalImage.alt = alt || '';
    }
    updateModalNavigation();
    modalImage.style.display = 'block';
    modalVideo.style.display = 'none';
  } else if (type === 'video') {
    modalImages = [];
    currentModalIndex = 0;
    updateModalNavigation();
    modalVideo.src = src;
    modalVideo.style.display = 'block';
    modalImage.style.display = 'none';
  }

  if (modalOverlay) {
    modalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('is-open');
  if (modalImage) modalImage.style.display = 'none';
  if (modalVideo) {
    modalVideo.style.display = 'none';
    if (modalVideo.src) {
      modalVideo.pause();
      modalVideo.currentTime = 0;
    }
  }
  document.body.style.overflow = '';
}

function navigateModal(direction) {
  if (modalImages.length <= 1) return;
  currentModalIndex = (currentModalIndex + direction + modalImages.length) % modalImages.length;
  const cur = modalImages[currentModalIndex];
  if (modalImage && cur) {
    modalImage.src = cur.src;
    modalImage.alt = cur.alt || '';
  }
  updateModalNavigation();
}

// 閉じる/外側クリック
modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// キー操作（メニュー/モーダル）
document.addEventListener('keydown', (e) => {
  // メニュー閉じ（Escape）
  if (e.key === 'Escape' && hamburger && navMenu && navMenu.classList.contains('active')) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  // モーダル操作
  if (modalOverlay && modalOverlay.classList.contains('is-open')) {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') navigateModal(-1);
    if (e.key === 'ArrowRight') navigateModal(1);
  }
});

/* =========================
   ギャラリー（複数カード対応）
========================= */
let currentGalleryIndex = 0;

// ドットにイベント（HTMLにonclickがあってもOK、ない場合も動く）
document.querySelectorAll('.project-gallery').forEach((gallery) => {
  const dots = gallery.querySelectorAll('.gallery-dot');
  const images = gallery.querySelectorAll('.gallery-image');

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => changeGalleryImage(idx, gallery));
  });

  // 自動再生（reduced motion時は無効 / 画像が2枚以上の時だけ）
  if (!reduceMotion && images.length > 1) {
    setInterval(() => {
      const activeIndex = [...images].findIndex((img) => img.classList.contains('active'));
      const next = activeIndex === -1 ? 0 : (activeIndex + 1) % images.length;
      changeGalleryImage(next, gallery);
    }, 3000);
  }
});

function changeGalleryImage(index, scopeEl = document) {
  const galleryContainer =
    scopeEl.querySelector('.gallery-container') || document.querySelector('.gallery-container');
  if (!galleryContainer) return;
  const images = galleryContainer.querySelectorAll('.gallery-image');
  const dots =
    galleryContainer.parentElement.querySelectorAll('.gallery-dot') ||
    document.querySelectorAll('.gallery-dot');

  images.forEach((img) => img.classList.remove('active'));
  dots.forEach((dot) => dot.classList.remove('active'));

  if (images[index]) images[index].classList.add('active');
  if (dots[index]) dots[index].classList.add('active');
  currentGalleryIndex = index;
}

/* =========================
   業務改善インパクト診断
========================= */
const impactForm = document.getElementById('impact-form');
const resultContainer = document.getElementById('simulator-result');

function animateSingleCounter(element) {
  const target = parseInt(element.dataset.target, 10);
  if (isNaN(target)) return;

  if (reduceMotion) {
    element.innerHTML = `${target} <span>時間/月</span>`;
    return;
  }

  let current = 0;
  const duration = 1500;
  const stepTime = 16;
  const totalSteps = duration / stepTime;
  let increment = target / totalSteps;
  if (target > 0 && increment < 1) increment = 1;

  const update = () => {
    current += increment;
    if (current < target) {
      element.innerHTML = `${Math.ceil(current)} <span>時間/月</span>`;
      requestAnimationFrame(update);
    } else {
      element.innerHTML = `${target} <span>時間/月</span>`;
    }
  };
  update();
}

function displayResult(hours) {
  if (!resultContainer) return;
  resultContainer.innerHTML = '';
  resultContainer.classList.remove('visible');

  const consultationButton = document.querySelector('.simulator-consultation');
  if (consultationButton) consultationButton.style.display = 'none';

  setTimeout(() => {
    const rounded = Math.round(hours);
    const html = `
      <p class="result-lead-text">あなたのチームでは...</p>
      <div class="result-time" data-target="${rounded}">0 <span>時間/月</span></div>
      <p class="result-sub-text">の「創造的な時間」が生まれる可能性があります。</p>
      <p class="result-note">※一般的なAI導入による業務削減率を80%と仮定した参考値です。<br>この時間を、新しい企画や顧客満足度の向上に活用しませんか？</p>
    `;
    resultContainer.innerHTML = html;
    resultContainer.classList.add('visible');

    const timeEl = resultContainer.querySelector('.result-time');
    animateSingleCounter(timeEl);
    timeEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });

    if (consultationButton) consultationButton.style.display = 'block';
  }, reduceMotion ? 0 : 100);
}

if (impactForm) {
  impactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const dailyMinutes = parseFloat(document.getElementById('daily-minutes')?.value);
    const teamSize = parseFloat(document.getElementById('team-size')?.value);
    if (isNaN(dailyMinutes) || isNaN(teamSize) || dailyMinutes <= 0 || teamSize <= 0) {
      showNotification('1以上の有効な数値を入力してください。', 'error');
      return;
    }
    const IMPROVEMENT_RATE = 0.8;
    const WORKING_DAYS_PER_MONTH = 20;
    const totalMonthlyMinutes = dailyMinutes * teamSize * WORKING_DAYS_PER_MONTH;
    const savedMonthlyHours = (totalMonthlyMinutes * IMPROVEMENT_RATE) / 60;
    displayResult(savedMonthlyHours);
  });
}

/* =========================
   スクロールイベント（単一：throttleで集約）
========================= */
const onScroll = throttle(() => {
  updateHeaderOnScroll();
  animateSkillBars();
}, 16);
window.addEventListener('scroll', onScroll);

/* =========================
   初期化
========================= */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '1';
  initSkillBars();
  // 初回状態反映
  updateHeaderOnScroll();
  animateSkillBars();
});
