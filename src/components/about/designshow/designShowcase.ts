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

    // Cards sit vertically centered inside the 100vh sticky wrapper, so they
    // leave the viewport slightly before the wrapper itself finishes
    // scrolling away. Size the section to exactly close that gap instead of
    // guessing a fixed vh value.
    const cardMargin = (window.innerHeight - slides[0].offsetHeight) / 2;
    section.style.height = `${2 * window.innerHeight - cardMargin}px`;

    function getTotalScroll(){

        return section!.offsetHeight - window.innerHeight;

    }

    function getStep(){

        return slides.length > 1
            ? slides[1].offsetLeft - slides[0].offsetLeft
            : 0;

    }

    function updateCards(translate: number) {

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

    function animate() {

        ticking = false;

        const rect = section!.getBoundingClientRect();
        const totalScroll = getTotalScroll();

        const progressValue = totalScroll > 0
            ? Math.min(Math.max(-rect.top / totalScroll, 0), 1)
            : 0;

        const maxTranslate = getStep() * (slides.length - 1);
        const translate = progressValue * maxTranslate;

        slider!.style.transition = "none";
        slider!.style.transform = `translate3d(${-translate}px,-50%,0)`;

        updateCards(translate);

    }

    function onScroll(){

        if(!ticking){

            requestAnimationFrame(animate);
            ticking = true;

        }

    }

    function goToSlide(index: number){

        const clamped = Math.min(Math.max(index, 0), slides.length - 1);
        const translate = getStep() * clamped;

        slider!.style.transition = "transform .6s cubic-bezier(.22,1,.36,1)";
        slider!.style.transform = `translate3d(${-translate}px,-50%,0)`;

        updateCards(translate);

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