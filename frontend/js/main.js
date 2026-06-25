const COMPONENT_CACHE_VERSION = 12;
const COMPONENT_CACHE_PREFIX = "cmp";

function loadComponent(targetId, url, retryCount = 0) {
    const cacheKey = `${COMPONENT_CACHE_PREFIX}_${url}_v${COMPONENT_CACHE_VERSION}`;
    const cachedMarkup = localStorage.getItem(cacheKey);
    const target = document.getElementById(targetId);

    if (cachedMarkup) {
        if (target) target.innerHTML = cachedMarkup;
        return Promise.resolve(cachedMarkup);
    }

    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch component: ${response.statusText}`);
            }
            return response.text();
        })
        .then((markup) => {
            if (target) target.innerHTML = markup;

            try {
                localStorage.setItem(cacheKey, markup);
            } catch (_) {
                // Component caching is optional; private browsing can reject localStorage.
            }

            return markup;
        })
        .catch((error) => {
            if (retryCount < 1) {
                return new Promise((resolve) => {
                    setTimeout(() => resolve(loadComponent(targetId, url, retryCount + 1)), 1000);
                });
            }

            console.error(`Error loading component [${targetId}] from ${url}:`, error);

            if (target) {
                target.innerHTML = `
                    <div style="padding:1rem;text-align:center;color:#999">
                        Failed to load section.
                        <button onclick="loadComponent('${targetId}','${url}')" style="background:none;border:1px solid #ccc;padding:4px 12px;border-radius:4px;cursor:pointer;color:#666">
                            Retry
                        </button>
                    </div>
                `;
            }
        });
}

window.loadComponent = loadComponent;

document.documentElement.classList.add("js-enabled");

document.addEventListener("DOMContentLoaded", () => {
    initLandingPageCarousel();
    initSponsorsCarousel();
    initSponsorSpotlight();
    initDesktopParallax();
    initScrollReveal();
    initSpotlightCards();
    initLazyBackgrounds();
    requestAnimationFrame(() => window.scrollTo(0, 0));
});

function initLandingPageCarousel() {
    const carousel = document.querySelector(".events-carousel");
    if (!carousel) return;

    const slides = [...carousel.querySelectorAll(".event-slide")];
    const track = carousel.querySelector(".events-carousel-track");
    const leftArrow = carousel.querySelector(".carousel-nav-left");
    const rightArrow = carousel.querySelector(".carousel-nav-right");
    const indicatorsRoot = carousel.querySelector(".carousel-indicators");
    const progressCount = document.querySelector(".events-carousel-count");
    if (!slides.length || !leftArrow || !rightArrow || !track) return;

    if (indicatorsRoot) {
        indicatorsRoot.innerHTML = slides.map((_, index) => `
            <button class="carousel-indicator" data-index="${index}" aria-label="Go to event ${index + 1}"></button>
        `).join("");
    }
    const dots = indicatorsRoot ? [...indicatorsRoot.querySelectorAll(".carousel-indicator")] : [];

    let current = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    function goToSlide(index) {
        if (index < 0 || index >= slides.length) return;

        current = index;
        const viewportWidth = carousel.offsetWidth;
        const sampleSlide = slides[0];
        const slideWidth = sampleSlide.offsetWidth || viewportWidth * 0.84;
        const gap = Number.parseFloat(window.getComputedStyle(track).gap || "0");
        const step = slideWidth + gap;
        const translateX = ((viewportWidth - slideWidth) / 2) - (current * step);
        track.style.transform = `translateX(${translateX}px)`;

        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle("is-active", slideIndex === current);
        });

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("active", dotIndex === current);
        });

        if (progressCount) {
            progressCount.textContent = `${String(current + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
        }

        leftArrow.classList.toggle("hidden", current === 0);
        rightArrow.classList.toggle("hidden", current === slides.length - 1);
    }

    leftArrow.addEventListener("click", () => goToSlide(current - 1));
    rightArrow.addEventListener("click", () => goToSlide(current + 1));

    carousel.addEventListener("touchstart", (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }, { passive: true });

    carousel.addEventListener("touchend", (event) => {
        const deltaY = Math.abs(touchStartY - event.changedTouches[0].clientY);
        const swipeDistance = touchStartX - event.changedTouches[0].clientX;
        if (deltaY > Math.abs(swipeDistance) || Math.abs(swipeDistance) <= 40) return;

        goToSlide(current + (swipeDistance > 0 ? 1 : -1));
    }, { passive: true });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => goToSlide(index));
    });

    window.addEventListener("resize", () => goToSlide(current));
    goToSlide(0);
}

