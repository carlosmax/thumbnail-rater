/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "dusty-stoat-819.convex.cloud"
      },
      {
        hostname: "dusty-stoat-819.convex.site"
      }
    ]
  }
};

export default nextConfig;
