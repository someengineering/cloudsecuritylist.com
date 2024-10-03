import { transformUrl } from '@/utils/link';
import { slugify } from '@/utils/slug';
import { PortableText, PortableTextReactComponents } from '@portabletext/react';
import { PortableTextBlock } from '@portabletext/types';
import Link from 'next/link';

const components: Partial<PortableTextReactComponents> = {
  block: {
    normal: ({ children }) => <p className="mb-6">{children}</p>,
  },

  marks: {
    link: async ({ children, value }) => {
      const href = await transformUrl(value.href);

      return (
        <Link
          href={href}
          target={href.startsWith('/') ? undefined : '_blank'}
          rel={href.startsWith('/') ? undefined : 'noopener noreferrer'}
          className="font-semibold text-cyan-600 hover:text-cyan-700"
        >
          {children}
        </Link>
      );
    },
  },
};

export default async function Content({
  heading,
  portableTextBlocks,
}: {
  heading: string;
  portableTextBlocks: PortableTextBlock[];
}) {
  const slug = slugify(heading);

  return (
    <section
      className="mb-12 bg-cyan-50/75 py-12 shadow-sm sm:mb-16 sm:py-16"
      aria-labelledby={slug}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2
          className="max-w-3xl text-pretty text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
          id="slug"
        >
          {heading}
        </h2>
        <div className="mt-10 columns-md gap-8 leading-7 text-gray-700">
          <PortableText value={portableTextBlocks} components={components} />
        </div>
      </div>
    </section>
  );
}
