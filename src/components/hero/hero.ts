import { slides } from "./heroData";

const hero = document.getElementById("hero");

if (hero) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const media = [...hero.querySelectorAll<HTMLElement>(".hero-slide")];
    const content = hero.querySelector<HTMLElement>("#hero-content")!;
    const titleEl = hero.querySelector<HTMLElement>("#hero-title")!;
    const subtitleEl = hero.querySelector<HTMLElement>("#hero-subtitle")!;
    const descEl = hero.querySelector<HTMLElement>("#hero-description")!;
    const buttonsEl = hero.querySelector<HTMLElement>("#hero-buttons")!;
    const counterEl = hero.querySelector<HTMLElement>("#hero-current")!;
    const progressEl = hero.querySelector<HTMLElement>("#hero-progress-fill")!;
    const indexBtns = [...hero.querySelectorAll<HTMLButtonElement>(".hero-index-btn")];

    const DURATION = 7000;
    const pad = (n: number) => String(n).padStart(2, "0");

    let current = 0;
    let busy = false;
    let timer: number | undefined;
    let remaining = DURATION;
    let startedAt = 0;

    /* ---------- render ---------- */

    const renderText = (i: number) => {
        const s = slides[i];
        subtitleEl.textContent = s.subtitle;
        titleEl.innerHTML = "";
        s.title.split("\n").forEach((line, li) => {
            const outer = document.createElement("span");
            outer.className = "ln";
            const inner = document.createElement("span");
            inner.style.setProperty("--li", String(li));
            inner.textContent = line;
            outer.appendChild(inner);
            titleEl.appendChild(outer);
        });
        descEl.textContent = s.description;
        buttonsEl.innerHTML = "";
        s.buttons.forEach((b) => {
            const a = document.createElement("a");
            a.href = b.href;
            a.className = "btn" + (b.outline ? " btn--ghost" : "");
            a.textContent = b.text;
            buttonsEl.appendChild(a);
        });
    };

    const restartBars = () => {
        progressEl.classList.remove("run");
        void progressEl.offsetWidth;
        progressEl.classList.add("run");
        indexBtns.forEach((b, k) => b.classList.toggle("active", k === current));
    };

    /* ---------- autoplay ---------- */

    const schedule = (ms: number) => {
        window.clearTimeout(timer);
        startedAt = performance.now();
        remaining = ms;
        timer = window.setTimeout(() => go(current + 1), ms);
    };

    const go = (target: number) => {
        const next = (target + slides.length) % slides.length;
        if (busy || next === current) return;
        busy = true;

        media[current]?.classList.remove("active");
        media[next]?.classList.add("active");

        const swap = () => {
            current = next;
            renderText(current);
            content.classList.remove("is-leaving", "first", "is-entering");
            void content.offsetWidth;
            content.classList.add("is-entering");

            counterEl.textContent = pad(current + 1);
            counterEl.classList.remove("tick");
            void counterEl.offsetWidth;
            counterEl.classList.add("tick");

            restartBars();
            schedule(DURATION);
            preload(current + 1);
            window.setTimeout(() => (busy = false), 900);
        };

        if (reduce) { swap(); return; }
        content.classList.remove("is-entering");
        content.classList.add("is-leaving");
        window.setTimeout(swap, 560);
    };

    /* ---------- controls ---------- */

    hero.querySelector("#hero-next")?.addEventListener("click", () => go(current + 1));
    hero.querySelector("#hero-prev")?.addEventListener("click", () => go(current - 1));
    indexBtns.forEach((b) => b.addEventListener("click", () => go(Number(b.dataset.goto))));

    document.addEventListener("keydown", (e) => {
        if (window.scrollY > window.innerHeight * 0.6) return;
        if (e.key === "ArrowRight") go(current + 1);
        if (e.key === "ArrowLeft") go(current - 1);
    });

    // pause while the hero is off-screen or the tab is hidden
    const pause = () => {
        if (hero.classList.contains("paused")) return;
        hero.classList.add("paused");
        window.clearTimeout(timer);
        remaining = Math.max(400, remaining - (performance.now() - startedAt));
    };
    const resume = () => {
        if (!hero.classList.contains("paused")) return;
        hero.classList.remove("paused");
        schedule(remaining);
    };
    new IntersectionObserver(([entry]) => (entry.isIntersecting ? resume() : pause()), { threshold: 0.2 }).observe(hero);
    document.addEventListener("visibilitychange", () => (document.hidden ? pause() : resume()));

    /* ---------- preload ---------- */

    const loaded = new Set<number>();
    const preload = (i: number) => {
        const k = (i + slides.length) % slides.length;
        if (loaded.has(k)) return;
        loaded.add(k);
        const img = new Image();
        img.src = slides[k].image;
    };

    /* ---------- init ---------- */

    content.classList.add("first", "is-entering");
    restartBars();
    schedule(DURATION);
    preload(1);
}
