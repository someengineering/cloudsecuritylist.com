'use client';

import { PRODUCT_CATEGORIES_QUERYResult } from '@/lib/sanity/types';
import { toSentenceCase } from '@/utils/string';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';

export default function List({
  initialData,
  fetchMore,
  paginated = true,
}: {
  initialData: PRODUCT_CATEGORIES_QUERYResult;
  fetchMore: (prev: string) => Promise<PRODUCT_CATEGORIES_QUERYResult>;
  paginated?: boolean;
}) {
  const [productCategories, setProductCategories] =
    useState<PRODUCT_CATEGORIES_QUERYResult>(initialData);
  const [lastItem, setLastItem] = useState<string | undefined>(
    initialData[initialData.length - 1]?.name,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const [sentryRef] = useInfiniteScroll({
    loading: loading,
    hasNextPage: paginated && !!lastItem,
    onLoadMore: async () => {
      setLoading(true);

      if (lastItem) {
        const data = await fetchMore(lastItem);

        if (!data) {
          setError(true);
          return;
        }

        if (data.length && data[data.length - 1].name !== lastItem) {
          setLastItem(data[data.length - 1].name);
          setProductCategories([...productCategories, ...data]);
        } else {
          setLastItem(undefined);
        }
      }

      setLoading(false);
    },
    disabled: !paginated || error,
  });

  useEffect(() => {
    setProductCategories(initialData);
    setLastItem(
      initialData.length ? initialData[initialData.length - 1].name : undefined,
    );
  }, [initialData]);

  if (!productCategories.length) {
    return null;
  }

  return (
    <dl className="mx-auto max-w-4xl space-y-8 divide-y divide-gray-900/10 group-has-[[data-pending]]:animate-pulse">
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
      {paginated && !error && (loading || lastItem) ? (
        <div ref={sentryRef} className="pt-8" aria-hidden="true">
          <div className="animate-pulse md:grid md:grid-cols-4 md:gap-8">
            <div className="col-span-1">
              <div className="h-6 w-3/4 bg-slate-200" />
            </div>
            <div className="mt-4 space-y-3.5 md:col-span-3 md:mt-1.5">
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-1 h-4 rounded bg-slate-200" />
                <div className="col-span-2 h-4 rounded bg-slate-200" />
                <div className="col-span-2 h-4 rounded bg-slate-200" />
              </div>
              <div className="h-4 w-1/2 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      ) : null}
    </dl>
  );
}
