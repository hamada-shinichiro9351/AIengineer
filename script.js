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
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
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
        
        if (barTop < windowHeight - 100) {
            bar.style.width = bar.style.width || '0%';
            const targetWidth = bar.getAttribute('style').match(/width:\s*(\d+)%/)[1];
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

// 初期化時にアニメーションを設定
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
    });
});

// スクロールイベントリスナー
window.addEventListener('scroll', () => {
    animateOnScroll();
    animateSkillBars();
});



// お問い合わせフォームの処理
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // フォームデータの取得
        const name = contactForm.querySelector('input[name="name"]').value;
        const email = contactForm.querySelector('input[name="email"]').value;
        const message = contactForm.querySelector('textarea[name="message"]').value;
        
        // 簡単なバリデーション
        if (!name || !email || !message) {
            showNotification('すべての項目を入力してください。', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('有効なメールアドレスを入力してください。', 'error');
            return;
        }
        
        // メールクライアントを開く
        const subject = 'お問い合わせ - 濱田慎一郎ポートフォリオサイト';
        const body = `お名前: ${name}\nメールアドレス: ${email}\n\nメッセージ:\n${message}`;
        const mailtoUrl = `mailto:hamada.shinichiro9351@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // メールクライアントを開く
        window.open(mailtoUrl, '_blank');
        
        // 成功メッセージを表示
        showNotification('メールクライアントが開きました。内容を確認して送信してください。', 'success');
        
        // フォームをリセット
        contactForm.reset();
    });
}

// メールアドレスのバリデーション
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 通知表示機能
function showNotification(message, type = 'info') {
    // 既存の通知を削除
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 新しい通知を作成
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // スタイルを適用
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // タイプに応じた背景色を設定
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else if (type === 'error') {
        notification.style.background = '#e74c3c';
    } else {
        notification.style.background = '#3498db';
    }
    
    // 通知を表示
    document.body.appendChild(notification);
    
    // アニメーション
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自動で削除
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// プロジェクトカードのホバーエフェクト
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// 統計数字のカウントアップアニメーション
function animateCounters() {
    const counters = document.querySelectorAll('.stat-item h3');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
            }
        };
        
        updateCounter();
    });
}

// 統計セクションが表示されたときにカウントアップを開始
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

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
window.addEventListener('scroll', throttle(() => {
    animateOnScroll();
    animateSkillBars();
}, 16)); // 約60fps

// ページ読み込み完了時の処理
window.addEventListener('load', () => {
    // ローディングアニメーション（必要に応じて）
    document.body.style.opacity = '1';
    
    // 初期アニメーション
    setTimeout(() => {
        animateOnScroll();
    }, 100);
});

// キーボードナビゲーション対応
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // モバイルメニューを閉じる
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// タッチデバイス対応
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // 上スワイプ
            console.log('上スワイプ');
        } else {
            // 下スワイプ
            console.log('下スワイプ');
        }
    }
}

// モーダル機能
const modalOverlay = document.getElementById('modal-overlay');
const modalImage = document.getElementById('modal-image');
const modalVideo = document.getElementById('modal-video');
const modalClose = document.querySelector('.modal-close');

// モーダルナビゲーション用の変数
let modalImages = [];
let currentModalIndex = 0;

// モーダルを開く関数
function openModal(src, alt, type) {
    if (type === 'image') {
        // 同じプロジェクト内の画像を収集
        const clickedImage = event.target;
        const projectCard = clickedImage.closest('.project-card');
        const projectImages = projectCard.querySelectorAll('.project-screenshot, .gallery-image');
        
        modalImages = Array.from(projectImages).map(img => ({
            src: img.src,
            alt: img.alt
        }));
        
        // プロジェクト3（議事録ワークフロー）の特別処理
        const projectTitle = projectCard.querySelector('h3').textContent;
        if (projectTitle === '議事録ワークフロー') {
            // プロジェクト3の場合、常にLP_project3_1.pngから開始
            currentModalIndex = 0;
            modalImage.src = 'LP_project3_1.png';
            modalImage.alt = '議事録ワークフロー（入力画面）';
        } else {
            // 他のプロジェクトは通常通り
            currentModalIndex = modalImages.findIndex(img => img.src === src);
            modalImage.src = src;
            modalImage.alt = alt;
        }
        
        // ナビゲーション矢印の表示/非表示を制御
        updateModalNavigation();
        
        modalImage.style.display = 'block';
        modalVideo.style.display = 'none';
    } else if (type === 'video') {
        modalImages = []; // 動画の場合はナビゲーションを無効化
        currentModalIndex = 0;
        updateModalNavigation();
        
        modalVideo.src = src;
        modalVideo.style.display = 'block';
        modalImage.style.display = 'none';
    }
    
    modalOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden'; // スクロールを無効化
}

// モーダルを閉じる関数
function closeModal() {
    modalOverlay.style.display = 'none';
    modalImage.style.display = 'none';
    modalVideo.style.display = 'none';
    document.body.style.overflow = ''; // スクロールを有効化
    
    // 動画を停止
    if (modalVideo.src) {
        modalVideo.pause();
        modalVideo.currentTime = 0;
    }
}

// モーダルを閉じるイベントリスナー
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

// キーボードナビゲーション
document.addEventListener('keydown', (e) => {
    if (modalOverlay.style.display === 'block') {
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            navigateModal(-1);
        } else if (e.key === 'ArrowRight') {
            navigateModal(1);
        }
    }
});

// モーダルナビゲーション関数
function navigateModal(direction) {
    if (modalImages.length <= 1) return;
    
    currentModalIndex = (currentModalIndex + direction + modalImages.length) % modalImages.length;
    
    const currentImage = modalImages[currentModalIndex];
    modalImage.src = currentImage.src;
    modalImage.alt = currentImage.alt;
    
    updateModalNavigation();
}

// ナビゲーション矢印の表示/非表示を制御
function updateModalNavigation() {
    const prevButton = document.querySelector('.modal-prev');
    const nextButton = document.querySelector('.modal-next');
    
    if (modalImages.length <= 1) {
        // 画像が1枚以下の場合は矢印を非表示
        if (prevButton) prevButton.style.display = 'none';
        if (nextButton) nextButton.style.display = 'none';
    } else {
        // プロジェクト3（議事録ワークフロー）の特別処理
        const currentImageSrc = modalImage.src;
        if (currentImageSrc.includes('LP_project3_1.png')) {
            // LP_project3_1.pngを表示している場合は右矢印のみ
            if (prevButton) prevButton.style.display = 'none';
            if (nextButton) nextButton.style.display = 'flex';
        } else if (currentImageSrc.includes('LP_project3_2.png')) {
            // LP_project3_2.pngを表示している場合は左矢印のみ
            if (prevButton) prevButton.style.display = 'flex';
            if (nextButton) nextButton.style.display = 'none';
        } else {
            // 他のプロジェクトは通常通り両方の矢印を表示
            if (prevButton) prevButton.style.display = 'flex';
            if (nextButton) nextButton.style.display = 'flex';
        }
    }
}

// ギャラリー画像切り替え機能
let currentGalleryIndex = 0;
let galleryInterval;

function changeGalleryImage(index) {
    const galleryContainer = document.querySelector('.gallery-container');
    const images = galleryContainer.querySelectorAll('.gallery-image');
    const dots = document.querySelectorAll('.gallery-dot');
    
    // すべての画像とドットからactiveクラスを削除
    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // 指定されたインデックスの画像とドットにactiveクラスを追加
    if (images[index]) {
        images[index].classList.add('active');
        currentGalleryIndex = index;
    }
    if (dots[index]) {
        dots[index].classList.add('active');
    }
}

// 自動ギャラリー切り替え
function startGalleryAutoPlay() {
    const galleryContainer = document.querySelector('.gallery-container');
    if (!galleryContainer) return;
    
    const images = galleryContainer.querySelectorAll('.gallery-image');
    if (images.length <= 1) return;
    
    galleryInterval = setInterval(() => {
        currentGalleryIndex = (currentGalleryIndex + 1) % images.length;
        changeGalleryImage(currentGalleryIndex);
    }, 3000); // 3秒ごとに切り替え
}

// ページ読み込み時にギャラリー自動再生を開始
document.addEventListener('DOMContentLoaded', () => {
    startGalleryAutoPlay();
}); 


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
    
    // 相談ボタンを非表示にする
    const consultationButton = document.querySelector('.simulator-consultation');
    if (consultationButton) {
        consultationButton.style.display = 'none';
    }
    
    // アニメーションのために少し待つ
    setTimeout(() => {
        const roundedHours = Math.round(hours);
        
        // 表示するHTMLを生成
        const resultHTML = `
            <p class="result-lead-text">あなたのチームでは...</p>
            <div class="result-time" data-target="${roundedHours}">0 <span>時間/月</span></div>
            <p class="result-sub-text">の「創造的な時間」が生まれる可能性があります。</p>
            <p class="result-note">※一般的なAI導入による業務削減率を80%と仮定した参考値です。<br>この時間を、新しい企画や顧客満足度の向上に活用しませんか？</p>
        `;
        
        resultContainer.innerHTML = resultHTML;
        resultContainer.classList.add('visible');

        // カウントアップアニメーションを実行
        const timeElement = resultContainer.querySelector('.result-time');
        animateSingleCounter(timeElement);

        // 結果までスムーズにスクロール
        timeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // 相談ボタンを表示する
        if (consultationButton) {
            consultationButton.style.display = 'block';
        }
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
