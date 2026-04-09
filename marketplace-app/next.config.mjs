/** @type {import('next').NextConfig} */
import path from "path";

const nextConfig = {
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@": path.resolve(process.cwd()),
    };
    return config;
  },
};

export default nextConfig;
