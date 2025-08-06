// DOM要素の取得
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('section');
const skillBars = document.querySelectorAll('.skill-fill');
const contactForm = document.querySelector('.contact-form');

// ハンバーガーメニューの切り替え
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// ナビゲーションリンクのスムーズスクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // モバイルメニューを閉じる
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });
});

// スクロール時のヘッダー背景変更
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// スキルバーのアニメーション
const animateSkillBars = () => {
    skillBars.forEach(bar => {
        const barTop = bar.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (barTop < windowHeight - 100 && bar.style.width === '0%') {
             const targetWidth = bar.parentElement.parentElement.querySelector('.skill-fill').getAttribute('style').match(/width:\s*([\d.]+)%/)[1];
             bar.style.width = targetWidth + '%';
        }
    });
};

// スクロール時のアニメーション
const animateOnScroll = () => {
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight - 100) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
};

// ページ読み込み時の初期化処理
document.addEventListener('DOMContentLoaded', () => {
    // セクションの初期状態を設定
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // ヒーローセクションは即座に表示
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.opacity = '1';
        heroSection.style.transform = 'translateY(0)';
    }
    
    // スキルバーの初期状態を設定
    skillBars.forEach(bar => {
        bar.style.width = '0%';
        bar.style.transition = 'width 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
    });

    // ギャラリーの自動再生を開始
    startGalleryAutoPlay();

    // ページロード時に初回のアニメーションチェックを実行
    animateOnScroll();
    animateSkillBars();
});


// ===================================================================
// ★★★ 改善点：お問い合わせフォームの処理 ★★★
// ===================================================================
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => { // asyncを追加
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;

        // フォームデータの取得
        const name = contactForm.querySelector('input[name="name"]').value;
        const email = contactForm.querySelector('input[name="email"]').value;
        const message = contactForm.querySelector('textarea[name="message"]').value;
        
        // バリデーション
        if (!name || !email || !message) {
            showNotification('すべての項目を入力してください。', 'error');
            return;
        }
        if (!isValidEmail(email)) {
            showNotification('有効なメールアドレスを入力してください。', 'error');
            return;
        }

        // あなたのGASウェブアプリURL
        const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbwQaL0tPwkrJfCEbsblMfq3v8mHEBTTv_HNqsk2kcA15TMA-rKL3F3aULK43XpB1mNq0A/exec';

        // 送信中の表示に変更
        submitButton.disabled = true;
        submitButton.textContent = '送信中...';

        try {
            // fetch APIを使ってGASにデータを送信
            await fetch(GAS_API_URL, {
                method: 'POST',
                // mode: 'no-cors' はGAS側で適切にレスポンスを返せば不要になる場合があります。
                // 今回はGAS側でJSONを返すので、CORSを有効にするのが正式な方法ですが、
                // ひとまずこのまま進めます。
                // エラーが出る場合は 'no-cors' を有効にしてみてください。
                body: JSON.stringify({ name, email, message }),
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8', // GAS側でJSON.parseするため
                },
            });

            // 成功時の処理
            showNotification('お問い合わせありがとうございます。内容を確認の上、ご連絡いたします。', 'success');
            contactForm.reset();

        } catch (error) {
            // エラー時の処理
            console.error('送信に失敗しました:', error);
            showNotification('送信に失敗しました。時間をおいて再度お試しください。', 'error');
        } finally {
            // ボタンの表示を元に戻す
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// メールアドレスのバリデーション関数
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
// ===================================================================


// 通知表示機能
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        background: ${type === 'success' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e74c3c'};
        font-weight: 600;
        z-index: 10000;
        transform: translateX(120%);
        transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
        max-width: 300px;
        word-wrap: break-word;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        notification.addEventListener('transitionend', () => notification.remove());
    }, 5000);
}

// 統計数字のカウントアップアニメーション
function animateCounters() {
    const counters = document.querySelectorAll('.stat-item h3');
    
    counters.forEach(counter => {
        // すでにアニメーションが実行されたかチェック
        if (counter.dataset.animated) return;

        counter.dataset.animated = true; // アニメーション実行済みの印を付ける
        const targetText = counter.textContent;
        const target = parseInt(targetText, 10);
        const suffix = targetText.includes('+') ? '+' : '';
        
        let current = 0;
        const duration = 2000; // 2秒
        const stepTime = 16; // 約60fps
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        };
        
        updateCounter();
    });
}

