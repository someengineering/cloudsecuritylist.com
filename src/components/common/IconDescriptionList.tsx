import { isExternalLink } from '@/utils/link';
import { slugify } from '@/utils/slug';
import Link from 'next/link';
import { ComponentType } from 'react';
import { IconBaseProps, IconType } from 'react-icons/lib';

export default async function IconDescriptionList({
  items,
}: {
  items: {
    title: string;
    titleDescription?: string;
    slug?: string;
    href?: string;
    description: string;
    icon: IconType | ComponentType<IconBaseProps>;
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
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-600">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
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
                {item.titleDescription ? ` (${item.titleDescription})` : null}
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
