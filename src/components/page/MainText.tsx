import { isExternalLink, transformUrl } from '@/utils/link';
import { slugify } from '@/utils/slug';
import { PortableText } from '@portabletext/react';
import { PortableTextBlock } from '@portabletext/types';
import Link from 'next/link';

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
      {blocks[0].style === 'h2' ? (
        <h1
          className="mb-2 text-lg font-semibold text-cyan-600 sm:text-xl"
          id={slug}
        >
          {title}
        </h1>
      ) : (
        <h1
          className="text-pretty text-3xl font-bold tracking-tight text-gray-900 xs:text-4xl sm:text-5xl"
          id={slug}
        >
          {title}
        </h1>
      )}
      <PortableText
        value={blocks}
        components={{
          block: {
            normal: ({ children }) => (
              <p className="mb-8 max-w-2xl last:mb-0 first-of-type:mb-10 first-of-type:mt-6 first-of-type:text-xl first-of-type:leading-8">
                {children}
              </p>
            ),
            ...(blocks[0].style === 'h2'
              ? {
                  h2: ({ children }) => (
                    <h2 className="text-pretty text-3xl font-bold tracking-tight text-gray-900 xs:text-4xl sm:text-5xl">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-pretty text-2xl font-bold tracking-tight text-gray-900 xs:text-3xl sm:text-4xl">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-pretty text-xl font-bold tracking-tight text-gray-900 xs:text-2xl sm:text-3xl">
                      {children}
                    </h4>
                  ),
                  h5: ({ children }) => (
                    <h5 className="text-pretty text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                      {children}
                    </h5>
                  ),
                }
              : {
                  h2: ({ children }) => (
                    <h2 className="text-pretty text-2xl font-bold tracking-tight text-gray-900 xs:text-3xl sm:text-4xl">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-pretty text-xl font-bold tracking-tight text-gray-900 xs:text-2xl sm:text-3xl">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-pretty text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                      {children}
                    </h4>
                  ),
                }),
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
        }}
      />
    </section>
  );
}
