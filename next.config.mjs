/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Game thumbnails come from external CDNs (GamePix / GameDistribution etc.)
    remotePatterns: [
      { protocol: "https", hostname: "**.gamepix.com" },
      { protocol: "https", hostname: "**.gamedistribution.com" },
      { protocol: "https", hostname: "**.gamemonetize.com" },
      { protocol: "https", hostname: "img.gamedistribution.com" },
      { protocol: "https", hostname: "**" }, // relax during setup; tighten for prod
    ],
  },
};

export default nextConfig;
