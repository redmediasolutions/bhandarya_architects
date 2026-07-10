export async function loadImage(path: string) {

    const modules = import.meta.glob(
        "../assets/projects/**/*.{jpg,jpeg,png,webp,avif}",
        {
            eager: true,
            import: "default"
        }
    );

    const match = Object.entries(modules).find(([key]) =>
        key.endsWith(path)
    );

    return match ? (match[1] as string) : null;

}