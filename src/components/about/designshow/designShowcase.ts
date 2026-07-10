const section = document.querySelector(".design-showcase") as HTMLElement;

const slider = document.getElementById("design-slider") as HTMLElement;

const slides = [...document.querySelectorAll(".design-card")] as HTMLElement[];

const progress = document.getElementById("design-progress") as HTMLElement;

const current = document.getElementById("design-current") as HTMLElement;

if (
    section &&
    slider &&
    slides.length &&
    window.innerWidth > 991
) {

    let ticking = false;

    function animate() {

        ticking = false;

        //------------------------------------------
        // Section Progress
        //------------------------------------------

        const rect = section.getBoundingClientRect();

        const totalScroll =
            section.offsetHeight - window.innerHeight;

        const progressValue = Math.min(
            Math.max(-rect.top / totalScroll, 0),
            1
        );

        //------------------------------------------
        // Horizontal Translation
        //------------------------------------------

        const maxTranslate =
            slider.scrollWidth -
            window.innerWidth +
            200;

        const translate =
            progressValue * maxTranslate;

        slider.style.transform =
            `translate3d(${-translate}px,-50%,0)`;

        //------------------------------------------
        // Active Card
        //------------------------------------------

        let active = 0;

        slides.forEach((slide, index) => {

            const center =
                slide.offsetLeft +
                slide.offsetWidth / 2 -
                translate;

            const viewport =
                window.innerWidth / 2;

            const distance =
                Math.abs(viewport - center);

            //--------------------------------------

            const normalized =
                Math.min(distance / 700, 1);

            const scale =
                1 - normalized * .08;

            const opacity =
                1 - normalized * .55;

            slide.style.transform =
                `scale(${scale})`;

            slide.style.opacity =
                `${opacity}`;

            //--------------------------------------
            // Image Parallax
            //--------------------------------------

            const img =
                slide.querySelector("img") as HTMLImageElement;

            if(img){

                const offset =
                    (viewport - center) * .03;

                const zoom =
                    1.12 - normalized * .08;

                img.style.transform =
                    `translateX(${offset}px) scale(${zoom})`;

            }

            //--------------------------------------
            // Active State
            //--------------------------------------

            if(distance < 260){

                slide.classList.add("active");

                active = index;

            }else{

                slide.classList.remove("active");

            }

        });

        //------------------------------------------
        // Progress
        //------------------------------------------

        current.textContent =
            String(active + 1).padStart(2,"0");

        progress.style.height =
            `${((active+1)/slides.length)*100}%`;

    }

    //----------------------------------------------
    // RAF Scroll
    //----------------------------------------------

    function onScroll(){

        if(!ticking){

            requestAnimationFrame(animate);

            ticking = true;

        }

    }

    animate();

    window.addEventListener(
        "scroll",
        onScroll,
        { passive:true }
    );

    window.addEventListener(
        "resize",
        animate
    );

}