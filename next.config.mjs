/** @type {import('next').NextConfig} */
const nextConfig = {
  // The repository preview lives under /vridhi_ai_growth. When the custom
  // domain is connected, set GITHUB_PAGES_BASE_PATH to an empty string.
  basePath: process.env.GITHUB_PAGES_BASE_PATH ?? '/vridhi_ai_growth',
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
