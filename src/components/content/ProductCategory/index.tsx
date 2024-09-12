import PageHeader from '@/components/page/Header';
import { urlFor } from '@/lib/sanity/image';
import { PRODUCT_CATEGORY_QUERYResult } from '@/lib/sanity/types';
import { toSentenceCase } from '@/utils/string';
import { getImageDimensions } from '@sanity/asset-utils';
import { clsx } from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ProductCategory({
  productCategory,
}: {
  productCategory: PRODUCT_CATEGORY_QUERYResult;
}) {
  if (!productCategory) {
    notFound();
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
      {productCategory.vendors.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Product vendors
            </h2>
            <div className="col-span-2 -mx-6 grid grid-cols-2 gap-1 overflow-hidden sm:mx-0 sm:rounded-2xl md:grid-cols-3">
              {productCategory.vendors.map((vendor) => {
                const image = vendor.logo ?? vendor.mark;
                const { aspectRatio } = getImageDimensions(
                  image.asset?._ref ?? '',
                );

                return (
                  <Link
                    href={`/organization/${vendor.slug}`}
                    title={vendor.name}
                    key={vendor._id}
                    className="h-36 bg-gray-50 p-6 hover:bg-cyan-50"
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={urlFor(image).url()}
                        alt={vendor.name}
                        fill={true}
                        className={clsx(
                          'my-auto w-full object-contain object-center',
                          aspectRatio > 2.165
                            ? 'max-h-16'
                            : aspectRatio > 1.5
                              ? 'max-h-20'
                              : 'max-h-24',
                        )}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
