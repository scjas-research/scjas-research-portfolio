import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/scjas-research-portfolio",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
