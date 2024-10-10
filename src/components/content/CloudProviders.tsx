import { getCloudProviders } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity/image';
import Image from 'next/image';
import Link from 'next/link';

export default async function CloudProviders() {
  const cloudProviders = await getCloudProviders();

  if (!cloudProviders?.length) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pb-12 sm:pb-16 lg:px-8">
      <dl className="mx-auto max-w-2xl space-y-16">
        {cloudProviders.map((provider) => {
          return (
            <div
              key={provider._id}
              className="group relative flex items-start space-x-8"
            >
              {provider.mark ? (
                <div className="flex-shrink-0 pt-2.5">
                  <Image
                    src={urlFor(provider.mark).url()}
                    width={64}
                    height={64}
                    alt=""
                    aria-hidden="true"
                    className="h-16 w-16"
                  />
                </div>
              ) : (
                <div className="h-14 w-14 flex-shrink-0 rounded bg-slate-200" />
              )}
              <div>
                <dt className="text-lg font-semibold leading-8">
                  <Link
                    href={`/provider/${provider.slug}`}
                    className="text-cyan-600 focus:outline-none group-hover:text-cyan-700"
                  >
                    <span aria-hidden="true" className="absolute inset-0" />
                    {provider.name}
                  </Link>
                </dt>
                <dd className="mt-2 max-w-prose leading-7 text-gray-600">
                  {provider.description}
                </dd>
              </div>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
