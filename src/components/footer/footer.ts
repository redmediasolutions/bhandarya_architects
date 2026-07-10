// src/scripts/footer.ts

class FooterEffects {

    private footer: HTMLElement | null;
    private cursor: HTMLElement | null;

    constructor() {

        this.footer = document.querySelector(".site-footer");
        this.cursor = document.querySelector(".footer-cursor");

        if (!this.footer) return;

        this.initReveal();
        this.initCursor();
        this.initParallax();
        this.initLinks();
        this.initStats();

    }

    /* ----------------------------------------------------- */
    /* Reveal Animation */
    /* ----------------------------------------------------- */

    private initReveal() {

        const observer = new IntersectionObserver((entries) => {

            if (!entries[0].isIntersecting) return;

            this.footer?.classList.add("visible");

            observer.disconnect();

        }, {

            threshold: 0.15

        });

        observer.observe(this.footer!);

    }

    /* ----------------------------------------------------- */
    /* Cursor Glow */
    /* ----------------------------------------------------- */

    private initCursor() {

        if (!this.cursor || !this.footer) return;

        this.footer.addEventListener("mousemove", (e) => {

            const rect = this.footer!.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.cursor!.style.left = `${x}px`;
            this.cursor!.style.top = `${y}px`;

        });

        this.footer.addEventListener("mouseenter", () => {

            this.cursor!.style.opacity = "1";

        });

        this.footer.addEventListener("mouseleave", () => {

            this.cursor!.style.opacity = "0";

        });

    }

    /* ----------------------------------------------------- */
    /* Background Parallax */
    /* ----------------------------------------------------- */

    private initParallax() {

        if (!this.footer) return;

        const grid = this.footer.querySelector(".footer-grid-bg");

        if (!grid) return;

        this.footer.addEventListener("mousemove", (e) => {

            const rect = this.footer!.getBoundingClientRect();

            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const tx = (x - 0.5) * 18;
            const ty = (y - 0.5) * 18;

            (grid as HTMLElement).style.transform =
                `translate(${tx}px, ${ty}px)`;

        });

        this.footer.addEventListener("mouseleave", () => {

            (grid as HTMLElement).style.transform = "";

        });

    }

    /* ----------------------------------------------------- */
    /* Hover Animation */
    /* ----------------------------------------------------- */

    private initLinks() {

        document
            .querySelectorAll(".footer-column a")
            .forEach((link) => {

                link.addEventListener("mouseenter", () => {

                    (link as HTMLElement).style.transform =
                        "translateX(6px)";

                });

                link.addEventListener("mouseleave", () => {

                    (link as HTMLElement).style.transform = "";

                });

            });

    }

    /* ----------------------------------------------------- */
    /* Counter Animation */
    /* ----------------------------------------------------- */

    private initStats() {

        const stats = document.querySelectorAll(".footer-stats .number");

        stats.forEach((stat) => {

            const text = stat.textContent ?? "";

            const match = text.match(/\d+/);

            if (!match) return;

            const target = Number(match[0]);

            let value = 0;

            const duration = 1800;
            const start = performance.now();

            const suffix = text.replace(match[0], "");

            const animate = (time: number) => {

                const progress = Math.min(
                    (time - start) / duration,
                    1
                );

                value = Math.floor(progress * target);

                stat.textContent = value + suffix;

                if (progress < 1) {

                    requestAnimationFrame(animate);

                } else {

                    stat.textContent = target + suffix;

                }

            };

            requestAnimationFrame(animate);

        });

    }

}

window.addEventListener("DOMContentLoaded", () => {

    new FooterEffects();

});