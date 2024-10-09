import { isExternalLink, transformUrl } from '@/utils/link';
import { slugify } from '@/utils/slug';
import { PortableText, PortableTextReactComponents } from '@portabletext/react';
import { PortableTextBlock } from '@portabletext/types';
import Link from 'next/link';

const components: Partial<PortableTextReactComponents> = {
  block: {
    normal: ({ children }) => (
      <p className="mb-8 max-w-2xl last:mb-0 first-of-type:mb-10 first-of-type:mt-6 first-of-type:text-xl first-of-type:leading-8">
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1 className="text-pretty text-3xl font-bold tracking-tight text-gray-900 xs:text-4xl sm:text-5xl">
        {children}
      </h1>
    ),
  },

  marks: {
    link: async ({ children, value }) => {
      const href = await transformUrl(value.href);

      return (
        <Link
          href={href}
          {...((await isExternalLink(href))
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : null)}
          className="font-semibold text-cyan-600 hover:text-cyan-700"
        >
          {children}
        </Link>
      );
    },
  },
};

export default async function MainText({
  title,
  blocks,
}: {
  title: string;
  blocks: PortableTextBlock[];
}) {
  const slug = slugify(title);

  return (
    <section
      className="mx-auto max-w-3xl px-6 py-12 leading-7 text-gray-700 sm:py-16 lg:px-8"
      aria-labelledby={slug}
    >
      <h1
        className="mb-2 text-lg font-semibold text-cyan-600 sm:text-xl"
        id={slug}
      >
        {title}
      </h1>
      <PortableText value={blocks} components={components} />
    </section>
  );
}
