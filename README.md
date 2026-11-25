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

## Design system

Minimal, editorial and image-led — one typeface, a warm paper ground, hairline rules and a strict 12-column grid.

- Font: **Manrope** (variable, self-hosted via `@fontsource-variable/manrope`)
- Colour: paper `#F5F3EF`, ink `#151515`, muted `#8A867F`, night `#131312`
- Layout: `.wrap` (max 1480px) + 12-column grids; section rhythm via `.sec`, `.sec--alt`, `.sec--white`, `.sec--dark`
- Motion: add `data-reveal` to any element for a scroll reveal (`src/scripts/reveal.ts`); respects `prefers-reduced-motion`

All tokens live as CSS variables in `src/styles/global.css`.

Reusable building blocks are in `src/components/ui/`:
`PageHero`, `SectionHead`, `Split`, `Featured`, `ProjectCard`, `Rows`, `Stats`, `Meta`, `Quotes`, `Faq`, `Cta`, `Btn`.
Page sections (e.g. `components/home/*`, `components/residential/*`) hold the copy and compose these blocks.

## Notes

- Stats counters on the homepage animate from 0; target values are in `STATS` in `src/consts.ts` (adjust the project count as needed — the live site's target values are set in Elementor and weren't exposed in the page markup).
- Gallery images open in a lightbox with keyboard navigation (Esc / arrows).
- Team portraits on the About page reuse the one portrait photo published on the live site; swap the `portrait` variable in `about-us.astro` for individual photos when available.
