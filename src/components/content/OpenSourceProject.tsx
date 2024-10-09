import PageHeader from '@/components/page/Header';
import IconDescriptionList from '@/components/page/IconDescriptionList';
import LogoGrid from '@/components/page/LogoGrid';
import OffsetSection from '@/components/page/OffsetSection';
import { urlFor } from '@/lib/sanity/image';
import { ORGANIZATION_TYPES } from '@/lib/sanity/schemas/objects/organizationType';
import { OPEN_SOURCE_PROJECT_QUERYResult } from '@/lib/sanity/types';
import { projectImage } from '@/utils/openSourceProject';
import { toSentenceCase } from '@/utils/string';
import { getImageDimensions } from '@sanity/asset-utils';
import { uniqBy } from 'lodash';
import dynamic from 'next/dynamic';
import React, { ComponentType, useMemo } from 'react';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { IconBaseProps, IconType } from 'react-icons/lib';
import { SiGithub } from 'react-icons/si';

export default async function OpenSourceProject({
  project,
}: {
  project: OPEN_SOURCE_PROJECT_QUERYResult;
}) {
  const marketSegmentIcons = useMemo(
    () =>
      uniqBy(project?.productCategories ?? [], 'marketSegment.slug')
        .map((category) => category.marketSegment)
        .reduce(
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
    [project],
  );

  if (!project) {
    return null;
  }

  const links: {
    label: string;
    href: string;
    props?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
    icon: (
      props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
    ) => React.JSX.Element;
  }[] = [{ label: 'Repository', href: project.repository, icon: SiGithub }];

  if (project.organization) {
    const organizationType = ORGANIZATION_TYPES.find(
      (type) => type.value === project.organization?.organizationType,
    );

    if (organizationType) {
      links.push({
        label: `Parent ${
          organizationType.title.toLowerCase().includes('company')
            ? 'company'
            : 'organization'
        }`,
        href: `/organization/${project.organization.slug}`,
        icon: organizationType.icon,
      });
    }
  }

  return (
    <>
      <PageHeader
        title={project.name}
        description={project.description}
        links={links}
        image={projectImage({
          mark: project.mark,
          repository: project.repository,
          organizationMark: project.organization?.mark,
        })}
      />
      {project.productCategories?.length ? (
        <OffsetSection heading="Product categories">
          <IconDescriptionList
            items={project.productCategories.map((category) => ({
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
      {project.supportedCloudProviders?.length ? (
        <OffsetSection heading="Supported cloud providers">
          <LogoGrid
            items={
              project.supportedCloudProviders
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
    </>
  );
}
