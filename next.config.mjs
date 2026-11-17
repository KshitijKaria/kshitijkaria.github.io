/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",        // static export → deployable straight to GitHub Pages
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
