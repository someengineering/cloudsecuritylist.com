'use client';

import { Filters, useFilters } from '@/components/content/Vendors/Context';
import { urlFor } from '@/lib/sanity/image';
import { ORGANIZATION_TYPES } from '@/lib/sanity/schemas/objects/organizationType';
import { VENDORS_QUERYResult } from '@/lib/sanity/types';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HiArrowTrendingUp, HiOutlineGlobeAlt } from 'react-icons/hi2';
import { SiCrunchbase, SiLinkedin } from 'react-icons/si';
import useInfiniteScroll from 'react-infinite-scroll-hook';

export default function List({
  initialData,
  getVendors,
}: {
  initialData: VENDORS_QUERYResult;
  getVendors: (
    filters: Filters,
    lastItem?: string,
  ) => Promise<VENDORS_QUERYResult>;
}) {
  const { filters } = useFilters();
  const [vendors, setVendors] = useState<VENDORS_QUERYResult>(initialData);
  const [lastItem, setLastItem] = useState<string | undefined>(
    initialData[initialData.length - 1]?.name,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const [sentryRef] = useInfiniteScroll({
    loading: loading,
    hasNextPage: !!lastItem,
    onLoadMore: async () => {
      setLoading(true);

      if (lastItem) {
        const data = await getVendors(filters, lastItem);

        if (!data) {
          setError(true);
          return;
        }

        if (data.length > 0 && data[data.length - 1].name !== lastItem) {
          setLastItem(data[data.length - 1].name);
          setVendors([...vendors, ...data]);
        } else {
          setLastItem(undefined);
        }
      }

      setLoading(false);
    },
    disabled: error,
  });

  useEffect(() => {
    setVendors(initialData);
    setLastItem(
      initialData.length ? initialData[initialData.length - 1].name : undefined,
    );
  }, [initialData]);

  if (!vendors?.length) {
    return null;
  }

  return (
    <ul
      role="list"
      className="container mx-auto grid max-w-7xl auto-rows-fr grid-cols-1 gap-4 px-4 py-8 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8 xl:gap-6"
    >
      {vendors?.map((vendor) => {
        const organizationType = ORGANIZATION_TYPES.find(
          (type) => type.value === vendor.organizationType,
        );

        return (
          <li
            key={vendor._id}
            className="relative flex flex-col space-y-4 rounded-lg border border-gray-300 bg-white px-5 py-4 shadow-sm focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-offset-2 hover:border-gray-400"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Image
                  src={urlFor(vendor.mark).url()}
                  width={56}
                  height={56}
                  alt=""
                  aria-hidden="true"
                  className="h-14 w-14 object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-start">
                    <Link
                      href={`/organization/${vendor.slug}`}
                      className="text-ellipsis text-lg font-semibold text-gray-900 focus:outline-none"
                    >
                      <span aria-hidden="true" className="absolute inset-0" />
                      {vendor.name}
                    </Link>
                    {organizationType ? (
                      <span className="inline-flex items-center gap-x-1.5 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        <organizationType.icon
                          className="h-4 w-4"
                          title={organizationType.title}
                        />
                        {organizationType.title}
                      </span>
                    ) : null}
                  </div>
                  <ul role="list" className="z-10 flex items-end gap-x-3">
                    <li>
                      <Link
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        <span className="sr-only">Website</span>
                        <HiOutlineGlobeAlt
                          className="h-5 w-5"
                          title="Website"
                        />
                      </Link>
                    </li>
                    {vendor.linkedin ? (
                      <li>
                        <Link
                          href={vendor.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          title="LinkedIn"
                        >
                          <span className="sr-only">LinkedIn</span>
                          <SiLinkedin className="h-5 w-5" />
                        </Link>
                      </li>
                    ) : null}
                    {vendor.crunchbase ? (
                      <li>
                        <Link
                          href={vendor.crunchbase}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          title="Crunchbase"
                        >
                          <span className="sr-only">Crunchbase</span>
                          <SiCrunchbase className="h-5 w-5" />
                        </Link>
                      </li>
                    ) : null}
                    {vendor.stockSymbol ? (
                      <li>
                        <Link
                          href={`https://finance.yahoo.com/quote/${vendor.stockSymbol}`}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <span className="sr-only">
                            Stock ({vendor.stockSymbol})
                          </span>
                          <HiArrowTrendingUp
                            className="h-5 w-5"
                            title={`Stock (${vendor.stockSymbol})`}
                          />
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </div>
            </div>
            <div className="line-clamp-5 text-sm text-gray-500">
              {vendor.description}
            </div>
            {vendor.productCategories?.length ? (
              <div className="flex grow flex-wrap content-end items-end gap-x-3 gap-y-1.5">
                {vendor.productCategories.map((productCategory) => (
                  <span
                    className="inline-flex items-center rounded-md bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-600 ring-1 ring-inset ring-cyan-500/10"
                    key={productCategory._id}
                  >
                    {productCategory.expansion ? (
                      <abbr
                        title={productCategory.expansion}
                        className="no-underline"
                      >
                        {productCategory.name}
                      </abbr>
                    ) : (
                      productCategory.name
                    )}
                  </span>
                ))}
              </div>
            ) : null}
          </li>
        );
      })}
      {!error && (loading || lastItem) && (
        <li
          ref={sentryRef}
          className="relative rounded-lg border border-gray-300 bg-white px-5 py-4 shadow-sm"
        >
          <div className="flex h-full animate-pulse flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="dark:bg-slate h-14 w-14 flex-shrink-0 rounded bg-slate-200" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex flex-grow flex-col items-start">
                    <div className="mb-2 h-5 w-3/4 rounded bg-slate-200" />
                    <div className="h-3 w-1/2 rounded bg-slate-200" />
                  </div>
                  <ul role="list" className="flex items-end gap-x-3">
                    {[...Array(3)].map((_val, idx) => (
                      <li key={`skeleton-icon-${idx}`}>
                        <div className="h-5 w-5 rounded bg-slate-200" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="space-y-3 pt-1.5">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-2 rounded bg-slate-200" />
                <div className="col-span-1 h-2 rounded bg-slate-200" />
              </div>
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-2 h-2 rounded bg-slate-200" />
                <div className="col-span-3 h-2 rounded bg-slate-200" />
              </div>
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-1 h-2 rounded bg-slate-200" />
                <div className="col-span-2 h-2 rounded bg-slate-200" />
                <div className="col-span-2 h-2 rounded bg-slate-200" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 h-2 rounded bg-slate-200" />
                <div className="col-span-2 h-2 rounded bg-slate-200" />
              </div>
              <div className="h-2 w-1/2 rounded bg-slate-200" />
            </div>
            <div className="flex grow flex-wrap items-end gap-x-3 gap-y-2 pb-1">
              {[...Array(5)].map((_val, idx) => (
                <div
                  className="flex h-4 w-10 rounded bg-slate-200"
                  key={`skeleton-tag-${idx}`}
                />
              ))}
            </div>
          </div>
        </li>
      )}
    </ul>
  );
}
