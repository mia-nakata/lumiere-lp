// =========================================
// 1. Swiper（スライダー）の設定
// =========================================
const swiper = new Swiper(".concept-swiper", {
  loop: true,
  speed: 10000,
  allowTouchMove: false,
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
    reverseDirection: true
  },
  slidesPerView: 2,
  spaceBetween: 15,
  breakpoints: {
    768: {
      slidesPerView: 2.5,
      spaceBetween: 20,
    },
  }
});


// =========================================
// 2. DOM読み込み完了後に実行する処理まとめ
// =========================================
document.addEventListener("DOMContentLoaded", function () {
  
  // -----------------------------------------
  // AOS（スクロールアニメーションライブラリ）の初期化
  // -----------------------------------------
  AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic'
  });

  // -----------------------------------------
  // 共通のスクロール検知（Intersection Observer）
  // -----------------------------------------
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-active");
        observer.unobserve(entry.target); 
      }
    });
  }, {
    rootMargin: "0px 0px -20% 0px"
  });

  // 監視対象の登録
  const targetList = document.querySelector(".trouble-list");
  if (targetList) observer.observe(targetList);

  const closingImgWrap = document.querySelector(".closing-img-wrapper");
  if (closingImgWrap) observer.observe(closingImgWrap);

  const featurePairs = document.querySelectorAll(".feature-pair");
  featurePairs.forEach(pair => observer.observe(pair));

  // -----------------------------------------
  // 「今日の私〜」の文字を1文字ずつ分割する処理
  // -----------------------------------------
  const pinkTitle = document.querySelector(".closing-title-pink");
  if (pinkTitle) {
    const text = pinkTitle.textContent;
    pinkTitle.textContent = "";
    text.split("").forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.transitionDelay = `${index * 0.08}s`;
      pinkTitle.appendChild(span);
    });
    observer.observe(pinkTitle);
  }

  // -----------------------------------------
  // ハンバーガーメニューの開閉処理（ズレ防止策追加）
  // -----------------------------------------
  const hamburgerBtn = document.getElementById('js-hamburger');
  const menuOverlay = document.getElementById('js-menu-overlay');
  const menuLinks = document.querySelectorAll('.sp-nav a');

  // ★ スクロールバーの幅を計算する関数
  const getScrollbarWidth = () => {
    return window.innerWidth - document.documentElement.clientWidth;
  };

  if (hamburgerBtn && menuOverlay) {
    hamburgerBtn.addEventListener('click', function () {
      // 現在開いているかどうかを判定
      const isOpening = !hamburgerBtn.classList.contains('is-open');

      if (isOpening) {
        // 【修正】開く時：スクロールバーの幅分だけ余白を足してズレを防ぐ
        const scrollbarWidth = getScrollbarWidth();
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        hamburgerBtn.style.marginRight = `${scrollbarWidth}px`;
      } else {
        // 【修正】閉じる時：追加した余白を元に戻す
        document.body.style.paddingRight = '';
        hamburgerBtn.style.marginRight = '';
      }

      hamburgerBtn.classList.toggle('is-open');
      menuOverlay.classList.toggle('is-open');
      document.body.classList.toggle('is-locked');
    });

    menuLinks.forEach(link => {
      link.addEventListener('click', function () {
        // メニュー内のリンクをクリックして閉じた時も余白を戻す
        document.body.style.paddingRight = '';
        hamburgerBtn.style.marginRight = '';

        hamburgerBtn.classList.remove('is-open');
        menuOverlay.classList.remove('is-open');
        document.body.classList.remove('is-locked');
      });
    });
  }

  // -----------------------------------------
  // スクロール連動イベント（ハンバーガー出現バグ修正版）
  // -----------------------------------------
  const fvWrapper = document.querySelector(".fv-wrapper");
  const fvContent = document.querySelector(".fv-content");
  let ticking = false; 

  const handleScroll = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    
    if (fvWrapper) {
      const windowHeight = window.innerHeight;
      const fadeOutRate = Math.max(1 - (scrollY / (windowHeight * 0.8)), 0);
      fvWrapper.style.opacity = fadeOutRate;
      
      if (fvContent) {
        fvContent.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    }

    if (hamburgerBtn) {
      const triggerHeight = window.innerHeight * 0.5;
      
      if (scrollY > triggerHeight) {
        hamburgerBtn.classList.add('is-visible');
      } else {
        hamburgerBtn.classList.remove('is-visible');
        if (hamburgerBtn.classList.contains('is-open')) {
          // 【修正】上に戻って強制的に閉じる時も余白をリセットする
          document.body.style.paddingRight = '';
          hamburgerBtn.style.marginRight = '';

          hamburgerBtn.classList.remove('is-open');
          document.getElementById('js-menu-overlay').classList.remove('is-open');
          document.body.classList.remove('is-locked');
        }
      }
    }
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  handleScroll();
});


// =========================================
// 3. 画像等すべて読み込み完了後に実行する処理
// =========================================
window.addEventListener('load', function() {
  
  const loader = document.querySelector('.loading-wrapper');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('is-completed');
    }, 4000);
  }

  const sections = document.querySelectorAll("section[id], main.fv");
  const navLinks = document.querySelectorAll(".side-nav a");

  if (sections.length > 0 && navLinks.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.classList.contains('fv') ? 'home' : entry.target.getAttribute("id");
          navLinks.forEach(link => link.classList.remove("is-current"));
          const currentLink = document.querySelector(`.side-nav a[href="#${currentId}"]`);
          if (currentLink) {
            currentLink.classList.add("is-current");
          }
        }
      });
    }, {
      rootMargin: "-40% 0px -60% 0px"
    });

    sections.forEach(section => {
      navObserver.observe(section);
    });
  }
});