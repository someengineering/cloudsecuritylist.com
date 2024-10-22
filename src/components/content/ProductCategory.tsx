import FeaturedText from '@/components/common/FeaturedText';
import IconDescriptionList from '@/components/common/IconDescriptionList';
import ImageDescriptionList from '@/components/common/ImageDescriptionList';
import LogoGrid from '@/components/common/LogoGrid';
import OffsetSection from '@/components/common/OffsetSection';
import PageHeader from '@/components/page/Header';
import { urlFor } from '@/lib/sanity/image';
import { PRODUCT_CATEGORY_QUERYResult } from '@/lib/sanity/types';
import { projectImage } from '@/utils/openSourceProject';
import { toSentenceCase } from '@/utils/string';
import { PortableTextBlock } from '@portabletext/types';
import { getImageDimensions } from '@sanity/asset-utils';
import { uniqBy } from 'lodash';
import dynamic from 'next/dynamic';
import { ComponentType, useMemo } from 'react';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { IconBaseProps, IconType } from 'react-icons/lib';

export default function ProductCategory({
  category,
}: {
  category: PRODUCT_CATEGORY_QUERYResult;
}) {
  const marketSegmentIcons = useMemo(
    () =>
      uniqBy(category?.similarCategories ?? [], 'marketSegment.slug')
        .map((similarCategory) => similarCategory.marketSegment)
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
    [category],
  );

  if (!category) {
    return null;
  }

  return (
    <>
      <PageHeader
        title={
          category.expansion
            ? `${toSentenceCase(category.expansion)} (${category.name})`
            : toSentenceCase(category.name)
        }
        description={category.description}
        eyebrow={`${toSentenceCase(category.marketSegment.name)} security`}
      />
      <FeaturedText
        heading={category.explanationHeading}
        blocks={category.explanation as PortableTextBlock[]}
      />
      {category.vendors.length ? (
        <OffsetSection heading="Product vendors" slug="vendors">
          <LogoGrid
            items={
              category.vendors
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
      {category.openSourceProjects.length ? (
        <OffsetSection heading="Open-source projects" slug="open-source">
          <ImageDescriptionList
            items={category.openSourceProjects.map((project) => ({
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
      {category.similarCategories?.length ? (
        <OffsetSection heading="Similar categories">
          <IconDescriptionList
            items={category.similarCategories.map((similarCategory) => ({
              title: similarCategory.expansion
                ? `${toSentenceCase(similarCategory.expansion)} (${similarCategory.name})`
                : toSentenceCase(similarCategory.name),
              slug: similarCategory.slug,
              href: `/category/${similarCategory.slug}`,
              description: similarCategory.description,
              icon: marketSegmentIcons[similarCategory.marketSegment.slug],
            }))}
          />
        </OffsetSection>
      ) : null}
    </>
  );
}
