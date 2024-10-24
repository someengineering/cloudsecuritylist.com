'use client';

import Icon from '@/components/common/Icon';
import { useFilters } from '@/components/content/ProductCategories/Context';
import { MARKET_SEGMENTS_QUERYResult } from '@/lib/sanity/types';
import clsx from 'clsx';
import { debounce } from 'lodash';
import { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useTransition } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';

export default function FilterPanel({
  marketSegments,
}: {
  marketSegments: MARKET_SEGMENTS_QUERYResult;
}) {
  const { filters, setFilters } = useFilters();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const debouncedRouterPush = useMemo(
    () =>
      debounce(
        (href: string, options?: NavigateOptions) =>
          startTransition(() => router.push(href, options)),
        300,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (pathname) {
      const params = new URLSearchParams();

      if (filters.marketSegment) {
        params.set('segment', filters.marketSegment);
      }

      if (filters.searchQuery) {
        params.append('q', filters.searchQuery);
      }

      if (
        searchParams.get('q') !== params.get('q') ||
        searchParams.get('segment') !== params.get('segment')
      ) {
        startTransition(() =>
          debouncedRouterPush(
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
  }, [debouncedRouterPush, filters, pathname, router, searchParams]);

  if (!marketSegments.length) {
    return null;
  }

  return (
    <div
      className="mx-auto mb-10 max-w-4xl"
      data-pending={isPending ? '' : undefined}
    >
      <div className="pb-4">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <HiMagnifyingGlass
              aria-hidden="true"
              className="h-5 w-5 text-gray-400"
            />
          </div>
          <input
            id="search"
            name="search"
            type="search"
            placeholder="Search"
            value={filters.searchQuery}
            className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
            onChange={(e) =>
              setFilters({ type: 'searchQuery', value: e.target.value })
            }
          />
        </div>
      </div>
      <div
        className="flex flex-wrap gap-x-4 gap-y-3"
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
            <Icon name={segment.icon} className="h-5 w-5" />
            {segment.name}
          </button>
        ))}
      </div>
    </div>
  );
}
