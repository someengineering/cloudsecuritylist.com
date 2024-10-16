import CardGrid from '@/components/common/CardGrid';
import { getResearches } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity/image';

export default async function Research() {
  const researches = await getResearches();

  if (!researches.length) {
    return null;
  }

  return (
    <section className="pb-12 sm:pb-16">
      <CardGrid
        cards={researches.map((research) => ({
          href: research.website,
          imageSrc: research.organization.mark
            ? urlFor(research.organization.mark).url()
            : undefined,
          title: research.name,
          description: research.description,
        }))}
      />
    </section>
  );
}
