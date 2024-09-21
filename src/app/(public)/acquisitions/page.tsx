import Acquisitions from '@/components/content/Acquisitions';
import PageHeader from '@/components/page/Header';
import { getPage } from '@/lib/sanity';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = (await getPage('acquisitions')) ?? {};

  return {
    title,
    description,
  };
}

export default async function AcquisitionsPage() {
  const { title, description } = (await getPage('acquisitions')) ?? {};

  return (
    <>
      <PageHeader title={title} description={description} />
      <Acquisitions />
    </>
  );
}
