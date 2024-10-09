import DescriptionList from '@/components/page/DescriptionList';
import FeaturedText from '@/components/page/FeaturedText';
import PageHeader from '@/components/page/Header';
import IconDescriptionList from '@/components/page/IconDescriptionList';
import LogoGrid from '@/components/page/LogoGrid';
import OffsetSection from '@/components/page/OffsetSection';
import { urlFor } from '@/lib/sanity/image';
import { PRODUCT_CATEGORY_QUERYResult } from '@/lib/sanity/types';
import { toSentenceCase } from '@/utils/string';
import { PortableTextBlock } from '@portabletext/types';
import { getImageDimensions } from '@sanity/asset-utils';
import { uniqBy } from 'lodash';
import dynamic from 'next/dynamic';
import { ComponentType, useMemo } from 'react';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { IconBaseProps, IconType } from 'react-icons/lib';

export default async function ProductCategory({
  productCategory,
}: {
  productCategory: PRODUCT_CATEGORY_QUERYResult;
}) {
  const marketSegmentIcons = useMemo(
    () =>
      uniqBy(productCategory?.similarCategories ?? [], 'marketSegment.slug')
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
    [productCategory],
  );

  if (!productCategory) {
    return null;
  }

  return (
    <>
      <PageHeader
        title={
          productCategory.expansion
            ? `${toSentenceCase(
                productCategory.expansion,
              )} (${productCategory.name})`
            : toSentenceCase(productCategory.name)
        }
        description={productCategory.description}
        eyebrow={`${toSentenceCase(productCategory.marketSegment.name)} security`}
      />
      <FeaturedText
        heading={productCategory.explanationHeading}
        blocks={productCategory.explanation as PortableTextBlock[]}
      />
      {productCategory.vendors.length ? (
        <OffsetSection heading="Product vendors" slug="vendors">
          <LogoGrid
            items={
              productCategory.vendors
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
      {productCategory.openSourceProjects.length ? (
        <OffsetSection heading="Open-source projects" slug="open-source">
          <DescriptionList
            items={productCategory.openSourceProjects.map((project) => ({
              title: project.name,
              slug: project.slug,
              href: `/open-source/${project.slug}`,
              description: project.description,
            }))}
          />
        </OffsetSection>
      ) : null}
      {productCategory.similarCategories?.length ? (
        <OffsetSection heading="Similar categories">
          <IconDescriptionList
            items={productCategory.similarCategories.map((category) => ({
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
    </>
  );
}
