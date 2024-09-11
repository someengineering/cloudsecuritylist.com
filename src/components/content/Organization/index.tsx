import PageHeader from '@/components/page/Header';
import { urlFor } from '@/lib/sanity/image';
import { ORGANIZATION_QUERYResult } from '@/lib/sanity/types';
import { toSentenceCase } from '@/utils/string';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';
import {
  HiArrowTrendingUp,
  HiOutlineGlobeAlt,
  HiOutlineSparkles,
} from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';
import { SiCrunchbase, SiLinkedin } from 'react-icons/si';

export default async function Organization({
  organization,
}: {
  organization: ORGANIZATION_QUERYResult;
}) {
  if (!organization) {
    notFound();
  }

  const links: {
    label: string;
    href: string;
    props?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
    icon: (
      props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
    ) => React.JSX.Element;
  }[] = [
    {
      label: 'Website',
      href: organization.website,
      props: { target: '_blank', rel: 'noopener noreferrer' },
      icon: HiOutlineGlobeAlt,
    },
  ];

  if (organization.linkedin) {
    links.push({
      label: 'LinkedIn',
      href: organization.linkedin,
      props: { target: '_blank', rel: 'noopener noreferrer' },
      icon: SiLinkedin,
    });
  }

  if (organization.crunchbase) {
    links.push({
      label: 'Crunchbase',
      href: organization.crunchbase,
      props: { target: '_blank', rel: 'noopener noreferrer' },
      icon: SiCrunchbase,
    });
  }

  if (organization.stockSymbol) {
    links.push({
      label: 'Stock',
      href: `https://finance.yahoo.com/quote/${organization.stockSymbol}`,
      props: { target: '_blank', rel: 'noopener noreferrer' },
      icon: HiArrowTrendingUp,
    });
  }

  return (
    <>
      <PageHeader
        title={organization.name}
        description={organization.description}
        links={links}
        image={urlFor(organization.logo ?? organization.icon).url()}
      />
      {(organization.productCategories ?? []).length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 md:max-w-none xl:mx-0 xl:grid-cols-3">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Product categories
            </h2>
            <dl className="col-span-2 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2">
              {organization.productCategories?.map((productCategory) => {
                const Icon = productCategory.marketSegment.icon
                  ? dynamic(() =>
                      import('react-icons/hi2')
                        .then(
                          (mod) =>
                            (mod[
                              productCategory.marketSegment
                                .icon as keyof typeof mod
                            ] as IconType) ?? HiOutlineSparkles,
                        )
                        .catch(() => HiOutlineSparkles),
                    )
                  : HiOutlineSparkles;

                return (
                  <div key={productCategory._id} className="relative">
                    <dt>
                      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-600">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <Link
                        href={`/category/${productCategory.slug}`}
                        className="text-lg font-semibold leading-8 text-cyan-700 focus:outline-none group-hover:text-cyan-800"
                      >
                        <span aria-hidden="true" className="absolute inset-0" />
                        {productCategory.expansion
                          ? `${toSentenceCase(
                              productCategory.expansion,
                            )} (${productCategory.name})`
                          : toSentenceCase(productCategory.name)}
                      </Link>
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600">
                      {productCategory.description}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </section>
      ) : null}
      {(organization.research ?? []).length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Research
            </h2>
            <dl className="col-span-2 space-y-16">
              {organization.research?.map((research) => {
                return (
                  <div key={research._id}>
                    <dt className="text-lg font-semibold leading-8 text-gray-900">
                      <Link
                        href={research.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-700 focus:outline-none group-hover:text-cyan-800"
                      >
                        {research.name}
                      </Link>
                    </dt>
                    <dd className="mt-1 text-base leading-7 text-gray-600">
                      {research.description}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </section>
      ) : null}
    </>
  );
}
