export const dynamic = "force-static";

export default function sitemap() {
  return [
    {
      url: "https://kshitijkaria.github.io/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://kshitijkaria.github.io/projects/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
