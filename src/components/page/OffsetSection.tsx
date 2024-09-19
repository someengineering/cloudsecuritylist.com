import { slugify } from '@/utils/slug';

export default async function OffsetSection({
  title,
  slug,
  children,
}: {
  title: string;
  slug?: string;
  children: React.ReactNode;
}) {
  if (!title) {
    return null;
  }

  return (
    <section
      className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8"
      aria-labelledby="product-categories"
    >
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-8 sm:gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <h2
          className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          id={slug ? slug : slugify(title)}
        >
          {title}
        </h2>
        <div className="col-span-2">{children}</div>
      </div>
    </section>
  );
}
