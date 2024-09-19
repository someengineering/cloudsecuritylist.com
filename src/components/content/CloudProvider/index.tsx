import PageHeader from '@/components/page/Header';
import LogoGrid from '@/components/page/LogoGrid';
import OffsetSection from '@/components/page/OffsetSection';
import { urlFor } from '@/lib/sanity/image';
import { CLOUD_PROVIDER_QUERYResult } from '@/lib/sanity/types';
import { getImageDimensions } from '@sanity/asset-utils';
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
      {cloudProvider.vendors.length > 0 ? (
        <OffsetSection title="Product vendors" slug="vendors">
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
    </>
  );
}
