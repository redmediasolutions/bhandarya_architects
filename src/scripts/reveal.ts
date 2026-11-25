/**
 * Site-wide scroll reveal.
 *  - [data-reveal]           fades/rises in once it enters the viewport
 *  - [data-reveal-stagger]   children with [data-reveal] get incremental delays
 *  - [data-split]            text is split into words that rise out of a mask
 *                            (split happens client-side; markup/copy is untouched)
 */

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- word splitting ---------- */

function splitWords(el: HTMLElement) {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = "";
    let i = 0;

    const walk = (node: Node) => {
        [...node.childNodes].forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent ?? "";
                if (!text.trim()) return;
                const frag = document.createDocumentFragment();
                text.split(/(\s+)/).forEach((part) => {
                    if (!part) return;
                    if (/^\s+$/.test(part)) {
                        frag.appendChild(document.createTextNode(" "));
                        return;
                    }
                    const outer = document.createElement("span");
                    outer.className = "w";
                    const inner = document.createElement("span");
                    inner.textContent = part;
                    inner.style.setProperty("--wi", String(i++));
                    outer.appendChild(inner);
                    frag.appendChild(outer);
                });
                child.replaceWith(frag);
            } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== "BR") {
                walk(child);
            }
        });
    };

    walk(el);
}

if (!reduce) {
    document.querySelectorAll<HTMLElement>("[data-split]").forEach(splitWords);
}

/* ---------- stagger ---------- */

document.querySelectorAll<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
    const step = Number(group.dataset.revealStagger) || 0.08;
    group.querySelectorAll<HTMLElement>(":scope > [data-reveal]").forEach((el, i) => {
        el.style.setProperty("--d", `${(i * step).toFixed(2)}s`);
    });
});

/* ---------- observe ---------- */

const items = document.querySelectorAll<HTMLElement>("[data-reveal], [data-split]");

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

import "./motion";
