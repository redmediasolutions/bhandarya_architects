const images = import.meta.glob(
  "../assets/projects/residential/**/*.{webp,jpg,jpeg,png,avif}",
  {
    eager: true,
    import: "default",
  }
);

export function getProjectHero(folder: string) {
  return images[
    `../assets/projects/residential/${folder}/hero.webp`
  ] as string;
}

export function getProjectGallery(folder: string) {
  return Object.entries(images)
    .filter(([path]) =>
      path.includes(`/residential/${folder}/gallery/`)
    )
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, image]) => image as string);
}

export function getConstructionGallery(folder: string) {
  return Object.entries(images)
    .filter(([path]) =>
      path.includes(`/residential/${folder}/construction/`)
    )
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, image]) => image as string);
}