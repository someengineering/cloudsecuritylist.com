import DescriptionList from '@/components/common/DescriptionList';
import OffsetSection from '@/components/common/OffsetSection';
import { getPublications } from '@/lib/sanity';
import { PUBLICATION_TYPE } from '@/lib/sanity/schemas/objects/publicationType';
import Link from 'next/link';

export default async function Publications() {
  const newslettersData = getPublications({
    publicationTypes: [PUBLICATION_TYPE.NEWSLETTER],
  });
  const podcastsData = getPublications({
    publicationTypes: [PUBLICATION_TYPE.PODCAST],
  });

  const [newsletters, podcasts] = await Promise.all([
    newslettersData,
    podcastsData,
  ]);

  return (
    <>
      {newsletters.length ? (
        <OffsetSection heading="Newsletters">
          <DescriptionList
            items={newsletters.map((newsletter) => ({
              title: newsletter.name,
              titleDescription: newsletter.author ? (
                <>
                  by{' '}
                  {newsletter.author.linkedin ? (
                    <Link
                      href={newsletter.author.linkedin}
                      className="font-medium"
                    >
                      {newsletter.author.name}
                    </Link>
                  ) : (
                    newsletter.author.name
                  )}
                </>
              ) : undefined,
              href: newsletter.website,
              description: newsletter.description,
              // imageSrc: newsletter.mark
              //   ? urlFor(newsletter.mark).url()
              //   : undefined,
            }))}
          />
        </OffsetSection>
      ) : null}
      {podcasts.length ? (
        <OffsetSection heading="Podcasts">
          <DescriptionList
            items={podcasts.map((podcast) => ({
              title: podcast.name,
              href: podcast.website,
              description: podcast.description,
              // imageSrc: podcast.mark
              //   ? urlFor(podcast.mark).url()
              //   : podcast.publisher?.mark
              //     ? urlFor(podcast.publisher.mark).url()
              //     : undefined,
            }))}
          />
        </OffsetSection>
      ) : null}
    </>
  );
}
