import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/monaco-parfums-web",
  assetPrefix: "/monaco-parfums-web/",
};

export default nextConfig;
