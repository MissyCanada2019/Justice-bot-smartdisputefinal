/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
<<<<<<< HEAD
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
=======
       protocol: 'https',
       hostname: 'cdn.sanity.io',
       port: '',
       pathname: '/images/**',
     },
     {
       protocol: 'https',
       hostname: 'placehold.co',
       port: '',
       pathname: '/**',
     },
   ],
 },
  webpack: (config, { isServer }) => {
    config.externals = config.externals || [];
    config.externals.push('require-in-the-middle');
    return config;
  },
}; // Make sure this closing brace is present and correctly placed
>>>>>>> 6004d43f (The NextJS app server is having trouble starting. Please identify what c)

module.exports = nextConfig;
