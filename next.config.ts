import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable HTTPS in development
  experimental: {
    httpsServer: true,
  },
};

export default nextConfig;
