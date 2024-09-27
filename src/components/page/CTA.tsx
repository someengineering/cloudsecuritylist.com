import Link from 'next/link';

export default async function PageHeader({
  heading,
  description,
  primaryButton,
  secondaryButton,
}: {
  heading: string;
  description: string;
  primaryButton?: {
    label: string;
    href: string;
    props?: { target?: string; rel?: string };
  };
  secondaryButton?: {
    label: string;
    href: string;
    props?: { target?: string; rel?: string };
  };
}) {
  return (
    <section className="mx-auto mb-12 max-w-7xl sm:mb-16">
      <div className="relative isolate mx-8 max-w-7xl overflow-hidden rounded-3xl bg-cyan-50 p-8 text-center text-gray-900 shadow-sm lg:flex lg:items-center lg:justify-between lg:p-12 lg:text-left">
        <div>
          <h2 className="mx-auto max-w-prose text-pretty text-2xl font-bold tracking-tight sm:text-3xl">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-prose text-pretty leading-7 lg:mt-2">
            {description}
          </p>
        </div>
        <div className="mt-6 flex items-center justify-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
          {primaryButton ? (
            <Link
              href={primaryButton.href}
              className="rounded-md bg-cyan-600 px-3.5 py-2.5 font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
            >
              {primaryButton.label}
            </Link>
          ) : null}
          {secondaryButton ? (
            <Link
              href={secondaryButton.href}
              className="font-semibold leading-6 text-cyan-700 hover:text-cyan-900"
            >
              {secondaryButton.label} <span aria-hidden="true">&rarr;</span>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
