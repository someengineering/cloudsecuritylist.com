import PageHeader from '@/components/page/Header';
import { getSiteSettings } from '@/lib/sanity';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = (await getSiteSettings()) ?? {};

  return {
    title,
    description,
  };
}

export default async function HomePage() {
  const { headline, subheadline, featuredPages } =
    (await getSiteSettings()) ?? {};

  return (
    <>
      <PageHeader title={headline} description={subheadline} />
      {(featuredPages ?? []).length > 0 ? (
        <section
          aria-labelledby="pages-heading"
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
        >
          <h2 id="pages-heading" className="sr-only">
            Pages
          </h2>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-y-12 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-0">
            {featuredPages?.map((page) => {
              const Icon = page.icon
                ? dynamic(() =>
                    import('react-icons/hi2')
                      .then(
                        (mod) =>
                          (mod[page.icon as keyof typeof mod] as IconType) ??
                          HiOutlineSparkles,
                      )
                      .catch(() => HiOutlineSparkles),
                  )
                : HiOutlineSparkles;

              return (
                <div
                  key={page.title}
                  className="group relative mx-auto max-w-xl rounded-lg border border-gray-300 bg-white px-5 py-4 text-center shadow-sm focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-offset-2 hover:border-gray-400 md:flex md:items-start md:text-left"
                >
                  <div className="md:flex-shrink-0">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50/50 group-hover:bg-cyan-50/75 md:h-20 md:w-20">
                      <Icon className="h-8 w-8 text-cyan-700 group-hover:text-cyan-800 md:h-12 md:w-12" />
                    </div>
                  </div>
                  <div className="mt-3 md:ml-4 md:mt-0">
                    <Link
                      href={`/${page.slug}`}
                      className="text-balance text-lg font-semibold text-cyan-700 focus:outline-none group-hover:text-cyan-800 md:text-xl"
                    >
                      <span aria-hidden="true" className="absolute inset-0" />
                      {page.title}
                    </Link>
                    <p className="mt-2 text-pretty text-sm text-gray-500 group-hover:text-gray-600 md:mt-3 md:text-base">
                      {page.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
    </>
  );
}
