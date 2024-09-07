'use client';

import {
  Filters,
  useFilters,
} from '@/components/content/ProductCategories/Context';
import { PRODUCT_CATEGORIES_BY_MARKET_SEGMENT_QUERYResult } from '@/lib/sanity/types';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function List({
  getProductCategories,
}: {
  getProductCategories: (
    filters: Filters,
  ) => Promise<PRODUCT_CATEGORIES_BY_MARKET_SEGMENT_QUERYResult>;
}) {
  const { filters } = useFilters();
  const [productCategories, setProductCategories] =
    useState<PRODUCT_CATEGORIES_BY_MARKET_SEGMENT_QUERYResult>();

  useEffect(() => {
    const fetchGlossary = async () => {
      const vendors = await getProductCategories(filters);
      setProductCategories(vendors);
    };

    fetchGlossary();
  }, [filters, getProductCategories]);

  useEffect(() => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [productCategories]);

  if (!productCategories?.length) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl divide-y divide-gray-900/10 px-6 lg:px-8">
      <dl className="mt-10 space-y-8 divide-y divide-gray-900/10">
        {productCategories.map((productCategory) => (
          <div
            key={productCategory._id}
            id={productCategory.slug}
            className="pt-8 leading-7 md:grid md:grid-cols-4 md:gap-8"
          >
            <dt className="col-span-1">
              <span className="text-xl font-semibold text-cyan-800 md:block">
                {productCategory.name[0].toUpperCase() +
                  productCategory.name.slice(1)}
              </span>
              {productCategory.expansion ? (
                <span className="ml-2 text-base text-cyan-900 md:ml-0 md:mt-1 md:block">
                  {' '}
                  ({productCategory.expansion})
                </span>
              ) : null}
            </dt>
            <dd className="mt-4 text-gray-600 md:col-span-3 md:mt-0.5">
              <p>{productCategory.description}</p>
              <div className="mt-4">
                <Link
                  href={`/?category=${productCategory.slug}`}
                  className="inline-flex items-center gap-x-1.5 rounded-md bg-cyan-50 px-2.5 py-1.5 text-sm font-semibold text-cyan-600 shadow-sm hover:bg-cyan-100"
                >
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="-ml-0.5 h-5 w-5"
                  />
                  View vendors
                </Link>
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
