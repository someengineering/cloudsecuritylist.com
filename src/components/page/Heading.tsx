import Link from 'next/link';

export default async function PageHeading({
  title,
  description,
  eyebrow,
  links,
}: {
  title?: string;
  description?: string;
  eyebrow?: string;
  links?: {
    label: string;
    href: string;
    icon: (
      props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
    ) => React.JSX.Element;
  }[];
}) {
  if (!title) {
    return null;
  }

  return (
    <div className="px-6 py-12 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        {eyebrow ? (
          <p className="text-base font-semibold leading-7 text-cyan-600">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-6 text-lg leading-8 text-gray-600">{description}</p>
        ) : null}
        <ul role="list" className="mt-8 flex justify-center gap-x-6">
          {links?.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <link.icon className="h-8 w-8" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
