import FeaturedText from '@/components/page/FeaturedText';
import PageHeader from '@/components/page/Header';
import LogoGrid from '@/components/page/LogoGrid';
import OffsetSection from '@/components/page/OffsetSection';
import { urlFor } from '@/lib/sanity/image';
import { PRODUCT_CATEGORY_QUERYResult } from '@/lib/sanity/types';
import { toSentenceCase } from '@/utils/string';
import { PortableTextBlock } from '@portabletext/types';
import { getImageDimensions } from '@sanity/asset-utils';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';

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
      {productCategory.similarCategories?.length ? (
        <OffsetSection heading="Similar categories">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
            {productCategory.similarCategories.map((productCategory) => {
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
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-600">
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
                  <dd className="mt-2 max-w-prose leading-7 text-gray-600">
                    {productCategory.description}
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
