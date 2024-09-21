import PageHeader from '@/components/page/Header';
import LogoGrid from '@/components/page/LogoGrid';
import OffsetSection from '@/components/page/OffsetSection';
import { urlFor } from '@/lib/sanity/image';
import { ORGANIZATION_QUERYResult } from '@/lib/sanity/types';
import { toSentenceCase } from '@/utils/string';
import { getImageDimensions } from '@sanity/asset-utils';
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
      organization.productCategories?.length ? (
        <OffsetSection title="Product categories">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
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
                <div key={productCategory._id} className="group relative">
                  <dt>
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-600 group-hover:bg-cyan-700">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Link
                      href={`/category/${productCategory.slug}`}
                      className="text-lg font-semibold leading-8 text-cyan-600 focus:outline-none group-hover:text-cyan-700"
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
        </OffsetSection>
      ) : null}
      {'supportedCloudProviders' in organization &&
      organization.supportedCloudProviders?.length ? (
        <OffsetSection title="Supported cloud providers">
          <LogoGrid
            items={
              organization.supportedCloudProviders
                ?.map((cloudProvider) => {
                  const image = cloudProvider.logo ?? cloudProvider.mark;

                  if (!image?.asset?._ref) {
                    return null;
                  }

                  const { aspectRatio } = getImageDimensions(image.asset._ref);

                  return {
                    title: cloudProvider.name,
                    href: `/provider/${cloudProvider.slug}`,
                    imageSrc: urlFor(image).url(),
                    imageAspectRatio: aspectRatio,
                  };
                })
                .filter((item) => item !== null) ?? []
            }
          />
        </OffsetSection>
      ) : null}
      {'research' in organization && organization.research.length ? (
        <OffsetSection title="Research">
          <dl className="space-y-16">
            {organization.research?.map((research) => {
              return (
                <div key={research._id} className="group relative">
                  <dt className="text-lg font-semibold leading-8">
                    <Link
                      href={research.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-600 focus:outline-none group-hover:text-cyan-700"
                    >
                      <span aria-hidden="true" className="absolute inset-0" />
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
        </OffsetSection>
      ) : null}
      {'acquiredEntities' in organization &&
      organization.acquiredEntities.length ? (
        <OffsetSection title="Acquisitions">
          <dl className="space-y-16">
            {organization.acquiredEntities?.map((acquiredEntity) => {
              return (
                <div
                  key={acquiredEntity._id}
                  id={acquiredEntity.slug}
                  className="group relative"
                >
                  <dt className="text-gray-900">
                    {acquiredEntity.pressRelease ? (
                      <Link
                        href={acquiredEntity.pressRelease}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold leading-8 text-cyan-600 focus:outline-none group-hover:text-cyan-700"
                      >
                        <span aria-hidden="true" className="absolute inset-0" />
                        {acquiredEntity.name}
                      </Link>
                    ) : (
                      <span className="text-lg font-semibold leading-8">
                        {acquiredEntity.name}
                      </span>
                    )}
                    {acquiredEntity.acquisitionDate ||
                    acquiredEntity.acquisitionPrice ? (
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
                          : null}
                        {acquiredEntity.acquisitionPrice
                          ? ` for ${new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              trailingZeroDisplay: 'stripIfInteger',
                            }).format(acquiredEntity.acquisitionPrice)}`
                          : null}
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
        </OffsetSection>
      ) : null}
    </>
  );
}
