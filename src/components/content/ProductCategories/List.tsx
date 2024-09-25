'use client';

import {
  Filters,
  useFilters,
} from '@/components/content/ProductCategories/Context';
import { PRODUCT_CATEGORIES_QUERYResult } from '@/lib/sanity/types';
import { toSentenceCase } from '@/utils/string';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function List({
  initialData,
  getProductCategories,
}: {
  initialData: PRODUCT_CATEGORIES_QUERYResult;
  getProductCategories: (
    filters: Filters,
  ) => Promise<PRODUCT_CATEGORIES_QUERYResult>;
}) {
  const { filters } = useFilters();
  const [productCategories, setProductCategories] =
    useState<PRODUCT_CATEGORIES_QUERYResult>(initialData);

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
            className="relative pt-8 leading-7 md:grid md:grid-cols-4 md:gap-8"
          >
            <dt className="col-span-1">
              <Link
                href={`/category/${productCategory.slug}`}
                className="text-xl font-semibold text-cyan-600 hover:text-cyan-700 focus:outline-none md:block"
              >
                <span aria-hidden="true" className="absolute inset-0" />
                {toSentenceCase(productCategory.name)}
              </Link>
              {productCategory.expansion ? (
                <span className="ml-2 text-cyan-900 md:ml-0 md:mt-1 md:block">
                  {' '}
                  ({productCategory.expansion})
                </span>
              ) : null}
            </dt>
            <dd className="mt-4 text-gray-600 md:col-span-3 md:mt-0.5">
              <p>{productCategory.description}</p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