function initSponsorsCarousel() {
    const mobileContainer = document.querySelector(".partners-mobile-carousel");
    const desktopContainer = document.querySelector(".sponsorship-section .partners-container");
    if (!mobileContainer || !desktopContainer) return;

    let originals = [];
    let viewport = null;
    let track = null;
    let touchResumeTimer = null;
    let currentPartnerIndex = 0;
    let partnerTouchStartX = 0;
    let partnerTouchStartY = 0;
    let partnerCards = [];

    function getNameClass(name) {
        if (name.length > 48) return "partner-card-name partner-card-name--xlong";
        if (name.length > 32) return "partner-card-name partner-card-name--long";
        return "partner-card-name";
    }

    function getTypeClass(type) {
        return type.length > 28
            ? "partner-card-type partner-card-type--long"
            : "partner-card-type";
    }

    function renderPartnerCard(partner, index) {
        const name = partner.dataset.partnerName || "";
        const type = partner.dataset.partnerType || "";
        const desc = partner.dataset.partnerDescription || "";
        const logo = partner.dataset.partnerLogo || "";
        const alt = partner.dataset.partnerAlt || name;
        const nameClass = getNameClass(name);
        const typeClass = getTypeClass(type);

        return `
            <article class="partner-carousel-card" data-index="${index}">
                <div class="partner-card-logo-frame">
                    <img src="${logo}" alt="${alt}" loading="lazy">
                </div>
                <div class="partner-card-copy">
                    <p class="partner-card-label">Spotlight relic</p>
                    <h3 class="${nameClass}">${name}</h3>
                    <p class="${typeClass}">${type}</p>
                    <div class="partner-card-desc">${desc}</div>
                </div>
            </article>
        `;
    }

    function setPaused(paused) {
        if (!viewport) return;
        viewport.classList.toggle("is-paused", paused);
    }

    function scheduleResume(delay = 1200) {
        clearTimeout(touchResumeTimer);
        touchResumeTimer = setTimeout(() => setPaused(false), delay);
    }

    function measureMarquee() {
        if (!track) return;
        const sets = track.querySelectorAll(".partners-marquee-set");
        if (!sets.length) return;

        // Keep styles clean and let CSS determine the layout widths naturally
        track.style.width = "";
        sets.forEach(set => set.style.width = "");

        const setWidth = sets[0].scrollWidth;
        const duration = Math.max(28, originals.length * 6);

        // Set CSS variables for the animation (kept for tests and fallback)
        track.style.setProperty("--marquee-set-width", `${setWidth}px`);
        track.style.setProperty("--marquee-duration", `${duration}s`);

        if (typeof goToPartnerSlide === "function") {
            goToPartnerSlide(currentPartnerIndex);
        }
    }

    function initPartnersSwipeCarousel() {
        partnerCards = [...track.querySelectorAll(".partner-carousel-card")];
        currentPartnerIndex = 0;

        viewport.addEventListener("touchstart", (event) => {
            clearTimeout(touchResumeTimer);
            setPaused(true);
            partnerTouchStartX = event.touches[0].clientX;
            partnerTouchStartY = event.touches[0].clientY;
        }, { passive: true });

        viewport.addEventListener("touchend", (event) => {
            scheduleResume();
            const deltaY = Math.abs(partnerTouchStartY - event.changedTouches[0].clientY);
            const swipeDistance = partnerTouchStartX - event.changedTouches[0].clientX;
            if (deltaY > Math.abs(swipeDistance) || Math.abs(swipeDistance) <= 30) return;

            goToPartnerSlide(currentPartnerIndex + (swipeDistance > 0 ? 1 : -1));
        }, { passive: true });

        viewport.addEventListener("touchcancel", () => {
            scheduleResume(600);
        }, { passive: true });

        goToPartnerSlide(0);
    }

    function goToPartnerSlide(index) {
        if (!track || !partnerCards.length) return;
        if (index < 0 || index >= partnerCards.length) return;

        currentPartnerIndex = index;

        const viewportWidth = viewport.offsetWidth;
        const cardWidth = partnerCards[0].offsetWidth || 248;
        const trackWidth = cardWidth * partnerCards.length;

        let translateX = ((viewportWidth - cardWidth) / 2) - (currentPartnerIndex * cardWidth);

        // Clamp translateX to prevent scrolling beyond Card 1 and Card 9
        const minTranslateX = 18; // left padding
        const maxTranslateX = viewportWidth - trackWidth - 18; // right padding

        if (trackWidth <= viewportWidth - 36) {
            translateX = minTranslateX;
        } else {
            if (translateX > minTranslateX) {
                translateX = minTranslateX;
            } else if (translateX < maxTranslateX) {
                translateX = maxTranslateX;
            }
        }

        track.style.transform = `translateX(${translateX}px)`;

        // Update active class on cards
        partnerCards.forEach((card, i) => {
            card.classList.toggle("is-active", i === currentPartnerIndex);
        });
    }

    function buildMarquee() {
        destroyCarousel();
        if (window.innerWidth > 768) return;

        desktopContainer.style.display = "none";
        originals = [...desktopContainer.children].filter((child) => child.classList.contains("partner-item"));
        if (!originals.length) return;

        const cardMarkup = originals.map((partner, index) => renderPartnerCard(partner, index)).join("");
        const duplicateMarkup = `
                            <div class="partners-marquee-set">
                                ${cardMarkup}
                            </div>
                        `;

        mobileContainer.innerHTML = `
            <div class="partners-marquee-container">
                <div class="partners-carousel-fireflies">
                    <span class="partners-firefly" style="--ff-x: 30px; --ff-y: -40px; --ff-x2: 60px; --ff-y2: -80px; left: 15%; top: 60%; animation-delay: 0s;"></span>
                    <span class="partners-firefly" style="--ff-x: -40px; --ff-y: -70px; --ff-x2: -80px; --ff-y2: -130px; left: 80%; top: 40%; animation-delay: 1.5s;"></span>
                    <span class="partners-firefly" style="--ff-x: 50px; --ff-y: -50px; --ff-x2: 90px; --ff-y2: -110px; left: 35%; top: 75%; animation-delay: 3s;"></span>
                    <span class="partners-firefly" style="--ff-x: -30px; --ff-y: -60px; --ff-x2: -50px; --ff-y2: -100px; left: 60%; top: 80%; animation-delay: 4.5s;"></span>
                    <span class="partners-firefly" style="--ff-x: 20px; --ff-y: -80px; --ff-x2: 40px; --ff-y2: -150px; left: 10%; top: 30%; animation-delay: 6s;"></span>
                </div>
                <div class="partners-marquee-wrapper">
                    <div class="partners-marquee-viewport" tabindex="0" aria-label="Partner showcase marquee">
                        <div class="partners-marquee-track">
                            ${duplicateMarkup}
                        </div>
                    </div>
                </div>
            </div>
        `;

        viewport = mobileContainer.querySelector(".partners-marquee-viewport");
        track = mobileContainer.querySelector(".partners-marquee-track");
        if (!viewport || !track) return;

        measureMarquee();
        initPartnersSwipeCarousel();

        viewport.addEventListener("mouseenter", () => setPaused(true));
        viewport.addEventListener("mouseleave", () => setPaused(false));
        viewport.addEventListener("focusin", () => setPaused(true));
        viewport.addEventListener("focusout", () => setPaused(false));
    }

    function destroyCarousel() {
        clearTimeout(touchResumeTimer);
        mobileContainer.innerHTML = "";
        originals = [];
        viewport = null;
        track = null;
        partnerCards = [];
        currentPartnerIndex = 0;
        desktopContainer.style.display = "";
    }

    let resizeTimer;
    buildMarquee();

    if (document.readyState === "complete") {
        measureMarquee();
    } else {
        window.addEventListener("load", () => {
            if (window.innerWidth <= 768) {
                measureMarquee();
            }
        });
    }

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth <= 768) {
                buildMarquee();
            } else {
                destroyCarousel();
            }
        }, 200);
    });
}

