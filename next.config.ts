import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "optcgapi.com",
      },
      {
        protocol: "https",
        hostname: "en.onepiece-cardgame.com",
      },
    ],
  },
};

export default nextConfig;
