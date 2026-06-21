const COMPONENT_CACHE_VERSION = 1;
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
    initSponsorsMarquee();
    initDesktopParallax();
    initScrollReveal();
    initSpotlightCards();
});

function initLandingPageCarousel() {
    const carousel = document.querySelector(".events-carousel");
    if (!carousel) return;

    const slides = [...carousel.querySelectorAll(".event-slide")];
    const leftArrow = carousel.querySelector(".carousel-nav-left");
    const rightArrow = carousel.querySelector(".carousel-nav-right");
    if (!slides.length || !leftArrow || !rightArrow) return;

    let current = 0;

    function goToSlide(index) {
        if (index < 0 || index >= slides.length) return;

        current = index;
        slides.forEach((slide, slideIndex) => {
            slide.style.display = slideIndex === current ? "flex" : "none";
        });

        leftArrow.classList.toggle("hidden", current === 0);
        rightArrow.classList.toggle("hidden", current === slides.length - 1);
    }

    leftArrow.addEventListener("click", () => goToSlide(current - 1));
    rightArrow.addEventListener("click", () => goToSlide(current + 1));

    let touchStartX = 0;
    carousel.addEventListener("touchstart", (event) => {
        touchStartX = event.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener("touchend", (event) => {
        const swipeDistance = touchStartX - event.changedTouches[0].clientX;
        if (Math.abs(swipeDistance) <= 40) return;

        goToSlide(current + (swipeDistance > 0 ? 1 : -1));
    }, { passive: true });

    document.addEventListener("click", (event) => {
        const button = event.target.closest(".event-more-btn");
        if (!button) return;

        const card = button.closest(".event-card-mobile");
        if (!card) return;

        const isExpanded = card.classList.toggle("expanded");
        button.textContent = isExpanded ? "less" : "more";
    });

    goToSlide(0);
}

function initSponsorsMarquee() {
    const container = document.querySelector(".sponsorship-section .partners-container");
    if (!container) return;

    const speed = 0.4;
    const spacing = 80;
    let wrapper = null;
    let items = [];
    let animationId = null;

    function buildMarquee() {
        destroyMarquee();
        if (window.innerWidth > 768) return;

        const originals = [...container.children].filter((child) => child.classList.contains("partner-item"));
        if (!originals.length) return;

        wrapper = document.createElement("div");
        wrapper.className = "partners-marquee-wrapper";

        const topRow = document.createElement("div");
        topRow.className = "partners-flow-row";

        const bottomRow = document.createElement("div");
        bottomRow.className = "partners-flow-row";

        wrapper.append(topRow, bottomRow);
        container.appendChild(wrapper);

        addMarqueeItems(originals.slice(0, 5), topRow, "top");
        addMarqueeItems(originals.slice(5), bottomRow, "bottom");

        requestAnimationFrame(() => {
            layoutMarquee(topRow.offsetWidth || container.offsetWidth);
            originals.forEach((child) => {
                child.style.display = "none";
            });
            animationId = requestAnimationFrame(tick);
        });
    }

    function addMarqueeItems(originals, row, rowName) {
        originals.forEach((original, index) => {
            const element = original.cloneNode(true);
            const width = element.querySelector(".partner-logo-rect") ? 180 : 120;

            element.style.width = `${width}px`;
            row.appendChild(element);
            items.push({ element, width, x: 0, row: rowName, index });
        });
    }

    function layoutMarquee(rowWidth) {
        let topX = 0;
        items.filter((item) => item.row === "top").forEach((item) => {
            item.x = topX;
            topX += item.width + spacing;
        });

        let bottomX = rowWidth;
        items.filter((item) => item.row === "bottom").forEach((item) => {
            item.x = bottomX;
            bottomX += item.width + spacing;
        });

        items.forEach(updateItemPosition);
    }

    function tick() {
        if (!wrapper) return;

        const [topRow] = wrapper.querySelectorAll(".partners-flow-row");
        const rowWidth = topRow.offsetWidth;
        const topItems = items.filter((item) => item.row === "top");
        const bottomItems = items.filter((item) => item.row === "bottom");

        topItems.forEach((item) => {
            item.x += speed;
            if (item.x > rowWidth) {
                const leftmost = topItems.reduce((min, candidate) => candidate.x < min.x ? candidate : min);
                item.x = leftmost.x - item.width - spacing;
            }
            updateItemPosition(item);
        });

        bottomItems.forEach((item) => {
            item.x -= speed;
            if (item.x + item.width < 0) {
                const rightmost = bottomItems.reduce((max, candidate) => {
                    return candidate.x + candidate.width > max.x + max.width ? candidate : max;
                });
                item.x = rightmost.x + rightmost.width + spacing;
            }
            updateItemPosition(item);
        });

        animationId = requestAnimationFrame(tick);
    }

    function updateItemPosition(item) {
        item.element.style.transform = `translate(${item.x}px, -50%)`;
    }

    function destroyMarquee() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        if (wrapper) {
            wrapper.remove();
            wrapper = null;
        }

        items = [];
        [...container.children].forEach((child) => {
            if (child.classList.contains("partner-item")) child.style.display = "";
        });
    }

    buildMarquee();

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth <= 768) buildMarquee();
            else destroyMarquee();
        }, 250);
    });
}

function initDesktopParallax() {
    const root = document.documentElement;
    const canvas = document.querySelector(".desktop-parallax-home");
    const wrapper = document.querySelector(".desktop-parallax-wrapper");
    if (!canvas || !wrapper) return;

    const canvasWidth = 1920;
    const canvasHeight = 4390;
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