function initSponsorSpotlight() {
    const section = document.querySelector(".sponsorship-section");
    if (!section) return;

    const spotlight = section.querySelector(".sponsor-spotlight");
    const items = [...section.querySelectorAll(".partners-container > .partner-item")];
    if (!spotlight || !items.length) return;

    const name = spotlight.querySelector(".sponsor-spotlight-name");
    const type = spotlight.querySelector(".sponsor-spotlight-type");
    const description = spotlight.querySelector(".sponsor-spotlight-description");
    const logo = spotlight.querySelector(".sponsor-spotlight-logo img");
    if (!name || !type || !description || !logo) return;

    function applySpotlight(item) {
        items.forEach((entry) => entry.classList.toggle("is-active", entry === item));

        name.textContent = item.dataset.partnerName || "";
        type.textContent = item.dataset.partnerType || "";
        description.textContent = item.dataset.partnerDescription || "";
        logo.src = item.dataset.partnerLogo || logo.src;
        logo.alt = item.dataset.partnerAlt || item.dataset.partnerName || logo.alt;
    }

    function bindDesktopInteractions() {
        const desktopMode = window.innerWidth > 768;

        items.forEach((item) => {
            item.onmouseenter = null;
            item.onfocus = null;
            item.onclick = null;

            if (!desktopMode) return;

            item.onmouseenter = () => applySpotlight(item);
            item.onfocus = () => applySpotlight(item);
            item.onclick = () => applySpotlight(item);
        });
    }

    const initial = section.querySelector(".partner-item.is-active") || items[0];
    applySpotlight(initial);
    bindDesktopInteractions();

    section.addEventListener("mouseleave", () => {
        if (window.innerWidth > 768) {
            applySpotlight(initial);
        }
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(bindDesktopInteractions, 150);
    });
}

