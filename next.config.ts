import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },

  turbopack: {
    root: __dirname,
  },

  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;