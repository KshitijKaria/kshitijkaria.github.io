export const dynamic = "force-static";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://kshitijkaria.github.io/sitemap.xml",
  };
}
