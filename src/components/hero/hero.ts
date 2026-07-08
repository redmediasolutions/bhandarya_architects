import { slides } from "./heroData";

const hero = document.getElementById("hero");

if (!hero) {
  throw new Error("Hero element not found");
}

const backgroundSlides = [
  ...document.querySelectorAll<HTMLElement>(".hero-slide"),
];

const title = document.getElementById("hero-title");
const description = document.getElementById("hero-description");
const subtitle = document.querySelector(".hero-subtitle");
const currentNumber = document.getElementById("hero-current");
const progress = document.getElementById("hero-progress-fill");

let current = 0;
const total = slides.length;
const DURATION = 7000;
let autoplay: any; // Fixed: Explicit typing to prevent window.setInterval TS errors

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
    clearInterval(autoplay);
}

function restart() {
    stop();
    start();
}

function nextSlide() {
    let next = current + 1;
    if (next >= total) next = 0;
    goToSlide(next);
}

function previousSlide() {
    let prev = current - 1;
    if (prev < 0) prev = total - 1;
    goToSlide(prev);
}

// Placeholder for the missing progress function called in start() and goToSlide()
function restartProgress() {
    if (progress) {
        progress.style.transition = 'none';
        progress.style.width = '0%';
        void progress.offsetWidth; // Trigger reflow
        progress.style.transition = `width ${DURATION}ms linear`;
        progress.style.width = '100%';
    }
}

/* ------------------------------------------------ */
/* CONTENT & SLIDE TRANSITION */
/* ------------------------------------------------ */

const content = document.getElementById("hero-content");
const buttons = document.querySelector(".hero-buttons");

// Fixed: Removed the first duplicate goToSlide definition and kept this complete one
function goToSlide(index: number) {
    if (index === current) return;

    //----------------------------------------
    // Background
    //----------------------------------------
    if (backgroundSlides[current]) {
        backgroundSlides[current].classList.remove("active");
    }
    if (backgroundSlides[index]) {
        backgroundSlides[index].classList.add("active");
    }

    //----------------------------------------
    // Content Animation
    //----------------------------------------
    content?.classList.remove("animating");
    void (content as HTMLElement)?.offsetWidth; // restart animation
    content?.classList.add("animating");

    //----------------------------------------
    // Update Text
    //----------------------------------------
    const slide = slides[index];

    if (title && slide)
        title.innerHTML = slide.title.replace(/\n/g, "<br>");

    if (subtitle && slide)
        subtitle.textContent = slide.subtitle;

    if (description && slide)
        description.textContent = slide.description;

    //----------------------------------------
    // Update Buttons
    //----------------------------------------
    if (buttons && slide?.buttons) {
        buttons.innerHTML = "";
        slide.buttons.forEach(button => {
            const a = document.createElement("a");
            a.href = button.href;
            a.className = "btn" + (button.outline ? " btn-outline" : "");
            a.textContent = button.text;
            buttons.appendChild(a);
        });
    }

    //----------------------------------------
    // Counter
    //----------------------------------------
    if (currentNumber) {
        currentNumber.textContent = String(index + 1).padStart(2, "0");
    }

    //----------------------------------------
    // Progress & State
    //----------------------------------------
    restartProgress();
    preloadUpcoming(); // Moved here from the deleted duplicate function
    current = index;
}

/* ------------------------------------------------ */
/* Navigation Links */
/* ------------------------------------------------ */

const prevButton = document.getElementById("hero-prev");
const nextButton = document.getElementById("hero-next");

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

// Initial preloads
preloadImage(0);
preloadImage(1);

start();

function preloadUpcoming() {
    preloadImage((current + 1) % total);
    preloadImage((current + 2) % total);
}