import FeaturedText from '@/components/page/FeaturedText';
import PageHeader from '@/components/page/Header';
import LogoGrid from '@/components/page/LogoGrid';
import OffsetSection from '@/components/page/OffsetSection';
import { urlFor } from '@/lib/sanity/image';
import { PRODUCT_CATEGORY_QUERYResult } from '@/lib/sanity/types';
import { toSentenceCase } from '@/utils/string';
import { PortableTextBlock } from '@portabletext/types';
import { getImageDimensions } from '@sanity/asset-utils';

export default async function ProductCategory({
  productCategory,
}: {
  productCategory: PRODUCT_CATEGORY_QUERYResult;
}) {
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
      {productCategory.vendors.length > 0 ? (
        <OffsetSection heading="Product vendors" slug="vendors">
          <LogoGrid
            items={
              productCategory.vendors
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
