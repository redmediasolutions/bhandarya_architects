/**
 * Site-wide scroll reveal.
 * Any element with [data-reveal] fades/rises in once it enters the viewport.
 * Children of [data-reveal-stagger] get an incremental delay.
 */

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
    const step = Number(group.dataset.revealStagger) || 0.08;
    group.querySelectorAll<HTMLElement>(":scope > [data-reveal]").forEach((el, i) => {
        el.style.setProperty("--d", `${(i * step).toFixed(2)}s`);
    });
});

const items = document.querySelectorAll<HTMLElement>("[data-reveal]");

if (reduce || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in"));
} else {
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-in");
                io.unobserve(entry.target);
            });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    items.forEach((el) => io.observe(el));
}
