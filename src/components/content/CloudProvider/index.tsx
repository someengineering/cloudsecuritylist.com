import CTA from '@/components/page/CTA';
import PageHeader from '@/components/page/Header';
import LogoGrid from '@/components/page/LogoGrid';
import OffsetSection from '@/components/page/OffsetSection';
import { urlFor } from '@/lib/sanity/image';
import { CLOUD_PROVIDER_QUERYResult } from '@/lib/sanity/types';
import { getImageDimensions } from '@sanity/asset-utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HiOutlineGlobeAlt } from 'react-icons/hi2';
import { SiLinkedin } from 'react-icons/si';

export default async function CloudProvider({
  cloudProvider,
}: {
  cloudProvider: CLOUD_PROVIDER_QUERYResult;
}) {
  if (!cloudProvider) {
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
      href: cloudProvider.website,
      props: { target: '_blank', rel: 'noopener noreferrer' },
      icon: HiOutlineGlobeAlt,
    },
  ];

  if (cloudProvider.linkedin) {
    links.push({
      label: 'LinkedIn',
      href: cloudProvider.linkedin,
      props: { target: '_blank', rel: 'noopener noreferrer' },
      icon: SiLinkedin,
    });
  }

  return (
    <>
      <PageHeader
        title={cloudProvider.name}
        description={cloudProvider.description}
        links={links}
        image={urlFor(cloudProvider.mark).url()}
      />
      <CTA
        heading="Understand security responsibilities"
        description={`See how security tasks are shared between you and ${cloudProvider.name} to ensure your cloud environment is protected.`}
        secondaryButton={
          cloudProvider.sharedResponsibilityModel
            ? {
                label: 'View shared responsibility model',
                href: cloudProvider.sharedResponsibilityModel,
                props: { target: '_blank', rel: 'noopener noreferrer' },
              }
            : undefined
        }
      />
      {cloudProvider.vendors.length > 0 ? (
        <OffsetSection heading="Product vendors" slug="vendors">
          <LogoGrid
            items={
              cloudProvider.vendors
                ?.map((vendor) => {
                  const image = vendor.logo ?? vendor.mark;

                  if (!image?.asset?._ref) {
                    return null;
                  }

                  const { aspectRatio } = getImageDimensions(image.asset._ref);

                  return {
                    title: vendor.name,
                    href: `/organization/${vendor.slug}`,
                    imageSrc: urlFor(image).url(),
                    imageAspectRatio: aspectRatio,
                  };
                })
                .filter((item) => item !== null) ?? []
            }
          />
        </OffsetSection>
      ) : null}
      {cloudProvider.nativeProducts?.length ? (
        <OffsetSection heading="Native security products">
          <dl className="space-y-16">
            {cloudProvider.nativeProducts.map((product) => {
              return (
                <div key={product.name} className="group relative">
                  <dt className="text-lg font-semibold leading-8">
                    <Link
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-600 focus:outline-none group-hover:text-cyan-700"
                    >
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </Link>
                  </dt>
                  <dd className="mt-2 max-w-prose leading-7 text-gray-600">
                    {product.description}
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
