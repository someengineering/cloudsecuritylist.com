import CloudProviders from '@/components/content/CloudProviders';
import PageHeader from '@/components/page/Header';
import { getPage } from '@/lib/sanity';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = (await getPage('providers')) ?? {};

  return {
    title,
    description,
  };
}

export default async function ProvidersPage() {
  const { title, description } = (await getPage('providers')) ?? {};

  return (
    <>
      <PageHeader title={title} description={description} />
      <CloudProviders />
    </>
  );
}
