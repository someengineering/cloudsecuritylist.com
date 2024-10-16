import DescriptionList from '@/components/common/DescriptionList';
import IconDescriptionList from '@/components/common/IconDescriptionList';
import ImageDescriptionList from '@/components/common/ImageDescriptionList';
import LogoGrid from '@/components/common/LogoGrid';
import OffsetSection from '@/components/common/OffsetSection';
import PageHeader from '@/components/page/Header';
import { urlFor } from '@/lib/sanity/image';
import { ORGANIZATION_TYPE } from '@/lib/sanity/schemas/objects/organizationType';
import { ORGANIZATION_QUERYResult } from '@/lib/sanity/types';
import { projectImage, repositoryHost } from '@/utils/openSourceProject';
import { toSentenceCase } from '@/utils/string';
import { getImageDimensions } from '@sanity/asset-utils';
import { uniqBy } from 'lodash';
import dynamic from 'next/dynamic';
import React, { ComponentType, useMemo } from 'react';
import {
  HiArrowTrendingUp,
  HiCodeBracket,
  HiOutlineGlobeAlt,
  HiOutlineSparkles,
} from 'react-icons/hi2';
import { IconBaseProps, IconType } from 'react-icons/lib';
import { SiCrunchbase, SiGithub, SiGitlab, SiLinkedin } from 'react-icons/si';

export default function Organization({
  organization,
}: {
  organization: ORGANIZATION_QUERYResult;
}) {
  const marketSegmentIcons = useMemo(
    () =>
      organization && 'productCategories' in organization
        ? uniqBy(organization.productCategories ?? [], 'marketSegment.slug')
            .map((category) => category.marketSegment)
            .reduce(
              (icons, segment) => {
                icons[segment.slug] = segment.icon
                  ? dynamic(() =>
                      import('react-icons/hi2')
                        .then(
                          (mod) =>
                            (mod[
                              segment.icon as keyof typeof mod
                            ] as IconType) ?? HiOutlineSparkles,
                        )
                        .catch(() => HiOutlineSparkles),
                    )
                  : HiOutlineSparkles;

                return icons;
              },
              {} as { [key: string]: IconType | ComponentType<IconBaseProps> },
            )
        : {},
    [organization],
  );

  if (
    !organization ||
    organization.organizationType === ORGANIZATION_TYPE.ACQUIRED
  ) {
    return null;
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
      icon: HiOutlineGlobeAlt,
    });
  }

  if (organization.repository) {
    const repoHost = repositoryHost(organization.repository);

    links.push({
      href: organization.repository,
      ...(repoHost?.endsWith('github.com')
        ? { label: 'GitHub', icon: SiGithub }
        : repoHost?.endsWith('gitlab.com')
          ? { label: 'GitLab', icon: SiGitlab }
          : { label: 'Repository', icon: HiCodeBracket }),
    });
  }

  if (organization.linkedin) {
    links.push({
      label: 'LinkedIn',
      href: organization.linkedin,
      icon: SiLinkedin,
    });
  }

  if (organization.crunchbase) {
    links.push({
      label: 'Crunchbase',
      href: organization.crunchbase,
      icon: SiCrunchbase,
    });
  }

  if (organization.stockSymbol) {
    links.push({
      label: `Stock (${organization.stockSymbol})`,
      href: `https://finance.yahoo.com/quote/${organization.stockSymbol}`,
      icon: HiArrowTrendingUp,
    });
  }

  return (
    <>
      <PageHeader
        title={organization.name}
        description={organization.description}
        links={links}
        image={organization.mark ? urlFor(organization.mark).url() : undefined}
      />
      {organization.cloudServices.length ? (
        <OffsetSection heading="Cloud services">
          <ImageDescriptionList
            items={organization.cloudServices.map((service) => ({
              title: service.name,
              slug: service.slug,
              href: `/provider/${service.slug}`,
              description: service.description,
              imageSrc: urlFor(service.mark).url(),
            }))}
          />
        </OffsetSection>
      ) : null}
      {organization.productCategories?.length ? (
        <OffsetSection heading="Product categories">
          <IconDescriptionList
            items={organization.productCategories.map((category) => ({
              title: category.expansion
                ? `${toSentenceCase(category.expansion)} (${category.name})`
                : toSentenceCase(category.name),
              slug: category.slug,
              href: `/category/${category.slug}`,
              description: category.description,
              icon: marketSegmentIcons[category.marketSegment.slug],
            }))}
          />
        </OffsetSection>
      ) : null}
      {organization.supportedCloudProviders?.filter(
        (provider) =>
          !organization.cloudServices.some(
            (service) => service.slug === provider.slug,
          ),
      ).length ? (
        <OffsetSection heading="Supported cloud providers">
          <LogoGrid
            items={
              organization.supportedCloudProviders
                .map((provider) => {
                  const image = provider.logo ?? provider.mark;

                  if (!image?.asset?._ref) {
                    return null;
                  }

                  const { aspectRatio } = getImageDimensions(image.asset._ref);

                  return {
                    title: provider.name,
                    href: `/provider/${provider.slug}`,
                    imageSrc: urlFor(image).url(),
                    imageAspectRatio: aspectRatio,
                  };
                })
                .filter((item) => item !== null) ?? []
            }
          />
        </OffsetSection>
      ) : null}
      {organization.openSourceProjects.length ? (
        <OffsetSection heading="Open-source projects" slug="open-source">
          <ImageDescriptionList
            items={organization.openSourceProjects.map((project) => ({
              title: project.name,
              slug: project.slug,
              href: `/open-source/${project.slug}`,
              description: project.description,
              imageSrc: projectImage({
                mark: project.mark,
                repositoryUrl: project.repository,
                organizationMark: project.organization?.mark,
              }),
            }))}
          />
        </OffsetSection>
      ) : null}
      {organization.research.length ? (
        <OffsetSection heading="Research">
          <DescriptionList
            items={organization.research.map((research) => ({
              title: research.name,
              href: research.website,
              description: research.description,
            }))}
          />
        </OffsetSection>
      ) : null}
      {organization.acquiredEntities.length ? (
        <OffsetSection heading="Acquisitions">
          <DescriptionList
            items={organization.acquiredEntities.map((entity) => ({
              title: entity.name,
              titleDescription:
                entity.acquisitionDate || entity.acquisitionPrice
                  ? `acquired${
                      entity.acquisitionDate
                        ? ` on ${new Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }).format(new Date(entity.acquisitionDate))}`
                        : ''
                    }${
                      entity.acquisitionPrice
                        ? ` for ${new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            notation: 'compact',
                          }).format(entity.acquisitionPrice)}`
                        : ''
                    }`
                  : undefined,
              slug: entity.slug,
              href: entity.pressRelease ?? undefined,
              description: entity.description,
            }))}
          />
        </OffsetSection>
      ) : null}
    </>
  );
}
