'use client';

import { useFilters } from '@/components/content/Vendors/Context';
import {
  ORGANIZATION_TYPE,
  ORGANIZATION_TYPES,
} from '@/lib/sanity/schemas/objects/organizationType';
import {
  CLOUD_PROVIDERS_QUERYResult,
  PRODUCT_CATEGORIES_QUERYResult,
} from '@/lib/sanity/types';
import { toSentenceCase } from '@/utils/string';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import { debounce, sortBy, uniqBy } from 'lodash';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { ComponentType, useEffect, useMemo, useState } from 'react';
import {
  HiChevronDown,
  HiMagnifyingGlass,
  HiOutlineSparkles,
  HiXMark,
} from 'react-icons/hi2';
import { IconBaseProps, IconType } from 'react-icons/lib';

export default function FilterPanel({
  productCategories,
  organizationTypes,
  cloudProviders,
}: {
  productCategories: PRODUCT_CATEGORIES_QUERYResult;
  organizationTypes: ORGANIZATION_TYPE[];
  cloudProviders: CLOUD_PROVIDERS_QUERYResult;
}) {
  const [filtersMobileMenuOpen, setFiltersMobileMenuOpen] = useState(false);
  const [productCategoriesMobileMenuOpen, setProductCategoriesMobileMenuOpen] =
    useState(false);
  const { filters, setFilters } = useFilters();
  const router = useRouter();
  const pathname = usePathname();

  const debouncedRouterPush = useMemo(
    () => debounce(router.push, 300),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const marketSegments = useMemo(
    () =>
      sortBy(
        uniqBy(productCategories, 'marketSegment.slug').map(
          (category) => category.marketSegment,
        ),
        'name',
      ),
    [productCategories],
  );
  const marketSegmentIcons = useMemo(
    () =>
      marketSegments.reduce(
        (icons, segment) => {
          icons[segment.slug] = segment.icon
            ? dynamic(() =>
                import('react-icons/hi2')
                  .then(
                    (mod) =>
                      (mod[segment.icon as keyof typeof mod] as IconType) ??
                      HiOutlineSparkles,
                  )
                  .catch(() => HiOutlineSparkles),
              )
            : HiOutlineSparkles;

          return icons;
        },
        {} as { [key: string]: IconType | ComponentType<IconBaseProps> },
      ),
    [marketSegments],
  );

  useEffect(() => {
    if (pathname && filters.paginated) {
      const params = new URLSearchParams();

      filters.productCategories.forEach((slug) => {
        params.append('category', slug);
      });
      filters.organizationTypes.forEach((type) => {
        params.append('type', type);
      });
      filters.supportedCloudProviders.forEach((slug) => {
        params.append('provider', slug);
      });

      if (filters.searchQuery) {
        params.append('q', filters.searchQuery);
      }

      debouncedRouterPush(
        `${pathname}?${params.toString()}${window.location.hash}`,
        {
          scroll: false,
          // @ts-expect-error 'shallow' does not exist in type 'NavigateOptions'
          shallow: true,
        },
      );
    }
  }, [debouncedRouterPush, filters, pathname, router]);

  return (
    <div className="mb-10">
      <section
        aria-labelledby="filter-heading"
        className="mx-auto max-w-7xl px-6 lg:px-8"
      >
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>
        <div className="border-b border-gray-200 bg-white pb-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="grow">
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
            <button
              className="ml-auto inline-block font-medium text-gray-700 hover:text-gray-900 sm:hidden"
              onClick={() => setFiltersMobileMenuOpen(true)}
            >
              Filters
            </button>
            <PopoverGroup className="-mx-4 hidden items-center divide-x divide-gray-200 sm:flex">
              <Popover className="relative z-20 ml-auto inline-block px-4 text-left">
                <PopoverButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  <span>Organization type</span>
                  {filters.organizationTypes.length ? (
                    <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                      {filters.organizationTypes.length}
                    </span>
                  ) : null}
                  <HiChevronDown className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 data-[open]:rotate-180" />
                </PopoverButton>
                <PopoverPanel className="absolute right-2 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:opacity-0">
                  <form className="space-y-4">
                    {organizationTypes.map((type) => (
                      <div className="flex items-center" key={type}>
                        <input
                          defaultValue="public"
                          checked={filters.organizationTypes.includes(type)}
                          id={`filter-type-${type}`}
                          name="organizationTypes[]"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                          onChange={() =>
                            setFilters({
                              type: 'organizationType',
                              value: type,
                            })
                          }
                        />
                        <label
                          htmlFor={`filter-type-${type}`}
                          className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                        >
                          {ORGANIZATION_TYPES[type].title}
                        </label>
                      </div>
                    ))}
                  </form>
                </PopoverPanel>
              </Popover>
              <Popover className="relative z-20 ml-auto inline-block px-4 text-left">
                <PopoverButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  <span>Supported cloud providers</span>
                  {filters.supportedCloudProviders.length ? (
                    <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                      {filters.supportedCloudProviders.length}
                    </span>
                  ) : null}
                  <HiChevronDown className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 data-[open]:rotate-180" />
                </PopoverButton>
                <PopoverPanel className="absolute right-2 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:opacity-0">
                  <form className="space-y-4">
                    {cloudProviders.map((provider) => (
                      <div className="flex items-center" key={provider._id}>
                        <input
                          defaultValue="public"
                          checked={filters.supportedCloudProviders.includes(
                            provider.slug,
                          )}
                          id={`filter-provider-${provider.slug}`}
                          name="supportedCloudProviders[]"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                          onChange={() =>
                            setFilters({
                              type: 'supportedCloudProvider',
                              slug: provider.slug,
                            })
                          }
                        />
                        <label
                          htmlFor={`filter-provider-${provider.slug}`}
                          className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                        >
                          {provider.name}
                        </label>
                      </div>
                    ))}
                  </form>
                </PopoverPanel>
              </Popover>
            </PopoverGroup>
          </div>
        </div>
      </section>
      <Disclosure as="section" aria-labelledby="product-category-heading">
        <h2 id="product-category-heading" className="sr-only">
          Product categories
        </h2>
        <div className="border-y border-gray-200 bg-gray-100">
          <div className="mx-auto flex max-w-7xl items-center px-6 py-3 lg:px-8">
            <DisclosureButton
              className="group flex items-center py-2 font-medium text-gray-700 hover:text-gray-900 sm:text-sm"
              onClick={() => setProductCategoriesMobileMenuOpen(true)}
            >
              Product categories
              <span className="sr-only">, selected</span>
              <HiChevronDown className="ml-1 hidden h-5 w-5 text-gray-400 group-hover:text-gray-500 group-data-[open]:rotate-180 sm:block" />
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
                        <span>{selectedCategory.name}</span>
                      )}
                      <button
                        type="button"
                        className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-0.5 text-cyan-600 hover:bg-cyan-100 hover:text-cyan-700"
                        onClick={() =>
                          setFilters({ type: 'productCategory', slug })
                        }
                      >
                        <span className="sr-only">
                          Remove filter for {selectedCategory.name}
                        </span>
                        <HiXMark className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <DisclosurePanel className="hidden border-y border-gray-200 py-10 sm:block">
          <div className="mx-auto grid max-w-7xl auto-rows-min grid-cols-3 gap-x-6 gap-y-8 px-6 text-sm md:grid-cols-4 lg:grid-cols-5 lg:px-8 xl:grid-cols-7">
            {marketSegments.map((segment) => {
              const Icon = marketSegmentIcons[segment.slug];

              return (
                <fieldset key={segment._id}>
                  <legend className="flex items-center gap-x-1.5 font-medium">
                    <span className="h-5 w-5" aria-hidden="true">
                      <Icon className="h-full w-full" />
                    </span>
                    {toSentenceCase(segment.name)}
                  </legend>
                  <div className="space-y-4 pt-4">
                    {productCategories
                      .filter(
                        (category) =>
                          category.marketSegment._id === segment._id,
                      )
                      .map((category) => (
                        <div
                          key={category._id}
                          className="flex items-center gap-x-1.5"
                        >
                          <input
                            defaultValue={category.slug}
                            checked={filters.productCategories.includes(
                              category.slug,
                            )}
                            id={`category-${category.slug}`}
                            name="productCategories[]"
                            type="checkbox"
                            className="mx-0.5 h-4 w-4 flex-shrink-0 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                            onChange={() =>
                              setFilters({
                                type: 'productCategory',
                                slug: category.slug ?? '',
                              })
                            }
                          />
                          <label
                            htmlFor={`category-${category.slug}`}
                            className="min-w-0 flex-1 text-sm text-gray-600"
                          >
                            {category.expansion ? (
                              <abbr
                                title={category.expansion}
                                className="no-underline"
                              >
                                {toSentenceCase(category.name)}
                              </abbr>
                            ) : (
                              toSentenceCase(category.name)
                            )}
                          </label>
                        </div>
                      ))}
                  </div>
                </fieldset>
              );
            })}
          </div>
        </DisclosurePanel>
      </Disclosure>
      <Dialog
        open={productCategoriesMobileMenuOpen}
        onClose={setProductCategoriesMobileMenuOpen}
        className="relative z-40 sm:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
          >
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-medium text-gray-900">
                Product categories
              </h2>
              <button
                type="button"
                onClick={() => setProductCategoriesMobileMenuOpen(false)}
                className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
              >
                <span className="sr-only">Close menu</span>
                <HiXMark className="h-6 w-6" />
              </button>
            </div>
            <form className="mt-4">
              {marketSegments.map((segment) => {
                const Icon = marketSegmentIcons[segment.slug];

                return (
                  <Disclosure
                    key={segment._id}
                    as="div"
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                        <span className="flex items-center gap-x-1.5 font-medium text-gray-900">
                          <span className="h-5 w-5" aria-hidden="true">
                            <Icon className="h-full w-full" />
                          </span>
                          {toSentenceCase(segment.name)}
                        </span>
                        <span className="ml-6 flex items-center">
                          <HiChevronDown className="h-5 w-5 rotate-0 transform group-data-[open]:-rotate-180" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-6">
                        {productCategories
                          .filter(
                            (category) =>
                              category.marketSegment._id === segment._id,
                          )
                          .map((category) => (
                            <div
                              key={`mobile-${category._id}`}
                              className="flex items-center gap-x-1.5"
                            >
                              <input
                                defaultValue={category.slug}
                                checked={filters.productCategories.includes(
                                  category.slug,
                                )}
                                id={`category-${category.slug}`}
                                name="productCategories[]"
                                type="checkbox"
                                className="mx-0.5 h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                                onChange={() =>
                                  setFilters({
                                    type: 'productCategory',
                                    slug: category.slug ?? '',
                                  })
                                }
                              />
                              <label
                                htmlFor={`category-${category.slug}`}
                                className="text-sm text-gray-500"
                              >
                                {category.expansion ? (
                                  <abbr
                                    title={category.expansion}
                                    className="no-underline"
                                  >
                                    {toSentenceCase(category.name)}
                                  </abbr>
                                ) : (
                                  toSentenceCase(category.name)
                                )}
                              </label>
                            </div>
                          ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                );
              })}
            </form>
          </DialogPanel>
        </div>
      </Dialog>
      <Dialog
        open={filtersMobileMenuOpen}
        onClose={setFiltersMobileMenuOpen}
        className="relative z-40 sm:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
          >
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button
                type="button"
                onClick={() => setFiltersMobileMenuOpen(false)}
                className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
              >
                <span className="sr-only">Close menu</span>
                <HiXMark className="h-6 w-6" />
              </button>
            </div>
            <form className="mt-4">
              <Disclosure
                as="div"
                className="border-t border-gray-200 px-4 py-6"
              >
                <h3 className="-mx-2 -my-3 flow-root">
                  <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                    <span className="flex items-center gap-x-1.5 font-medium text-gray-900">
                      Organization types
                      {filters.organizationTypes.length ? (
                        <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                          {filters.organizationTypes.length}
                        </span>
                      ) : null}
                    </span>
                    <span className="ml-6 flex items-center">
                      <HiChevronDown className="h-5 w-5 rotate-0 transform group-data-[open]:-rotate-180" />
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel className="pt-6">
                  <div className="space-y-6">
                    {organizationTypes.map((type) => (
                      <div
                        key={`mobile-${type}`}
                        className="flex items-center gap-x-1.5"
                      >
                        <input
                          defaultValue={type}
                          checked={filters.organizationTypes.includes(type)}
                          id={`type-${type}`}
                          name="organizationTypes[]"
                          type="checkbox"
                          className="mx-0.5 h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                          onChange={() =>
                            setFilters({
                              type: 'organizationType',
                              value: type,
                            })
                          }
                        />
                        <label
                          htmlFor={`type-${type}`}
                          className="text-sm text-gray-500"
                        >
                          {ORGANIZATION_TYPES[type].title}
                        </label>
                      </div>
                    ))}
                  </div>
                </DisclosurePanel>
              </Disclosure>
              <Disclosure
                as="div"
                className="border-t border-gray-200 px-4 py-6"
              >
                <h3 className="-mx-2 -my-3 flow-root">
                  <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                    <span className="flex items-center gap-x-1.5 font-medium text-gray-900">
                      Supported cloud providers
                      {filters.supportedCloudProviders.length ? (
                        <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                          {filters.supportedCloudProviders.length}
                        </span>
                      ) : null}
                    </span>
                    <span className="ml-6 flex items-center">
                      <HiChevronDown className="h-5 w-5 rotate-0 transform group-data-[open]:-rotate-180" />
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel className="pt-6">
                  <div className="space-y-6">
                    {cloudProviders.map((provider) => (
                      <div
                        key={`mobile-${provider._id}`}
                        className="flex items-center gap-x-1.5"
                      >
                        <input
                          defaultValue={provider.slug}
                          checked={filters.supportedCloudProviders.includes(
                            provider.slug,
                          )}
                          id={`type-${provider.slug}`}
                          name="supportedCloudProviders[]"
                          type="checkbox"
                          className="mx-0.5 h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                          onChange={() =>
                            setFilters({
                              type: 'supportedCloudProvider',
                              slug: provider.slug,
                            })
                          }
                        />
                        <label
                          htmlFor={`type-${provider.slug}`}
                          className="text-sm text-gray-500"
                        >
                          {provider.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </DisclosurePanel>
              </Disclosure>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