function initDesktopParallax() {
    const root = document.documentElement;
    const canvas = document.querySelector(".desktop-parallax-home");
    const wrapper = document.querySelector(".desktop-parallax-wrapper");
    if (!canvas || !wrapper) return;

    const canvasWidth = 1920;
    const canvasHeight = 5520;
    let ticking = false;

    function update() {
        ticking = false;

        if (window.innerWidth < 769) {
            canvas.style.transform = "";
            canvas.style.transformOrigin = "";
            wrapper.style.height = "";
            root.style.setProperty("--scroll-top", "0");
            return;
        }

        const scale = Math.min(window.innerWidth / canvasWidth, 1);
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        canvas.style.transform = `translateX(-50%) scale(${scale})`;
        canvas.style.transformOrigin = "top center";
        wrapper.style.height = `${canvasHeight * scale}px`;
        root.style.setProperty("--scroll-top", String(scrollTop / scale));
    }

    function requestUpdate() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("load", requestUpdate);
    update();
}

function initScrollReveal() {
    const elements = document.querySelectorAll(".reveal-element");
    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
        elements.forEach((element) => element.classList.add("reveal-active"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-active");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach((element) => observer.observe(element));
}

function initSpotlightCards() {
    const cards = document.querySelectorAll(".waw-card");
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!cards.length || !canHover || reduceMotion) return;

    cards.forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const mx = (x / rect.width) * 100;
            const my = (y / rect.height) * 100;
            const rx = ((y / rect.height) - 0.5) * -15;
            const ry = ((x / rect.width) - 0.5) * 15;

            card.style.setProperty("--rx", `${rx}deg`);
            card.style.setProperty("--ry", `${ry}deg`);
            card.style.setProperty("--mx", `${mx}%`);
            card.style.setProperty("--my", `${my}%`);
        });

        card.addEventListener("mouseleave", () => {
            card.style.setProperty("--rx", "0deg");
            card.style.setProperty("--ry", "0deg");
            card.style.setProperty("--mx", "50%");
            card.style.setProperty("--my", "50%");
        });
    });
}

function initLazyBackgrounds() {
    if (!("IntersectionObserver" in window)) return;
    const els = document.querySelectorAll("[data-bg-src]");
    if (!els.length) return;
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.style.backgroundImage = `url(${el.dataset.bgSrc})`;
                observer.unobserve(el);
            }
        }
    }, { rootMargin: "200px" });
    for (const el of els) observer.observe(el);
}
