import { PRODUCT_CATEGORIES_QUERYResult } from '@/lib/sanity/types';
import { toSentenceCase } from '@/utils/string';
import Link from 'next/link';

export default function List({
  productCategories,
}: {
  productCategories: PRODUCT_CATEGORIES_QUERYResult;
}) {
  if (!productCategories.length) {
    return null;
  }

  return (
    <dl className="mx-auto max-w-5xl space-y-8 divide-y divide-gray-900/10">
      {productCategories.map((category) => (
        <div
          key={category._id}
          className="relative pt-8 leading-7 md:grid md:grid-cols-4 md:gap-8"
        >
          <dt className="col-span-1">
            <Link
              href={`/category/${category.slug}`}
              className="text-xl font-semibold text-cyan-600 hover:text-cyan-700 focus:outline-none md:block"
            >
              <span aria-hidden="true" className="absolute inset-0" />
              {toSentenceCase(category.name)}
            </Link>
            {category.expansion ? (
              <span className="ml-2 text-cyan-900 md:ml-0 md:mt-1 md:block">
                {' '}
                ({category.expansion})
              </span>
            ) : null}
          </dt>
          <dd className="mt-4 text-gray-600 md:col-span-3 md:mt-0.5">
            <p>{category.description}</p>
          </dd>
        </div>
      ))}
    </dl>
  );
}
