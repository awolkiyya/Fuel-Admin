import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  output:"standalone",

  // --------------------------------------------------------
  // SECURITY
  // --------------------------------------------------------
  // Prevent Next.js from exposing:
  // X-Powered-By: Next.js
  poweredByHeader: false,

  async rewrites() {

    const base = process.env.API_BASE_URL;


    return [

      {
        source:"/api/cameras/:id/stream",
        destination:"/api/cameras/:id/stream",
      },

      {
        source:"/api/:path*",
        destination:`${base}/api/:path*`,
      },

    ];
  },
};

export default nextConfig;