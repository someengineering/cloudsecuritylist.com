import { withPlausibleProxy } from 'next-plausible';

const nextConfig = withPlausibleProxy()(
  /** @type {import('next').NextConfig} */
  {
    env: {
      SC_DISABLE_SPEEDY: 'false',
    },

    eslint: {
      dirs: ['src'],
    },

    reactStrictMode: true,
    swcMinify: true,

    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.sanity.io',
        },
      ],
    },

    async redirects() {
      return [
        {
          source: '/categories/:slug',
          destination: '/category/:slug',
          permanent: true,
        },
        {
          source: '/(organizations|vendors?)/:slug',
          destination: '/organization/:slug',
          permanent: true,
        },
        {
          source: '/providers/:slug',
          destination: '/provider/:slug',
          permanent: true,
        },
      ];
    },

    webpack(config) {
      // Grab the existing rule that handles SVG imports
      const fileLoaderRule = config.module.rules.find((rule) =>
        rule.test?.test?.('.svg'),
      );

      config.module.rules.push(
        // Reapply the existing rule, but only for svg imports ending in ?url
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/, // *.svg?url
        },
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /icon/, // icon.svg
        },
        // Convert all other *.svg imports to React components
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: {
            not: [...fileLoaderRule.resourceQuery.not, /url/, /icon/],
          }, // exclude if *.svg?url or icon.svg
          loader: '@svgr/webpack',
          options: {
            dimensions: false,
            titleProp: true,
          },
        },
      );

      // Modify the file loader rule to ignore *.svg, since we have it handled now.
      fileLoaderRule.exclude = /\.svg$/i;

      return config;
    },

    experimental: {
      taint: true,
      webpackBuildWorker: true,
    },
  },
);

export default nextConfig;
