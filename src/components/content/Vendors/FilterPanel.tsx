'use client';

import { useFilters } from '@/components/content/Vendors/Context';
import { ORGANIZATION_TYPES } from '@/lib/sanity/schemas/objects/organizationType';
import {
  MARKET_SEGMENTS_QUERYResult,
  PRODUCT_CATEGORIES_QUERYResult,
} from '@/lib/sanity/types';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FilterPanel({
  marketSegments,
  productCategories,
  organizationTypes,
}: {
  marketSegments: MARKET_SEGMENTS_QUERYResult;
  productCategories: PRODUCT_CATEGORIES_QUERYResult;
  organizationTypes: string[];
}) {
  const { filters, setFilters } = useFilters();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams();

    filters.productCategories.forEach((slug) => {
      params.append('category', slug);
    });

    filters.organizationTypes.forEach((type) => {
      params.append('type', type);
    });

    router.push(`${pathname}?${params.toString()}${window.location.hash}`);
  }, [filters, pathname, router]);

  return (
    <>
      <section aria-labelledby="filter-heading">
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>

        <div className="border-b border-gray-200 bg-white pb-4">
          <div className="mx-auto flex max-w-7xl items-center justify-end px-4 sm:px-6 lg:px-8">
            <div className="hidden sm:block">
              <div className="flow-root">
                <PopoverGroup className="-mx-4 flex items-center divide-x divide-gray-200">
                  <Popover className="relative ml-auto inline-block px-4 text-left">
                    <PopoverButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                      <span>Organization type</span>
                      {filters.organizationTypes.length ? (
                        <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                          {filters.organizationTypes.length}
                        </span>
                      ) : null}
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 data-[open]:rotate-180"
                      />
                    </PopoverButton>

                    <PopoverPanel className="absolute right-2 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:opacity-0">
                      <form className="space-y-4">
                        {ORGANIZATION_TYPES.filter((type) =>
                          organizationTypes.includes(type.value),
                        ).map((type) => (
                          <div className="flex items-center" key={type.value}>
                            <input
                              defaultValue="public"
                              checked={filters.organizationTypes.includes(
                                type.value,
                              )}
                              id={`filter-type-${type.value}`}
                              name="organizationType[]"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                              onChange={() => {
                                setFilters({
                                  type: 'organizationType',
                                  value: type.value,
                                });
                              }}
                            />
                            <label
                              htmlFor={`filter-type-${type.value}`}
                              className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                            >
                              {type.title}
                            </label>
                          </div>
                        ))}
                      </form>
                    </PopoverPanel>
                  </Popover>
                </PopoverGroup>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Disclosure as="section" aria-labelledby="product-category-heading">
        <h2 id="product-category-heading" className="sr-only">
          Product categories
        </h2>
        <div className="border-y border-gray-200 bg-gray-100">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8">
            <DisclosureButton className="group flex items-center py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              Product categories
              <span className="sr-only">, selected</span>
              <ChevronDownIcon
                aria-hidden="true"
                className="ml-1 hidden h-5 w-5 text-gray-400 group-hover:text-gray-500 group-data-[open]:rotate-180 sm:block"
              />
            </DisclosureButton>

            <div
              aria-hidden="true"
              className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block"
            />

            <div className="mt-2 sm:ml-4 sm:mt-0">
              <div className="-m-1 flex flex-wrap items-center">
                {filters.productCategories.map((slug) => {
                  const selectedCategory = productCategories.find(
                    (category) => category.slug === slug,
                  );

                  if (!selectedCategory) {
                    return null;
                  }

                  return (
                    <span
                      key={slug}
                      className="m-1 inline-flex items-center rounded-full border border-cyan-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900 sm:-my-0.5"
                    >
                      {selectedCategory.expansion ? (
                        <abbr
                          title={selectedCategory.expansion}
                          className="no-underline"
                        >
                          {selectedCategory.name}
                        </abbr>
                      ) : (
                        <span>selectedCategory.name</span>
                      )}
                      <button
                        type="button"
                        className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-0.5 text-cyan-400 hover:bg-cyan-200 hover:text-cyan-500"
                        onClick={() => {
                          setFilters({ type: 'productCategory', slug });
                        }}
                      >
                        <span className="sr-only">
                          Remove filter for {selectedCategory.name}
                        </span>
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <DisclosurePanel className="border-y border-gray-200 py-10">
          <div className="mx-auto grid max-w-7xl auto-rows-min grid-cols-2 gap-x-4 px-4 text-sm sm:px-6 md:grid-cols-3 md:gap-x-6 lg:grid-cols-6 lg:px-8">
            {marketSegments.map((segment) => (
              <fieldset key={segment._id}>
                <legend className="block font-medium">
                  {segment.name[0].toUpperCase() + segment.name.slice(1)}
                </legend>
                <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                  {segment.productCategories.map((category) => (
                    <div
                      key={category._id}
                      className="flex items-center text-base sm:text-sm"
                    >
                      <input
                        defaultValue={category.slug}
                        checked={filters.productCategories.includes(
                          category.slug,
                        )}
                        id={`category-${category.slug}`}
                        name="productCategories[]"
                        type="checkbox"
                        className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                        onChange={() => {
                          setFilters({
                            type: 'productCategory',
                            slug: category.slug ?? '',
                          });
                        }}
                      />
                      <label
                        htmlFor={`category-${category.slug}`}
                        className="ml-3 min-w-0 flex-1 text-gray-600"
                      >
                        {category.expansion ? (
                          <abbr
                            title={category.expansion}
                            className="no-underline"
                          >
                            {category.name}
                          </abbr>
                        ) : (
                          category.name
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>
    </>
  );
}
