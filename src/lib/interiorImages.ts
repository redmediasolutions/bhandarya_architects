import type { ImageMetadata } from "astro";

const galleries = import.meta.glob(
    "../assets/projects/interiors/**/gallery/*.{webp,jpg,jpeg,png,avif}",
    {
        eager: true,
        import: "default"
    }
);

const construction = import.meta.glob(
    "../assets/projects/interiors/**/construction/*.{webp,jpg,jpeg,png,avif}",
    {
        eager: true,
        import: "default"
    }
);

const heroes = import.meta.glob(
    "../assets/projects/interiors/**/hero.{webp,jpg,jpeg,png,avif}",
    {
        eager: true,
        import: "default"
    }
);

export function getInteriorImages(folder: string) {

    return {

        hero: heroes[
            `../assets/projects/interiors/${folder}/hero.webp`
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