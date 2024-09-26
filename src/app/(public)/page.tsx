import PageHeader from '@/components/page/Header';
import { getSiteSettings } from '@/lib/sanity';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';

export default async function HomePage() {
  const { headline, subheadline, featuredPages } =
    (await getSiteSettings()) ?? {};

  return (
    <>
      <PageHeader title={headline} description={subheadline} />
      {featuredPages?.length ? (
        <section
          aria-labelledby="pages-heading"
          className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8"
        >
          <h2 id="pages-heading" className="sr-only">
            Popular pages
          </h2>
          <ul
            role="list"
            className="mx-auto grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8"
          >
            {featuredPages.map((page) => {
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
                <li
                  key={page.title}
                  className="group relative mx-auto max-w-xl rounded-lg border border-gray-300 bg-white px-5 py-4 text-center shadow-sm focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-offset-2 hover:border-gray-400 md:flex md:items-start md:text-left"
                >
                  <div className="md:flex-shrink-0">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-50">
                      <Icon className="h-7 w-7 text-cyan-700 group-hover:text-cyan-800" />
                    </div>
                  </div>
                  <div className="mt-3 md:ml-4 md:mt-0">
                    <h3 className="text-balance font-semibold md:text-lg">
                      <Link
                        href={`/${page.slug}`}
                        className="text-cyan-600 focus:outline-none group-hover:text-cyan-700"
                      >
                        <span aria-hidden="true" className="absolute inset-0" />
                        {page.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-pretty text-sm text-gray-600 group-hover:text-gray-700 md:mt-3">
                      {page.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </>
  );
}
