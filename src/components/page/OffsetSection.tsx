import { slugify } from '@/utils/slug';

export default async function OffsetSection({
  heading,
  slug,
  children,
}: {
  heading: string;
  slug?: string;
  children: React.ReactNode;
}) {
  if (!heading) {
    return null;
  }

  const headingId = slug ? slug : slugify(heading);

  return (
    <section
      className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8"
      aria-labelledby={headingId}
    >
      <div className="mx-auto grid grid-cols-1 gap-x-8 gap-y-8 sm:gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <h2
          className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
          id={headingId}
        >
          {heading}
        </h2>
        <div className="col-span-2">{children}</div>
      </div>
    </section>
  );
}
