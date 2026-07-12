import type { ImageMetadata } from "astro";

const galleries = import.meta.glob(
    "../assets/projects/educational/**/gallery/*.{webp,jpg,jpeg,png,avif}",
    {
        eager: true,
        import: "default"
    }
);

const construction = import.meta.glob(
    "../assets/projects/educational/**/construction/*.{webp,jpg,jpeg,png,avif}",
    {
        eager: true,
        import: "default"
    }
);

const heroes = import.meta.glob(
    "../assets/projects/educational/**/hero.{webp,jpg,jpeg,png,avif}",
    {
        eager: true,
        import: "default"
    }
);

export function getEducationalImages(folder: string) {

    return {

        hero: heroes[
            `../assets/projects/educational/${folder}/hero.webp`
        ] as ImageMetadata,

        gallery: Object.entries(galleries)
            .filter(([path]) =>
                path.includes(`/${folder}/gallery/`)
            )
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([, image]) => image as ImageMetadata),

        construction: Object.entries(construction)
            .filter(([path]) =>
                path.includes(`/${folder}/construction/`)
            )
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([, image]) => image as ImageMetadata)

    };

}