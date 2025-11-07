/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // enables static site export
  images: {
    domains: [
      'testify.ng',
      'gazettengr.com',
      'drive.google.com',
      'lh3.googleusercontent.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
