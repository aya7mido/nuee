(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pad2 = (n) => String(n).padStart(2, "0");

    const loadingScreen = document.querySelector(".loading-screen");
    const hero = document.querySelector(".hero");
    const heroVideo = document.querySelector(".hero-image video");

    /* =========================
       HERO VIDEO（動きを減らす設定のときは止める）
    ========================= */

    if (reduceMotion && heroVideo) {
        heroVideo.removeAttribute("autoplay");
        heroVideo.pause();
    }


    /* =========================
       LOADING
       ・最低 1.5 秒は見せる
       ・フォントとヒーローのポスター画像が読めたら開く（最大 5 秒で必ず開く）
       ・同じタブの 2 回目以降は表示しない
    ========================= */

    const MIN_WAIT = 1500;
    const MAX_WAIT = 5000;

    const showSite = () => {
        loadingScreen.classList.add("is-hidden");
        hero.classList.add("is-visible");
        try {
            sessionStorage.setItem("nuee-seen", "1");
        } catch (e) { }
    };

    if (root.classList.contains("is-seen")) {
        hero.classList.add("is-visible");
    } else {
        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const posterReady = new Promise((resolve) => {
            if (!heroVideo || !heroVideo.poster) return resolve();
            const img = new Image();
            img.onload = img.onerror = resolve;
            img.src = heroVideo.poster;
        });

        // window の load 後（＝フォントの読み込みが始まった後）に fonts.ready を待つ
        const fontsReady = new Promise((resolve) => {
            const afterLoad = () => (document.fonts ? document.fonts.ready : Promise.resolve()).then(resolve, resolve);
            if (document.readyState === "complete") afterLoad();
            else window.addEventListener("load", afterLoad, { once: true });
        });

        Promise.race([
            Promise.all([posterReady, fontsReady, wait(MIN_WAIT)]),
            wait(MAX_WAIT)
        ]).then(showSite);
    }


    /* =========================
       REVEAL（一度だけ表示）
    ========================= */

    const revealTargets = document.querySelectorAll(
        ".brand-statement, .collection-item, .statement, .objects, .about, .cta"
    );

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, {
        rootMargin: "0px 0px -8% 0px"
    });

    revealTargets.forEach((target) => revealObserver.observe(target));


    /* =========================
       SCROLL（ヘッダー・インジケーター・セクション番号）
       scroll イベントは 1 つにまとめ、requestAnimationFrame で間引く
    ========================= */

    const header = document.querySelector(".header");
    const indicator = document.querySelector(".scroll-indicator");
    const scrollLine = document.querySelector(".scroll-line");
    const scrollDot = document.querySelector(".scroll-dot");
    const numberTop = document.querySelector(".scroll-number-top");
    const numberBottom = document.querySelector(".scroll-number-bottom");
    const objectsSection = document.querySelector(".objects");
    const sections = document.querySelectorAll("main > section");

    numberBottom.textContent = pad2(sections.length);

    let lineTravel = 0;
    const measure = () => {
        lineTravel = scrollLine.clientHeight - scrollDot.offsetHeight;
    };

    let lastY = window.scrollY;
    let lastSection = 0;
    let lastLight = null;
    let ticking = false;

    const update = () => {
        ticking = false;

        const y = window.scrollY;
        const vh = window.innerHeight;
        const center = vh / 2;

        // ヘッダー：下へスクロールで隠し、上へスクロールで出す
        const delta = y - lastY;
        if (y <= header.offsetHeight) {
            header.classList.remove("is-hidden");
            lastY = y;
        } else if (Math.abs(delta) > 6) {
            header.classList.toggle("is-hidden", delta > 0);
            lastY = y;
        }

        // 進捗ドット
        const maxScroll = root.scrollHeight - vh;
        const progress = maxScroll > 0 ? Math.min(Math.max(y / maxScroll, 0), 1) : 0;
        scrollDot.style.transform = `translateX(-50%) translateY(${progress * lineTravel}px)`;

        // OBJECTS（暗い背景）の上では明るい色に
        const objectsRect = objectsSection.getBoundingClientRect();
        const light = objectsRect.top <= center && objectsRect.bottom >= center;
        if (light !== lastLight) {
            indicator.classList.toggle("is-light", light);
            lastLight = light;
        }

        // 現在のセクション番号
        let current = 1;
        sections.forEach((section, index) => {
            if (section.getBoundingClientRect().top <= center) {
                current = index + 1;
            }
        });
        if (current !== lastSection) {
            numberTop.textContent = pad2(current);
            lastSection = current;
        }
    };

    const requestUpdate = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", () => {
        measure();
        requestUpdate();
    });

    measure();
    update();
})();
