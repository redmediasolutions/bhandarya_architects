/**
 * Small, dependency-free motion layer. Every effect is opt-in via a data
 * attribute and is skipped entirely when the visitor prefers reduced motion.
 *
 *  [data-parallax="0.08"]  element drifts against the scroll (use on images inside an overflow:hidden frame)
 *  [data-progress]         exposes --p (0 → 1) as the element travels through the viewport
 *  [data-scrub]            words light up one by one as the block scrolls past
 *  [data-count]            number counts up the first time it is seen
 *  [data-magnetic]         element leans gently towards the pointer
 *  [data-cursor-zone]      links inside show a small circular cursor with an arrow
 */

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

if (!reduce) {
    /* ------------------------------------------------------------------ */
    /* Scroll-linked effects (one rAF loop)                                */
    /* ------------------------------------------------------------------ */

    const parallax = [...document.querySelectorAll<HTMLElement>("[data-parallax]")];
    const progress = [...document.querySelectorAll<HTMLElement>("[data-progress]")];
    const scrubs = [...document.querySelectorAll<HTMLElement>("[data-scrub]")];

    // split scrub blocks into words
    const scrubWords = new Map<HTMLElement, HTMLElement[]>();
    scrubs.forEach((block) => {
        const words: HTMLElement[] = [];
        const walk = (node: Node) => {
            [...node.childNodes].forEach((child) => {
                if (child.nodeType === Node.TEXT_NODE) {
                    const text = child.textContent ?? "";
                    if (!text.trim()) return;
                    const frag = document.createDocumentFragment();
                    text.split(/(\s+)/).forEach((part) => {
                        if (!part) return;
                        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
                        const s = document.createElement("span");
                        s.className = "sw";
                        s.textContent = part;
                        words.push(s);
                        frag.appendChild(s);
                    });
                    child.replaceWith(frag);
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    walk(child);
                }
            });
        };
        walk(block);
        block.classList.add("is-scrub");
        scrubWords.set(block, words);
    });

    let ticking = false;

    const update = () => {
        ticking = false;
        const vh = window.innerHeight;

        parallax.forEach((el) => {
            const host = el.parentElement ?? el;
            const r = host.getBoundingClientRect();
            if (r.bottom < -100 || r.top > vh + 100) return;
            const factor = Number(el.dataset.parallax) || 0.08;
            const offset = (r.top + r.height / 2 - vh / 2) * -factor;
            el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(var(--ps, 1.14))`;
        });

        progress.forEach((el) => {
            const r = el.getBoundingClientRect();
            const start = vh * (Number(el.dataset.progressStart) || 0.85);
            const p = clamp((start - r.top) / (r.height * (Number(el.dataset.progressSpan) || 1)));
            el.style.setProperty("--p", p.toFixed(4));
        });

        scrubWords.forEach((words, block) => {
            const r = block.getBoundingClientRect();
            const p = clamp((vh * 0.88 - r.top) / (vh * 0.5 + r.height * 0.6));
            const lit = Math.round(p * words.length);
            words.forEach((w, i) => w.classList.toggle("lit", i < lit));
        });
    };

    const onScroll = () => {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
    };

    if (parallax.length || progress.length || scrubWords.size) {
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
    }

    /* ------------------------------------------------------------------ */
    /* Count up                                                           */
    /* ------------------------------------------------------------------ */

    const counters = document.querySelectorAll<HTMLElement>("[data-count]");
    if (counters.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target as HTMLElement;
                io.unobserve(el);
                const target = Number(el.dataset.count);
                const start = performance.now();
                const dur = 1800;
                const tick = (now: number) => {
                    const t = clamp((now - start) / dur);
                    const eased = 1 - Math.pow(1 - t, 4);
                    el.textContent = String(Math.round(target * eased));
                    if (t < 1) requestAnimationFrame(tick);
                };
                el.textContent = "0";
                requestAnimationFrame(tick);
            });
        }, { threshold: 0.6 });
        counters.forEach((c) => io.observe(c));
    }

    /* ------------------------------------------------------------------ */
    /* Pointer effects (desktop only)                                     */
    /* ------------------------------------------------------------------ */

    if (finePointer) {
        document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
            const strength = Number(el.dataset.magnetic) || 0.25;
            el.addEventListener("pointermove", (e) => {
                const r = el.getBoundingClientRect();
                const x = (e.clientX - (r.left + r.width / 2)) * strength;
                const y = (e.clientY - (r.top + r.height / 2)) * strength;
                el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
            });
            el.addEventListener("pointerleave", () => { el.style.transform = ""; });
        });

        const zones = document.querySelectorAll<HTMLElement>("[data-cursor-zone]");
        if (zones.length) {
            const dot = document.createElement("div");
            dot.className = "cursor-dot";
            dot.setAttribute("aria-hidden", "true");
            dot.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg>';
            document.body.appendChild(dot);

            let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
            const loop = () => {
                x += (tx - x) * 0.18;
                y += (ty - y) * 0.18;
                dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(loop) : 0;
            };
            const move = (e: PointerEvent) => {
                tx = e.clientX; ty = e.clientY;
                if (!raf) raf = requestAnimationFrame(loop);
            };

            zones.forEach((zone) => {
                zone.querySelectorAll<HTMLElement>("a").forEach((a) => {
                    a.addEventListener("pointerenter", (e) => {
                        x = tx = e.clientX; y = ty = e.clientY;
                        dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                        dot.classList.add("on");
                        zone.classList.add("has-cursor");
                    });
                    a.addEventListener("pointerleave", () => {
                        dot.classList.remove("on");
                        zone.classList.remove("has-cursor");
                    });
                    a.addEventListener("pointermove", move);
                });
            });
        }
    }
}
