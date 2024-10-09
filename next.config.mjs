import { withPlausibleProxy } from 'next-plausible';
import { createClient, groq } from 'next-sanity';
import speakingurl from 'speakingurl';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion:
    process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
    new Date().toISOString().split('T')[0],
  useCdn: false,
});

const slugify = (value) => {
  const slugifyOpts = { truncate: 200, symbols: true };
  return value ? speakingurl(value, slugifyOpts) : '';
};

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
        { protocol: 'https', hostname: 'cdn.sanity.io' },
        { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      ],
    },

    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains; preload',
            },
          ],
        },
      ];
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
        ...(
          await sanityClient.fetch(
            groq`*[_type == "cloudProvider" && defined(abbreviation)] {
              "slug": slug.current,
              name,
              abbreviation,
            }`,
          )
        ).map(({ slug, name, abbreviation }) => ({
          source: `/provider/(${slugify(name)}-)?${slugify(abbreviation)}`,
          destination: `/provider/${slug}`,
          permanent: true,
        })),
        ...(
          await sanityClient.fetch(
            groq`*[_type == "productCategory" && defined(expansion)] {
              "slug": slug.current,
              name,
              expansion
            }`,
          )
        ).map(({ slug, name, expansion }) => ({
          source: `/category/${slugify(expansion)}(-${slugify(name)})?`,
          destination: `/category/${slug}`,
          permanent: true,
        })),
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

    compiler: {
      reactRemoveProperties:
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'production',
      removeConsole: process.env.NEXT_PUBLIC_VERCEL_ENV === 'production',
    },

    experimental: {
      taint: true,
      webpackBuildWorker: true,
    },
  },
);

export default nextConfig;
