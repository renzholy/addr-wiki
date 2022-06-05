/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/icons/(.*)",
        headers: [
          {
            key: "cache-control",
            value: "public, max-age=43200, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
