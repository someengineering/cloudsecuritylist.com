import CardGrid from '@/components/common/CardGrid';
import { getResearches } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity/image';
import { ORGANIZATION_TYPES } from '@/lib/sanity/schemas/objects/organizationType';

export default async function Research() {
  const researches = await getResearches();

  if (!researches.length) {
    return null;
  }

  return (
    <section className="pb-12 sm:pb-16">
      <CardGrid
        cards={researches.map((research) => {
          const organizationType = research.organization
            ? ORGANIZATION_TYPES[research.organization.organizationType]
            : undefined;

          return {
            href: research.website,
            imageSrc: research.organization.mark
              ? urlFor(research.organization.mark).url()
              : undefined,
            title: research.name,
            description: research.description,
            links: [
              ...(research.organization && organizationType
                ? [
                    {
                      title:
                        research.organization.name !== research.name
                          ? `Parent ${
                              organizationType?.title
                                .toLowerCase()
                                .includes('company')
                                ? 'company'
                                : 'organization'
                            } (${research.organization.name})`
                          : organizationType?.title
                                .toLowerCase()
                                .includes('company')
                            ? 'Company'
                            : 'Organization',
                      href: `/organization/${research.organization.slug}`,
                      icon: organizationType.icon,
                    },
                  ]
                : []),
            ],
          };
        })}
      />
    </section>
  );
}
