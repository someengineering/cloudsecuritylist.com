import PageHeader from '@/components/page/Header';
import { urlFor } from '@/lib/sanity/image';
import { ORGANIZATION_QUERYResult } from '@/lib/sanity/types';
import { toSentenceCase } from '@/utils/string';
import { getImageDimensions } from '@sanity/asset-utils';
import { clsx } from 'clsx';
import dynamic from 'next/dynamic';
import Image from 'next/image';
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
  }[] = [];

  if (organization.website) {
    links.push({
      label: 'Website',
      href: organization.website,
      props: { target: '_blank', rel: 'noopener noreferrer' },
      icon: HiOutlineGlobeAlt,
    });
  }

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
        image={urlFor(organization.mark).url()}
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
      {(organization.supportedCloudProviders ?? []).length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Supported cloud providers
            </h2>
            <div className="col-span-2 -mx-6 grid grid-cols-2 gap-1 overflow-hidden sm:mx-0 sm:rounded-2xl md:grid-cols-3">
              {organization.supportedCloudProviders?.map((cloudProvider) => {
                const image = cloudProvider.logo ?? cloudProvider.mark;
                const { aspectRatio } = getImageDimensions(
                  image.asset?._ref ?? '',
                );

                return (
                  <Link
                    href={`/provider/${cloudProvider.slug}`}
                    title={cloudProvider.name}
                    key={cloudProvider._id}
                    className="h-36 bg-gray-50 p-6 hover:bg-cyan-50"
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={urlFor(image).url()}
                        alt={cloudProvider.name}
                        fill={true}
                        className={clsx(
                          'my-auto w-full object-contain object-center',
                          aspectRatio > 1.625
                            ? 'max-h-14'
                            : aspectRatio > 1
                              ? 'max-h-16'
                              : 'max-h-20',
                        )}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
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
