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
  title?: string;
  description?: string;
  eyebrow?: string;
  links?: {
    label: string;
    href: string;
    props?: { target?: string; rel?: string };
    icon: IconType;
  }[];
  image?: string;
}) {
  if (!title) {
    return null;
  }

  return (
    <section className="px-6 py-12 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        {image ? (
          <h1 className="relative mb-8 h-20">
            <Image
              src={image}
              fill={true}
              alt=""
              aria-hidden="true"
              className="mx-auto object-contain"
            />
          </h1>
        ) : (
          <>
            {eyebrow ? (
              <p className="mb-2 text-lg font-semibold text-cyan-600 sm:text-2xl">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {title}
            </h1>
          </>
        )}
        {description ? (
          <p className="mt-6 max-w-prose text-pretty text-lg leading-8 text-gray-600">
            {description}
          </p>
        ) : null}
        {(links ?? []).length > 0 ? (
          <ul role="list" className="mt-8 flex justify-center gap-x-6">
            {links?.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  {...link.props}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">{link.label}</span>
                  <link.icon className="h-8 w-8" title={link.label} />
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}