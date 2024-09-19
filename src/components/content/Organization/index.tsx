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
        image={
          organization.mark?.asset?._ref
            ? urlFor(organization.mark).url()
            : undefined
        }
      />
      {'productCategories' in organization &&
      (organization.productCategories ?? []).length > 0 ? (
        <section
          className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8"
          aria-labelledby="product-categories"
        >
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 md:max-w-none xl:mx-0 xl:grid-cols-3">
            <h2
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
              id="product-categories"
            >
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
                  <div key={productCategory._id}>
                    <dt>
                      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-600">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <Link
                        href={`/category/${productCategory.slug}`}
                        className="text-lg font-semibold leading-8 text-cyan-700 focus:outline-none"
                      >
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
      {'supportedCloudProviders' in organization &&
      (organization.supportedCloudProviders ?? []).length > 0 ? (
        <section
          className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8"
          aria-labelledby="supported-cloud-providers"
        >
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <h2
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
              id="supported-cloud-providers"
            >
              Supported cloud providers
            </h2>
            <div className="col-span-2 -mx-6 grid grid-cols-2 gap-1 overflow-hidden sm:mx-0 sm:rounded-2xl md:grid-cols-3">
              {organization.supportedCloudProviders?.map((cloudProvider) => {
                const image = cloudProvider.logo ?? cloudProvider.mark;

                if (!image?.asset?._ref) {
                  return null;
                }

                const { aspectRatio } = getImageDimensions(image.asset._ref);

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
      {'research' in organization &&
      (organization.research ?? []).length > 0 ? (
        <section
          className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8"
          aria-labelledby="research"
        >
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <h2
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
              id="research"
            >
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
                        className="text-cyan-700 focus:outline-none"
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
      {'acquiredEntities' in organization &&
      (organization.acquiredEntities ?? []).length > 0 ? (
        <section
          className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8"
          aria-labelledby="acquired-entities"
        >
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <h2
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
              id="acquired-entities"
            >
              Acquired entities
            </h2>
            <dl className="col-span-2 space-y-16">
              {organization.acquiredEntities?.map((acquiredEntity) => {
                return (
                  <div key={acquiredEntity._id} id={acquiredEntity.slug}>
                    <dt className="text-gray-900">
                      {acquiredEntity.pressRelease ? (
                        <Link
                          href={acquiredEntity.pressRelease}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-700 focus:outline-none"
                        >
                          {acquiredEntity.name}
                        </Link>
                      ) : (
                        <span className="text-lg font-semibold leading-8 text-cyan-700">
                          {acquiredEntity.name}
                        </span>
                      )}
                      {!!acquiredEntity.acquisitionDate ||
                      !!acquiredEntity.acquisitionPrice ? (
                        <>
                          {' '}
                          (acquired
                          {acquiredEntity.acquisitionDate
                            ? ` on ${new Intl.DateTimeFormat('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }).format(
                                new Date(acquiredEntity.acquisitionDate),
                              )}`
                            : ''}
                          {acquiredEntity.acquisitionPrice
                            ? ` for ${new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                trailingZeroDisplay: 'stripIfInteger',
                              }).format(acquiredEntity.acquisitionPrice)}`
                            : ''}
                          )
                        </>
                      ) : null}
                    </dt>
                    <dd className="mt-1 text-base leading-7 text-gray-600">
                      {acquiredEntity.description}
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