// IntersectionObserverで要素が表示されたらアニメーションを実行
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('about')) {
                animateCounters();
            }
            // 一度表示されたら監視を停止
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutSection = document.querySelector('.about');
if (aboutSection) {
    observer.observe(aboutSection);
}


// パフォーマンス最適化のためのスロットリング
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// スクロールイベントをスロットリング
const throttledScrollHandler = throttle(() => {
    animateOnScroll();
    animateSkillBars();
}, 100); // 100msに1回実行
window.addEventListener('scroll', throttledScrollHandler);


// キーボードナビゲーション対応
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // モーダルが開いていれば閉じる
        if (modalOverlay.style.display === 'block') {
            closeModal();
        }
        // ハンバーガーメニューが開いていれば閉じる
        if (hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});


// モーダル機能
const modalOverlay = document.getElementById('modal-overlay');
const modalImage = document.getElementById('modal-image');
const modalVideo = document.getElementById('modal-video');
const modalClose = document.querySelector('.modal-close');

let modalMediaItems = [];
let currentModalIndex = 0;

function openModal(src, alt, type, element) {
    const projectCard = element.closest('.project-card');

    if (type === 'image') {
        const projectImages = projectCard.querySelectorAll('.project-screenshot, .gallery-image');
        modalMediaItems = Array.from(projectImages).map(img => ({ src: img.src, alt: img.alt, type: 'image' }));
        currentModalIndex = modalMediaItems.findIndex(item => item.src === src);

        modalImage.src = src;
        modalImage.alt = alt;
        modalImage.style.display = 'block';
        modalVideo.style.display = 'none';

    } else if (type === 'video') {
        const projectVideo = projectCard.querySelector('.project-video-file');
        modalMediaItems = [{ src: projectVideo.src, alt: 'デモ動画', type: 'video' }];
        currentModalIndex = 0;

        modalVideo.src = projectVideo.src;
        modalVideo.style.display = 'block';
        modalImage.style.display = 'none';
        modalVideo.play();
    }
    
    modalOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    updateModalNavigation();
}

