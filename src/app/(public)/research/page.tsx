import Research from '@/components/content/Research';
import PageHeader from '@/components/page/Header';
import { getPage } from '@/lib/sanity';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = (await getPage('research')) ?? {};

  return {
    title,
    description,
  };
}

export default async function ResearchPage() {
  const { title, description } = (await getPage('research')) ?? {};

  return (
    <>
      <PageHeader title={title} description={description} />
      <Research />
    </>
  );
}
