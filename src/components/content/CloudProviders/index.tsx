import { getCloudProviders } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity/image';
import Image from 'next/image';
import Link from 'next/link';

export default async function CloudProviders() {
  const cloudProviders = await getCloudProviders();

  if ((cloudProviders ?? []).length === 0) {
    return null;
  }

  return (
    <>
      <section
        className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8"
        aria-labelledby="product-categories"
      >
        {cloudProviders.length > 0 ? (
          <dl className="mx-auto max-w-2xl space-y-16">
            {cloudProviders?.map((cloudProvider) => {
              return (
                <div
                  key={cloudProvider._id}
                  className="group relative flex items-start space-x-8"
                >
                  {cloudProvider.mark ? (
                    <div className="flex-shrink-0 pt-2.5">
                      <Image
                        src={urlFor(cloudProvider.mark).url()}
                        width={64}
                        height={64}
                        alt=""
                        aria-hidden="true"
                        className="h-16 w-16 object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-14 w-14 flex-shrink-0 rounded bg-slate-200" />
                  )}
                  <div>
                    <dt className="text-lg font-semibold leading-8 text-gray-900">
                      <Link
                        href={`/provider/${cloudProvider.slug}`}
                        className="text-cyan-600 focus:outline-none group-hover:text-cyan-700"
                      >
                        <span aria-hidden="true" className="absolute inset-0" />
                        {cloudProvider.name}
                      </Link>
                    </dt>
                    <dd className="mt-1 text-base leading-7 text-gray-600">
                      {cloudProvider.description}
                    </dd>
                  </div>
                </div>
              );
            })}
          </dl>
        ) : null}
      </section>
    </>
  );
}
