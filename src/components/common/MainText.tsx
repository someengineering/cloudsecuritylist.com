import { isExternalLink, transformUrl } from '@/utils/link';
import { slugify } from '@/utils/slug';
import { PortableText } from '@portabletext/react';
import { PortableTextBlock } from '@portabletext/types';
import Link from 'next/link';

export default function MainText({
  title,
  blocks,
  lastUpdated,
  nofollowLinks,
}: {
  title: string;
  blocks: PortableTextBlock[];
  lastUpdated?: string;
  nofollowLinks?: boolean;
}) {
  const slug = slugify(title);

  return (
    <section
      className="mx-auto max-w-3xl px-6 py-12 leading-7 text-gray-700 sm:py-16 lg:px-8"
      aria-labelledby={slug}
    >
      <h1
        className={
          blocks[0].style === 'h2'
            ? 'mb-2 text-lg font-semibold text-cyan-600 sm:text-xl'
            : 'mb-6 text-pretty text-3xl font-bold tracking-tight text-gray-900 xs:text-4xl sm:text-5xl'
        }
        id={slug}
      >
        {title}
      </h1>
      <PortableText
        value={blocks}
        components={{
          block: {
            normal: ({ children }) => (
              <p className="mb-8 max-w-2xl last:mb-0 first-of-type:mb-10 first-of-type:text-xl first-of-type:leading-8">
                {children}
              </p>
            ),
            ...(blocks[0].style === 'h2'
              ? {
                  h2: ({ children }) => (
                    <h2 className="mb-6 text-pretty text-3xl font-bold tracking-tight text-gray-900 xs:text-4xl sm:text-5xl">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3
                      className="mb-6 mt-10 text-pretty text-xl font-bold tracking-tight text-gray-900 xs:text-2xl sm:text-3xl"
                      id={slugify(children?.toString())}
                    >
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4
                      className="mb-6 mt-10 text-pretty text-xl font-bold tracking-tight text-gray-900 sm:text-2xl"
                      id={slugify(children?.toString())}
                    >
                      {children}
                    </h4>
                  ),
                }
              : {
                  h2: ({ children }) => (
                    <h2
                      className="mb-6 mt-10 text-pretty text-xl font-bold tracking-tight text-gray-900 xs:text-2xl sm:text-3xl"
                      id={slugify(children?.toString())}
                    >
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3
                      className="mb-6 mt-10 text-pretty text-xl font-bold tracking-tight text-gray-900 sm:text-2xl"
                      id={slugify(children?.toString())}
                    >
                      {children}
                    </h3>
                  ),
                }),
          },

          list: {
            bullet: ({ children }) => (
              <ul className="-mt-4 mb-8 ml-8 list-disc space-y-2">
                {children}
              </ul>
            ),
            number: ({ children }) => (
              <ol className="-mt-4 mb-8 ml-8 list-decimal space-y-2">
                {children}
              </ol>
            ),
          },

          marks: {
            link: async ({ children, value }) => {
              const href = await transformUrl(value.href);

              return (
                <Link
                  href={href}
                  {...((await isExternalLink(href))
                    ? {
                        target: '_blank',
                        rel: `noopener noreferrer${nofollowLinks ? ' nofollow' : ''}`,
                      }
                    : { rel: nofollowLinks ? 'nofollow' : undefined })}
                  className="font-semibold text-cyan-600 hover:text-cyan-700"
                >
                  {children}
                </Link>
              );
            },
          },
        }}
      />
      {lastUpdated ? (
        <p className="mt-8 max-w-2xl">
          Last updated:{' '}
          {new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(new Date(lastUpdated))}
        </p>
      ) : null}
    </section>
  );
}
