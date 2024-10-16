'use client';

import CardGrid from '@/components/common/CardGrid';
import { Filters, useFilters } from '@/components/content/Vendors/Context';
import { urlFor } from '@/lib/sanity/image';
import { ORGANIZATION_TYPES } from '@/lib/sanity/schemas/objects/organizationType';
import { VENDORS_QUERYResult } from '@/lib/sanity/types';
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
    <CardGrid
      cards={vendors.map((vendor) => ({
        href: `/organization/${vendor.slug}`,
        imageSrc: vendor.mark ? urlFor(vendor.mark).url() : undefined,
        title: vendor.name,
        description: vendor.description,
        label: ORGANIZATION_TYPES[vendor.organizationType],
        links: [
          ...(vendor.website
            ? [
                {
                  title: 'Website',
                  href: vendor.website,
                  icon: HiOutlineGlobeAlt,
                },
              ]
            : []),
          ...(vendor.linkedin
            ? [
                {
                  title: 'LinkedIn',
                  href: vendor.linkedin,
                  icon: SiLinkedin,
                },
              ]
            : []),
          ...(vendor.crunchbase
            ? [
                {
                  title: 'Crunchbase',
                  href: vendor.crunchbase,
                  icon: SiCrunchbase,
                },
              ]
            : []),
          ...(vendor.stockSymbol
            ? [
                {
                  title: `Stock (${vendor.stockSymbol})`,
                  href: `https://finance.yahoo.com/quote/${vendor.stockSymbol}`,
                  icon: HiArrowTrendingUp,
                },
              ]
            : []),
        ],
        tags: vendor.productCategories?.map((category) => ({
          text: category.expansion ? (
            <abbr title={category.expansion} className="no-underline">
              {category.name}
            </abbr>
          ) : (
            category.name
          ),
          href: `/category/${category.slug}`,
        })),
      }))}
      sentryRef={
        filters.paginated && !error && (loading || lastItem)
          ? sentryRef
          : undefined
      }
    />
  );
}
