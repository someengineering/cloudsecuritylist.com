'use client';

import { useFilters } from '@/components/content/ProductCategories/Context';
import { MARKET_SEGMENTS_QUERYResult } from '@/lib/sanity/types';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { clsx } from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FilterButtons({
  marketSegments,
}: {
  marketSegments: MARKET_SEGMENTS_QUERYResult;
}) {
  const { filters, setFilters } = useFilters();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.marketSegment) {
      params.set('segment', filters.marketSegment);
    }

    router.push(`${pathname}?${params.toString()}${window.location.hash}`);
  }, [filters, pathname, router]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-3 lg:px-8">
      <div className="isolate grid grid-cols-2 overflow-hidden rounded-md shadow-sm sm:grid-cols-3 lg:grid-cols-7">
        {marketSegments.map((marketSegment, idx) => (
          <button
            type="button"
            className={clsx(
              'group relative flex items-center justify-center text-ellipsis px-3 py-2 text-base font-semibold ring-1 ring-inset ring-gray-300 focus:z-10 lg:px-1.5 lg:text-sm',
              filters.marketSegment !== marketSegment.slug &&
                'bg-white text-gray-900 hover:bg-cyan-100',
              filters.marketSegment === marketSegment.slug &&
                'bg-cyan-50 text-cyan-900',
              idx === 0 && 'rounded-tl-md lg:rounded-l-md',
              idx === 1 && 'rounded-tr-md sm:rounded-none',
              idx > 1 && '-mt-px',
              idx === 2 && 'sm:mt-0 sm:rounded-tr-md lg:rounded-none',
              idx > 2 && 'sm:-mt-px',
              idx > 1 && 'lg:mt-0',
              idx % 2 > 0 && '-ml-px',
              idx % 2 > 0 && idx % 3 === 0 && 'sm:ml-0',
              idx % 3 > 0 && 'sm:-ml-px',
              idx % 3 === 0 && idx > 0 && 'lg:-ml-px',
              idx === marketSegments.length - 2 &&
                idx % 3 === 0 &&
                'sm:rounded-bl-md lg:rounded-none',
              idx === marketSegments.length - 1 &&
                'lg:rounded-r-md lg:rounded-bl-none',
              idx === marketSegments.length - 1 &&
                idx % 2 === 0 &&
                'col-span-2 rounded-b-md',
              idx === marketSegments.length - 1 &&
                ((idx % 3 === 0 && 'sm:col-span-3 sm:rounded-b-md') ||
                  (idx % 3 === 1 && 'sm:col-span-2')),
              idx === marketSegments.length - 1 &&
                idx % 3 > 0 &&
                'sm:rounded-br-md',
              idx === marketSegments.length - 1 &&
                (idx % 2 === 0 || idx % 3 < 2) &&
                'lg:col-span-1',
            )}
            key={marketSegment._id}
            title={
              filters.marketSegment === marketSegment.slug
                ? `Remove filter for ${marketSegment.name} security product categories`
                : `View only ${marketSegment.name} security product categories`
            }
            onClick={() =>
              setFilters({ type: 'marketSegment', slug: marketSegment.slug })
            }
          >
            {marketSegment.name}
            {filters.marketSegment === marketSegment.slug ? (
              <span className="absolute inset-y-auto right-3 h-4 w-4 rounded-full p-0.5 text-cyan-600 group-hover:bg-cyan-100 group-hover:text-cyan-700 lg:right-1.5">
                <XMarkIcon className="h-3 w-3" />
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
