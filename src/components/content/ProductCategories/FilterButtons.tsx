'use client';

import { useFilters } from '@/components/content/ProductCategories/Context';
import { MARKET_SEGMENTS_QUERYResult } from '@/lib/sanity/types';
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
    <div className="mx-auto max-w-4xl px-6 py-3 lg:px-8">
      <div className="isolate flex rounded-md shadow-sm">
        {marketSegments.map((marketSegment, idx) => (
          <button
            type="button"
            className={clsx(
              'relative flex grow basis-0 items-center justify-center px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-10',
              idx === 0 && 'rounded-l-md',
              idx !== 0 && '-ml-px',
              idx === marketSegments.length - 1 && 'rounded-r-md',
              filters.marketSegment !== marketSegment.slug &&
                'bg-white text-gray-900 hover:bg-cyan-50',
              filters.marketSegment === marketSegment.slug &&
                'bg-cyan-100 text-cyan-900 hover:bg-cyan-200',
            )}
            key={marketSegment._id}
            onClick={() =>
              setFilters({ type: 'marketSegment', slug: marketSegment.slug })
            }
          >
            {marketSegment.name}
          </button>
        ))}
      </div>
    </div>
  );
}
