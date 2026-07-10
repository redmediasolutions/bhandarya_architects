import type { ImageMetadata } from "astro";

const galleries = import.meta.glob<ImageMetadata>(
    "../assets/projects/residential/**/gallery/*.{webp,jpg,jpeg,png,avif}",
    {
        eager: true,
        import: "default"
    }
);

const constructions = import.meta.glob<ImageMetadata>(
    "../assets/projects/residential/**/construction/*.{webp,jpg,jpeg,png,avif}",
    {
        eager: true,
        import: "default"
    }
);

const heroes = import.meta.glob<ImageMetadata>(
    "../assets/projects/residential/**/hero.{webp,jpg,jpeg,png,avif}",
    {
        eager: true,
        import: "default"
    }
);

export function getResidentialImages(folder: string) {

    return {

        hero: heroes[
            `../assets/projects/residential/${folder}/hero.webp`
        ] as ImageMetadata,

        gallery: Object.entries(galleries)
            .filter(([path]) =>
                path.includes(`/${folder}/gallery/`)
            )
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([, image]) => image),

        construction: Object.entries(constructions)
            .filter(([path]) =>
                path.includes(`/${folder}/construction/`)
            )
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([, image]) => image)

    };

}