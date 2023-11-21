/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "ipfs.io",
      "d1a370nemizbjq.cloudfront.net",
      "models.readyplayer.me",
      "renderapi.s3.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
