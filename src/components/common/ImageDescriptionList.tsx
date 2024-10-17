import { isExternalLink } from '@/utils/link';
import { slugify } from '@/utils/slug';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

export default async function ImageDescriptionList({
  items,
}: {
  items: {
    title: string;
    titleDescription?: string | React.JSX.Element;
    slug?: string;
    href?: string;
    description: string;
    imageSrc?: string;
  }[];
}) {
  if (!items.length) {
    return null;
  }

  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
      {await Promise.all(
        items.map(async (item) => {
          const slug = item.slug ?? slugify(item.title);

          return (
            <div key={slug} id={slug} className="group relative">
              <dt className="text-gray-900">
                {item.imageSrc ? (
                  <Image
                    src={item.imageSrc}
                    width={64}
                    height={64}
                    alt=""
                    aria-hidden="true"
                    className={clsx(
                      'mb-4 h-10 w-10',
                      new URL(item.imageSrc).hostname.endsWith(
                        'avatars.githubusercontent.com',
                      ) && 'rounded',
                    )}
                  />
                ) : (
                  <div className="mb-4 h-10 w-10 flex-shrink-0 rounded bg-slate-100" />
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    {...((await isExternalLink(item.href))
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : null)}
                    className="text-lg font-semibold leading-8 text-cyan-600 focus:outline-none group-hover:text-cyan-700"
                  >
                    <span aria-hidden="true" className="absolute inset-0" />
                    {item.title}
                  </Link>
                ) : (
                  <span className="text-lg font-semibold leading-8">
                    {item.title}
                  </span>
                )}
                {item.titleDescription ? <> {item.titleDescription}</> : null}
              </dt>
              <dd className="mt-2 max-w-prose leading-7 text-gray-600">
                {item.description}
              </dd>
            </div>
          );
        }),
      )}
    </dl>
  );
}
