'use client';

import { useFilters } from '@/components/content/ProductCategories/Context';
import { MARKET_SEGMENTS_QUERYResult } from '@/lib/sanity/types';
import { clsx } from 'clsx';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { HiOutlineSparkles, HiXMark } from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';

export default function FilterButtons({
  marketSegments,
}: {
  marketSegments: MARKET_SEGMENTS_QUERYResult;
}) {
  const { filters, setFilters } = useFilters();
  const router = useRouter();
  const pathname = usePathname();

  const marketSegmentIcons = useMemo(
    () =>
      marketSegments.map((segment) => ({
        slug: segment.slug,
        icon: segment.icon
          ? dynamic(() =>
              import('react-icons/hi2')
                .then(
                  (mod) =>
                    (mod[segment.icon as keyof typeof mod] as IconType) ??
                    HiOutlineSparkles,
                )
                .catch(() => HiOutlineSparkles),
            )
          : HiOutlineSparkles,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.marketSegment) {
      params.set('segment', filters.marketSegment);
    }

    router.push(`${pathname}?${params.toString()}${window.location.hash}`, {
      scroll: false,
      // @ts-expect-error 'shallow' does not exist in type 'NavigateOptions'
      shallow: true,
    });
  }, [filters, pathname, router]);

  return (
    <div className="mx-auto mb-10 max-w-5xl">
      <div className="isolate grid grid-cols-2 overflow-hidden rounded-md shadow-sm sm:grid-cols-3 lg:grid-cols-7">
        {marketSegments.map((segment, idx) => {
          const Icon =
            marketSegmentIcons.find((icon) => icon.slug === segment.slug)
              ?.icon ?? HiOutlineSparkles;

          return (
            <button
              type="button"
              className={clsx(
                'group relative flex items-center justify-center text-ellipsis px-3 py-2.5 text-base font-semibold ring-1 ring-inset ring-gray-300 focus:z-10 lg:px-1.5 lg:py-2 lg:text-sm',
                filters.marketSegment !== segment.slug &&
                  'bg-white text-gray-900 hover:bg-cyan-100',
                filters.marketSegment === segment.slug &&
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
              <span className="flex items-center gap-x-2 lg:flex-col lg:gap-y-1">
                <span className="h-5 w-5" aria-hidden="true">
                  <Icon className="h-full w-full" />
                </span>
                {segment.name}
              </span>
              {filters.marketSegment === segment.slug ? (
                <span className="absolute inset-y-auto right-3 h-4 w-4 rounded-full p-0.5 text-cyan-600 group-hover:bg-cyan-100 group-hover:text-cyan-700 lg:right-1.5 lg:top-1.5">
                  <HiXMark className="h-3 w-3" />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
