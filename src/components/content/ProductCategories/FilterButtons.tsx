'use client';

import Icon from '@/components/common/Icon';
import { useFilters } from '@/components/content/ProductCategories/Context';
import { MARKET_SEGMENTS_QUERYResult } from '@/lib/sanity/types';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useTransition } from 'react';

export default function FilterButtons({
  marketSegments,
}: {
  marketSegments: MARKET_SEGMENTS_QUERYResult;
}) {
  const { filters, setFilters } = useFilters();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (pathname) {
      const params = new URLSearchParams();

      if (filters.marketSegment) {
        params.set('segment', filters.marketSegment);
      }

      if (searchParams.get('segment') !== params.get('segment')) {
        startTransition(() =>
          router.push(
            `${pathname}?${params.toString()}${window.location.hash}`,
            {
              scroll: false,
              // @ts-expect-error 'shallow' does not exist in type 'NavigateOptions'
              shallow: true,
            },
          ),
        );
      }
    }
  }, [filters, pathname, router, searchParams]);

  if (!marketSegments.length) {
    return null;
  }

  return (
    <div
      className="mx-auto mb-10 flex max-w-4xl flex-wrap gap-x-4 gap-y-3"
      data-pending={isPending ? '' : undefined}
    >
      {marketSegments.map((segment) => (
        <button
          type="button"
          className={clsx(
            filters.marketSegment === segment.slug
              ? 'bg-cyan-100 text-cyan-700'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900',
            'flex items-center gap-x-2 rounded-md px-3.5 py-2.5 text-sm font-medium',
          )}
          key={segment._id}
          title={
            filters.marketSegment === segment.slug
              ? `Remove filter for ${segment.name} security product categories`
              : `View only ${segment.name} security product categories`
          }
          onClick={() =>
            setFilters({ type: 'marketSegment', slug: segment.slug })
          }
        >
          <span className="h-5 w-5" aria-hidden="true">
            <Icon name={segment.icon} className="h-full w-full" />
          </span>
          {segment.name}
        </button>
      ))}
    </div>
  );
}
