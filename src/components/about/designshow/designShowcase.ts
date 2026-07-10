// designShowcase.ts
function initDesignShowcase() {

    const section = document.querySelector(".design-showcase") as HTMLElement | null;
    const slider = document.getElementById("design-slider") as HTMLElement | null;
    const slides = [...document.querySelectorAll(".design-card")] as HTMLElement[];
    const progress = document.getElementById("design-progress") as HTMLElement | null;
    const current = document.getElementById("design-current") as HTMLElement | null;
    const prevBtn = document.getElementById("design-prev") as HTMLButtonElement | null;
    const nextBtn = document.getElementById("design-next") as HTMLButtonElement | null;

    if (!section || !slider || !slides.length) {

        console.warn("[design-showcase] Required elements not found — check ids/classes in DesignShowcase.astro and DesignCard.astro");

        return;

    }

    if (window.innerWidth <= 991) {

  
        slides.forEach(s => s.classList.add("active"));

        return;

    }

    let ticking = false;
    let activeIndex = 0;
    let listenersBound = false;

    function getTotalScroll(){

        return section!.offsetHeight - window.innerHeight;

    }

    function animate() {

        ticking = false;

        const rect = section!.getBoundingClientRect();
        const totalScroll = getTotalScroll();

        const progressValue = totalScroll > 0
            ? Math.min(Math.max(-rect.top / totalScroll, 0), 1)
            : 0;

        const maxTranslate =
            slider!.scrollWidth - window.innerWidth + 200;

        const translate = progressValue * maxTranslate;

        slider!.style.transform = `translate3d(${-translate}px,-50%,0)`;

        let active = 0;

        slides.forEach((slide, index) => {

            const center =
                slide.offsetLeft + slide.offsetWidth / 2 - translate;

            const viewport = window.innerWidth / 2;
            const distance = Math.abs(viewport - center);
            const normalized = Math.min(distance / 900, 1);

            slide.style.transform = `scale(${1 - normalized * .06})`;
            slide.style.opacity = `${1 - normalized * .6}`;

            const img = slide.querySelector("img") as HTMLImageElement | null;

            if (img) {

                const offset = (viewport - center) * .025;
                const zoom = 1.1 - normalized * .06;

                img.style.transform = `translateX(${offset}px) scale(${zoom})`;

            }

            if (distance < 340) {

                slide.classList.add("active");
                active = index;

            } else {

                slide.classList.remove("active");

            }

        });

        activeIndex = active;

        if (current) current.textContent = String(active + 1).padStart(2, "0");
        if (progress) progress.style.width = `${((active + 1) / slides.length) * 100}%`;
        if (prevBtn) prevBtn.disabled = active === 0;
        if (nextBtn) nextBtn.disabled = active === slides.length - 1;

    }

    function onScroll(){

        if(!ticking){

            requestAnimationFrame(animate);
            ticking = true;

        }

    }

    function goToSlide(index: number){

        const clamped = Math.min(Math.max(index, 0), slides.length - 1);
        const totalScroll = getTotalScroll();
        const progressValue = clamped / (slides.length - 1);
        const sectionTop = section!.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
            top: sectionTop + progressValue * totalScroll,
            behavior: "smooth",
        });

    }

    if (!listenersBound) {

        prevBtn?.addEventListener("click", () => goToSlide(activeIndex - 1));
        nextBtn?.addEventListener("click", () => goToSlide(activeIndex + 1));

        window.addEventListener("scroll", onScroll, { passive: true });

        listenersBound = true;

    }

    animate();

}



initDesignShowcase();

let resizeTimer: ReturnType<typeof setTimeout>;

window.addEventListener("resize", () => {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(initDesignShowcase, 200);

});