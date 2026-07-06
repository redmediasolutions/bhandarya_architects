# Bhandary Architects — Astro

Astro replica of [bhandaryarchitects.com](https://bhandaryarchitects.com/) (originally WordPress + Elementor).

## Pages

| Route | Source |
|---|---|
| `/` | `src/pages/index.astro` — hero slideshow, stats, philosophy, quote, featured projects, journey, services, contact |
| `/projects` | `src/pages/projects.astro` |
| `/about-us` | `src/pages/about-us.astro` |
| `/samudra` | `src/pages/samudra.astro` |
| `/kuitra` | `src/pages/kuitra.astro` |

Both project pages share `src/components/ProjectDetail.astro`.

## Getting started

```bash
npm install    # also auto-downloads all images from the live site into public/uploads/
npm run dev    # http://localhost:4321
npm run build  # static output in dist/
```

If any image fails to download (e.g. no internet), re-run:

```bash
npm run fetch-images
```

## Design tokens

Extracted from the live site's Elementor kit (`post-8.css`):

- Font: **Montserrat Alternates** (400/500/600/700, Google Fonts)
- Accent orange: `#FF6900` / `#FF6A00`
- Bronze: `#CE8133`, text grays: `#7A7A7A`, `#7E7E7E`, `#272727`
- Container width: `1140px`

All tokens live as CSS variables in `src/styles/global.css`. Site text/nav/contact data is in `src/consts.ts`.

## Notes

- Stats counters on the homepage animate from 0; target values are in `STATS` in `src/consts.ts` (adjust the project count as needed — the live site's target values are set in Elementor and weren't exposed in the page markup).
- Gallery images open in a lightbox with keyboard navigation (Esc / arrows).
- Team portraits on the About page reuse the one portrait photo published on the live site; swap the `portrait` variable in `about-us.astro` for individual photos when available.
