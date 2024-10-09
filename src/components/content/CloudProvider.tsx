import CTA from '@/components/page/CTA';
import DescriptionList from '@/components/page/DescriptionList';
import PageHeader from '@/components/page/Header';
import LogoGrid from '@/components/page/LogoGrid';
import OffsetSection from '@/components/page/OffsetSection';
import { urlFor } from '@/lib/sanity/image';
import { CLOUD_PROVIDER_QUERYResult } from '@/lib/sanity/types';
import { getImageDimensions } from '@sanity/asset-utils';
import { HiOutlineGlobeAlt } from 'react-icons/hi2';
import { SiLinkedin } from 'react-icons/si';

export default async function CloudProvider({
  provider,
}: {
  provider: CLOUD_PROVIDER_QUERYResult;
}) {
  if (!provider) {
    return null;
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
      href: provider.website,
      props: { target: '_blank', rel: 'noopener noreferrer' },
      icon: HiOutlineGlobeAlt,
    },
  ];

  if (provider.linkedin) {
    links.push({
      label: 'LinkedIn',
      href: provider.linkedin,
      props: { target: '_blank', rel: 'noopener noreferrer' },
      icon: SiLinkedin,
    });
  }

  return (
    <>
      <PageHeader
        title={`${provider.name}${provider.abbreviation ? ` (${provider.abbreviation})` : ''}`}
        description={provider.description}
        links={links}
        image={urlFor(provider.mark).url()}
      />
      <CTA
        heading="Understand security responsibilities"
        description={`See how security tasks are shared between you and ${provider.name} to ensure your cloud environment is protected.`}
        secondaryButton={
          provider.sharedResponsibilityModel
            ? {
                label: 'View shared responsibility model',
                href: provider.sharedResponsibilityModel,
                props: { target: '_blank', rel: 'noopener noreferrer' },
              }
            : undefined
        }
      />
      {provider.nativeProducts?.length ? (
        <OffsetSection heading="Native security products">
          <DescriptionList
            items={provider.nativeProducts.map((product) => ({
              title: product.name,
              href: product.link,
              description: product.description,
            }))}
          />
        </OffsetSection>
      ) : null}
      {provider.vendors.length ? (
        <OffsetSection heading="Product vendors" slug="vendors">
          <LogoGrid
            items={
              provider.vendors
                .map((vendor) => {
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
      {provider.openSourceProjects.length ? (
        <OffsetSection heading="Open-source projects" slug="open-source">
          <DescriptionList
            items={provider.openSourceProjects.map((project) => ({
              title: project.name,
              slug: project.slug,
              href: `/open-source/${project.slug}`,
              description: project.description,
            }))}
          />
        </OffsetSection>
      ) : null}
    </>
  );
}
