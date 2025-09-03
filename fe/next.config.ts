import { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    images: {
        domains: ["localhost", "127.0.0.1", "booking-api.hau.io.vn"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "booking-api.hau.io.vn",
            },
        ],
    },
    env: {
        NEXT_PUBLIC_API_URL:
            process.env.NEXT_PUBLIC_API_URL ||
            "https://booking-api.hau.io.vn/api",
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