function closeModal() {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
    modalVideo.pause();
    modalVideo.currentTime = 0;
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', (e) => e.target === modalOverlay && closeModal());

document.addEventListener('keydown', (e) => {
    if (modalOverlay.style.display !== 'block') return;
    if (e.key === 'ArrowLeft') navigateModal(-1);
    if (e.key === 'ArrowRight') navigateModal(1);
});

function navigateModal(direction) {
    if (modalMediaItems.length <= 1) return;
    
    currentModalIndex = (currentModalIndex + direction + modalMediaItems.length) % modalMediaItems.length;
    
    const currentItem = modalMediaItems[currentModalIndex];
    
    if(currentItem.type === 'image') {
        modalImage.src = currentItem.src;
        modalImage.alt = currentItem.alt;
        modalImage.style.display = 'block';
        modalVideo.style.display = 'none';
        modalVideo.pause();
    } else {
        // 現状は画像のみのギャラリーを想定
    }
}

function updateModalNavigation() {
    const prevButton = document.querySelector('.modal-prev');
    const nextButton = document.querySelector('.modal-next');
    const display = modalMediaItems.length > 1 ? 'flex' : 'none';
    if(prevButton) prevButton.style.display = display;
    if(nextButton) nextButton.style.display = display;
}

// クリックイベントの委譲
document.body.addEventListener('click', function(e) {
    const screenshot = e.target.closest('.project-screenshot, .gallery-image');
    if (screenshot) {
        openModal(screenshot.src, screenshot.alt, 'image', screenshot);
        return;
    }

    const videoElement = e.target.closest('.project-video-file');
    if (videoElement) {
        openModal(videoElement.src, videoElement.getAttribute('alt'), 'video', videoElement);
        return;
    }

    // デモ動画を見るリンク
    if (e.target.closest('.demo-link') && e.target.closest('.project-card').querySelector('video')) {
         e.preventDefault();
         const card = e.target.closest('.project-card');
         const videoToPlay = card.querySelector('.project-video-file');
         openModal(videoToPlay.src, videoToPlay.getAttribute('alt'), 'video', videoToPlay);
         return;
    }
});


// ギャラリー画像切り替え機能
let galleryInterval;

function changeGalleryImage(gallery, index) {
    const images = gallery.querySelectorAll('.gallery-image');
    const dots = gallery.parentElement.querySelectorAll('.gallery-dot');
    
    const currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
    
    images[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    
    const nextIndex = (currentIndex + 1) % images.length;
    
    images[nextIndex].classList.add('active');
    dots[nextIndex].classList.add('active');
}

function startGalleryAutoPlay() {
    const galleries = document.querySelectorAll('.gallery-container');
    galleries.forEach(gallery => {
        const images = gallery.querySelectorAll('.gallery-image');
        if (images.length > 1) {
            setInterval(() => changeGalleryImage(gallery), 3000);
        }
    });
}

// =======================================================
// ★★★ 新機能：業務改善インパクト診断ロジック ★★★
// =======================================================
const impactForm = document.getElementById('impact-form');
const resultContainer = document.getElementById('simulator-result');

if (impactForm) {
    impactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 入力値の取得
        const dailyMinutesInput = document.getElementById('daily-minutes');
        const teamSizeInput = document.getElementById('team-size');

        const dailyMinutes = parseFloat(dailyMinutesInput.value);
        const teamSize = parseFloat(teamSizeInput.value);

        // バリデーション
        if (isNaN(dailyMinutes) || isNaN(teamSize) || dailyMinutes <= 0 || teamSize <= 0) {
            showNotification('1以上の有効な数値を入力してください。', 'error');
            return;
        }

        // --- ここが計算のロジック ---
        const IMPROVEMENT_RATE = 0.8; // AI導入による削減率を80%と仮定（この数字は調整可能）
        const WORKING_DAYS_PER_MONTH = 20; // 月の営業日数を20日と仮定

        // 1. チーム全体の月間総業務時間（分単位）
        const totalMonthlyMinutes = dailyMinutes * teamSize * WORKING_DAYS_PER_MONTH;
        
        // 2. 削減できる月間時間（時間単位）
        const savedMonthlyHours = (totalMonthlyMinutes * IMPROVEMENT_RATE) / 60;
        
        // 結果を表示
        displayResult(savedMonthlyHours);
    });
}

function displayResult(hours) {
    // 結果表示エリアをクリアして非表示にリセット
    resultContainer.innerHTML = '';
    resultContainer.classList.remove('visible');
    
    // アニメーションのために少し待つ
    setTimeout(() => {
        const roundedHours = Math.round(hours);
        
        // 表示するHTMLを生成
        const resultHTML = `
            <p class="result-lead-text">あなたのチームでは...</p>
            <div class="result-time" data-target="${roundedHours}">0 <span>時間/月</span></div>
            <p class="result-sub-text">の「創造的な時間」が生まれる可能性があります。</p>
            <p class="result-note">※一般的なAI導入による業務削減率を80%と仮定した参考値です。<br>この時間を、新しい企画や顧客満足度の向上に活用しませんか？</p>
            <a href="#contact" class="btn btn-secondary">具体的な方法を相談する</a>
        `;
        
        resultContainer.innerHTML = resultHTML;
        resultContainer.classList.add('visible');

        // カウントアップアニメーションを実行
        const timeElement = resultContainer.querySelector('.result-time');
        animateSingleCounter(timeElement);

        // 結果までスムーズにスクロール
        timeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100); // 100ミリ秒待つ
}

// 診断ツール用の単一カウンターアニメーション関数
function animateSingleCounter(element) {
    const target = parseInt(element.dataset.target, 10);
    if (isNaN(target)) return;

    let current = 0;
    const duration = 1500; // 1.5秒
    const stepTime = 16;
    const totalSteps = duration / stepTime;
    let increment = target / totalSteps;

    // ターゲットが小さい場合、incrementが1未満にならないように調整
    if (target > 0 && increment < 1) {
        increment = 1;
    }

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.innerHTML = `${Math.ceil(current)} <span>時間/月</span>`;
            requestAnimationFrame(updateCounter);
        } else {
            element.innerHTML = `${target} <span>時間/月</span>`;
        }
    };
    
    updateCounter();
}
