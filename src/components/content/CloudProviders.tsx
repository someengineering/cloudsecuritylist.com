import CardGrid from '@/components/common/CardGrid';
import { getCloudProviders } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity/image';

export default async function CloudProviders() {
  const cloudProviders = await getCloudProviders();

  if (!cloudProviders?.length) {
    return null;
  }

  return (
    <section className="pb-12 sm:pb-16">
      <CardGrid
        cards={cloudProviders.map((provider) => ({
          href: `/provider/${provider.slug}`,
          imageSrc: provider.mark ? urlFor(provider.mark).url() : undefined,
          title: provider.name,
          description: provider.description,
        }))}
      />
    </section>
  );
}
