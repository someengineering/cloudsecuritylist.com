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
  getVendors: (filters: Filters, prev?: string) => Promise<VENDORS_QUERYResult>;
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
    hasNextPage: filters.paginated && !!lastItem,
    onLoadMore: async () => {
      setLoading(true);

      if (lastItem) {
        const data = await getVendors(filters, lastItem);

        if (!data) {
          setError(true);
          return;
        }

        if (data.length && data[data.length - 1].name !== lastItem) {
          setLastItem(data[data.length - 1].name);
          setVendors([...vendors, ...data]);
        } else {
          setLastItem(undefined);
        }
      }

      setLoading(false);
    },
    disabled: !filters.paginated || error,
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
      className="container mx-auto mt-10 grid max-w-7xl auto-rows-fr grid-cols-1 gap-4 px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8"
    >
      {vendors.map((vendor) => {
        const organizationType = ORGANIZATION_TYPES[vendor.organizationType];

        return (
          <li
            key={vendor._id}
            className="relative flex flex-col space-y-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-offset-2 hover:border-gray-400 lg:px-5"
          >
            <div className="flex items-center space-x-3">
              {vendor.mark ? (
                <div className="flex-shrink-0">
                  <Image
                    src={urlFor(vendor.mark).url()}
                    width={56}
                    height={56}
                    alt=""
                    aria-hidden="true"
                    className="h-12 w-12 object-cover xs:h-14 xs:w-14"
                  />
                </div>
              ) : (
                <div className="h-12 w-12 flex-shrink-0 rounded bg-slate-100 xs:h-14 xs:w-14" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-start">
                    <Link
                      href={`/organization/${vendor.slug}`}
                      className="line-clamp-1 font-semibold text-gray-900 focus:outline-none"
                    >
                      <span aria-hidden="true" className="absolute inset-0" />
                      {vendor.name}
                    </Link>
                    <span className="mt-0.5 inline-flex items-center gap-x-1 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      <organizationType.icon
                        className="h-4 w-4"
                        title={organizationType.title}
                      />
                      {organizationType.title}
                    </span>
                  </div>
                  <ul
                    role="list"
                    className="z-10 hidden items-end gap-x-2.5 xs:flex"
                  >
                    {vendor.website ? (
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
                    ) : null}
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
            <div className="text-sm text-gray-500">{vendor.description}</div>
            {vendor.productCategories?.length ? (
              <div className="flex grow flex-wrap content-end items-end gap-x-2 gap-y-1.5">
                {vendor.productCategories.map((category) => (
                  <Link
                    href={`/category/${category.slug}`}
                    className="z-10 inline-flex items-center rounded-md bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-600 ring-1 ring-inset ring-cyan-500/10 hover:text-cyan-700 hover:ring-cyan-500/20"
                    key={category._id}
                  >
                    {category.expansion ? (
                      <abbr title={category.expansion} className="no-underline">
                        {category.name}
                      </abbr>
                    ) : (
                      category.name
                    )}
                  </Link>
                ))}
              </div>
            ) : null}
          </li>
        );
      })}
      {filters.paginated && !error && (loading || lastItem) ? (
        <li
          ref={sentryRef}
          className="relative rounded-lg border border-gray-300 bg-white p-4 shadow-sm lg:px-5"
          aria-hidden="true"
        >
          <div className="flex h-full animate-pulse flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 flex-shrink-0 rounded bg-slate-200 sm:h-14 sm:w-14" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex flex-grow flex-col items-start">
                    <div className="mb-2.5 h-5 w-3/4 rounded bg-slate-200" />
                    <div className="h-3 w-1/2 rounded bg-slate-200" />
                  </div>
                  <ul role="list" className="flex items-end gap-x-2.5">
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
              <div className="h-2 w-1/2 rounded bg-slate-200" />
            </div>
            <div className="flex grow flex-wrap items-end gap-x-2 gap-y-1.5 pb-1">
              {[...Array(5)].map((_val, idx) => (
                <div
                  className="flex h-4 w-10 rounded bg-slate-200"
                  key={`skeleton-tag-${idx}`}
                />
              ))}
            </div>
          </div>
        </li>
      ) : null}
    </ul>
  );
}
