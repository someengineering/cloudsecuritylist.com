import List from '@/components/content/Acquisitions/List';
import { getAcquisitions } from '@/lib/sanity';

export default async function Acquisitions() {
  const acquisitions = await getAcquisitions({});

  if (!acquisitions?.length) {
    return null;
  }

  return (
    <List
      initialData={acquisitions}
      getAcquisitions={async (prevDate?: string, prevId?: string) => {
        'use server';

        return await getAcquisitions({ prevDate, prevId });
      }}
    />
  );
}
