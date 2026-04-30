import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.gradconnect.ng",
      },
      // Add other origins as needed (e.g. company logos from their own domains)
    ],
  },
  experimental: {},
  compiler: {},
};

export default nextConfig;