import { isExternalLink, transformUrl } from '@/utils/link';
import { PortableText } from '@portabletext/react';
import { PortableTextBlock } from '@portabletext/types';
import Image from 'next/image';
import Link from 'next/link';
import { IconType } from 'react-icons/lib';

export default async function PageHeader({
  title,
  description,
  eyebrow,
  links,
  image,
}: {
  title: string | PortableTextBlock;
  description?: string | PortableTextBlock[];
  eyebrow?: string;
  links?: {
    label: string;
    href: string;
    icon: IconType;
  }[];
  image?: string;
}) {
  if (!title) {
    return null;
  }

  return (
    <section className="px-6 py-12 text-center sm:py-16 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {image ? (
          <div className="relative mb-6 h-20">
            <Image
              src={image}
              fill={true}
              alt=""
              aria-hidden="true"
              className="mx-auto max-w-52 object-contain"
            />
          </div>
        ) : eyebrow ? (
          <p className="mb-2 text-xl font-semibold text-cyan-600 sm:text-2xl">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 xs:text-5xl sm:text-6xl">
          {typeof title === 'string' ? (
            title
          ) : (
            <PortableText
              value={title}
              components={{
                block: {
                  normal: ({ children }) => children,
                },
                marks: {
                  strong: ({ children }) => (
                    <span className="bg-gradient-to-br from-cyan-600 to-cyan-700 bg-clip-text font-extrabold text-transparent">
                      {children}
                    </span>
                  ),
                  underline: ({ children }) => (
                    <span className="underline-offset-3 underline decoration-cyan-600 decoration-8">
                      {children}
                    </span>
                  ),
                },
              }}
            />
          )}
        </h1>
        {typeof description === 'string' ? (
          <p className="mx-auto mt-6 max-w-prose text-balance leading-7 text-gray-700 sm:text-lg">
            {description}
          </p>
        ) : Array.isArray(description) ? (
          <div className="mx-auto mt-6 max-w-prose space-y-1.5 leading-7 text-gray-700 sm:text-lg">
            <PortableText
              value={description}
              components={{
                block: {
                  normal: ({ children }) => (
                    <p className="text-balance">{children}</p>
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
              }}
            />
          </div>
        ) : null}
      </div>
      {links?.length ? (
        <ul role="list" className="mt-8 flex justify-center gap-x-6">
          {await Promise.all(
            links.map(async (link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  {...((await isExternalLink(link.href))
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : null)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">{link.label}</span>
                  <link.icon className="h-8 w-8" title={link.label} />
                </Link>
              </li>
            )),
          )}
        </ul>
      ) : null}
    </section>
  );
}
