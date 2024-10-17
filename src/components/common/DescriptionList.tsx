import { isExternalLink } from '@/utils/link';
import { slugify } from '@/utils/slug';
import Link from 'next/link';

export default async function DescriptionList({
  items,
}: {
  items: {
    title: string;
    titleDescription?: string | React.JSX.Element;
    slug?: string;
    href?: string;
    description: string;
  }[];
}) {
  if (!items.length) {
    return null;
  }

  return (
    <dl className="space-y-16">
      {await Promise.all(
        items.map(async (item) => {
          const slug = item.slug ?? slugify(item.title);

          return (
            <div key={slug} id={slug} className="group relative">
              <dt className="text-gray-900">
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
