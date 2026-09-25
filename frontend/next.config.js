const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: "https://medical-report-intelligence-bfsk.vercel.app/api/v1/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
