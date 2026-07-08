import { slides } from "./heroData";

const hero = document.getElementById("hero");

if (!hero) {
    throw new Error("Hero element not found");
}

// ------------------------------------------------
// Selectors
// ------------------------------------------------
const backgroundSlides = [...document.querySelectorAll<HTMLElement>(".hero-slide")];
const content = document.getElementById("hero-content");
const title = document.getElementById("hero-title");
const description = document.getElementById("hero-description");
const subtitle = document.querySelector(".hero-subtitle");
const buttonsContainer = document.querySelector(".hero-buttons");

const currentNumber = document.getElementById("hero-current");
const progress = document.getElementById("hero-progress-fill");
const prevButton = document.getElementById("hero-prev");
const nextButton = document.getElementById("hero-next");

// ------------------------------------------------
// State
// ------------------------------------------------
let current = 0;
const total = slides.length;
const DURATION = 7000;
let autoplay: number | undefined; 
let isTransitioning = false; // Prevents button spamming

/* ------------------------------------------------ */
/* Control Flow */
/* ------------------------------------------------ */

function start() {
    restartProgress();
    autoplay = window.setInterval(() => {
        nextSlide();
    }, DURATION);
}

function stop() {
    if (autoplay) clearInterval(autoplay);
}

function restart() {
    stop();
    start();
}

function nextSlide() {
    if (isTransitioning) return;
    let next = current + 1;
    if (next >= total) next = 0;
    goToSlide(next);
}

function previousSlide() {
    if (isTransitioning) return;
    let prev = current - 1;
    if (prev < 0) prev = total - 1;
    goToSlide(prev);
}

function restartProgress() {
    if (progress) {
        progress.style.transition = "none";
        progress.style.width = "0%";
        void progress.offsetWidth; 
        progress.style.transition = `width ${DURATION}ms linear`;
        progress.style.width = "100%";
    }
}

/* ------------------------------------------------ */
/* CONTENT & SLIDE TRANSITION */
/* ------------------------------------------------ */

function goToSlide(index: number) {
    if (index === current || isTransitioning) return;
    
    const slide = slides[index];
    if (!slide) return;

    isTransitioning = true; // Lock controls

    //----------------------------------------
    // 1. Crossfade Backgrounds Immediately
    //----------------------------------------
    if (backgroundSlides[current]) {
        backgroundSlides[current].classList.remove("active");
    }
    if (backgroundSlides[index]) {
        backgroundSlides[index].classList.add("active");
    }

    //----------------------------------------
    // 2. Animate Current Content Out
    //----------------------------------------
    if (content) {
        content.classList.remove("animating");
        content.classList.add("fade-out"); // New class we will add to CSS
    }

    //----------------------------------------
    // 3. Wait for fade-out, then swap data
    //----------------------------------------
    setTimeout(() => {
        
        // Update Text
        if (title) title.textContent = slide.title;
        if (subtitle) subtitle.textContent = slide.subtitle;
        if (description) description.textContent = slide.description;

        // Update Buttons
        if (buttonsContainer && slide.buttons) {
            buttonsContainer.innerHTML = ""; 
            slide.buttons.forEach((button) => {
                const a = document.createElement("a");
                a.href = button.href;
                a.className = "btn" + (button.outline ? " btn-outline" : "");
                a.textContent = button.text;
                buttonsContainer.appendChild(a);
            });
        }

        // Counter Update
        if (currentNumber) {
            currentNumber.textContent = String(index + 1).padStart(2, "0");
        }

        //----------------------------------------
        // 4. Animate New Content In
        //----------------------------------------
        if (content) {
            content.classList.remove("fade-out");
            void content.offsetWidth; // Force layout recalculation
            content.classList.add("animating");
        }

        // Update state and progress
        current = index;
        restartProgress();
        preloadUpcoming(); 

        // Unlock controls after reveal animation finishes (approx 1s)
        setTimeout(() => {
            isTransitioning = false;
        }, 1000);

    }, 400); // 400ms matches the fade-out CSS duration
}

/* ------------------------------------------------ */
/* Event Listeners */
/* ------------------------------------------------ */

prevButton?.addEventListener("click", () => {
    previousSlide();
    restart();
});

nextButton?.addEventListener("click", () => {
    nextSlide();
    restart();
});

/* ------------------------------------------------ */
/* Image Preloading */
/* ------------------------------------------------ */

const loadedImages = new Set<number>();

function preloadImage(index: number) {
    if (loadedImages.has(index) || !slides[index]) return;

    const img = new Image();
    img.src = slides[index].image;
    loadedImages.add(index);
}

function preloadUpcoming() {
    preloadImage((current + 1) % total);
    preloadImage((current + 2) % total);
}

// ------------------------------------------------
// Initialization
// ------------------------------------------------
preloadImage(0);
preloadImage(1);
start();