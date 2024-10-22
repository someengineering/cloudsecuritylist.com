import List from '@/components/content/Acquisitions/List';
import { getAcquisitions } from '@/lib/sanity';

export default async function Acquisitions({
  paginated = true,
}: {
  paginated?: boolean;
}) {
  const acquisitions = await getAcquisitions({ paginated });

  if (!acquisitions.length) {
    return null;
  }

  return (
    <List
      initialData={acquisitions}
      getAcquisitions={async (prevDate: string, prevId: string) => {
        'use server';

        if (typeof prevDate === 'string' && typeof prevId === 'string') {
          return await getAcquisitions({ prevDate, prevId });
        }

        return [];
      }}
      paginated={paginated}
    />
  );
}
