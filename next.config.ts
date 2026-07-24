import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  output: "standalone",


  async rewrites() {

    const base = process.env.API_BASE_URL;


    return [
      {
        source: "/api/:path*",
        destination: `${base}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;