/**
 * PhotoSwipe lightbox for every [data-gallery] on the page.
 * Loaded lazily so it never blocks first paint.
 */
import "photoswipe/style.css";

const galleries = document.querySelectorAll<HTMLElement>("[data-gallery]:not([data-pswp-init])");

if (galleries.length) {
    import("photoswipe/lightbox").then(({ default: PhotoSwipeLightbox }) => {
        galleries.forEach((gallery) => {
            gallery.dataset.pswpInit = "";
            const lightbox = new PhotoSwipeLightbox({
                gallery,
                children: "a",
                bgOpacity: 0.96,
                showHideAnimationType: "fade",
                pswpModule: () => import("photoswipe"),
            });
            lightbox.init();
        });
    });
}
