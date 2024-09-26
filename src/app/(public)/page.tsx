import PageHeader from '@/components/page/Header';
import { getSiteSettings } from '@/lib/sanity';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { HiChevronRight, HiOutlineSparkles } from 'react-icons/hi2';
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
          className="mx-auto flow-root max-w-xl px-6 pb-12 sm:pb-16 lg:px-8"
        >
          <h2 id="pages-heading" className="sr-only">
            Popular pages
          </h2>
          <ul role="list" className="-mt-6 divide-y divide-gray-900/5">
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
                  key={page.slug}
                  className="group relative flex gap-x-6 py-6"
                >
                  <div className="mx-auto flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-cyan-50">
                    <Icon className="h-7 w-7 text-cyan-600 group-hover:text-cyan-700" />
                  </div>
                  <div className="flex-auto">
                    <h3 className="text-balance text-lg font-semibold">
                      <Link
                        href={`/${page.slug}`}
                        className="text-cyan-600 focus:outline-none group-hover:text-cyan-700"
                      >
                        <span aria-hidden="true" className="absolute inset-0" />
                        {page.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-pretty text-sm text-gray-600 group-hover:text-gray-700">
                      {page.description}
                    </p>
                  </div>
                  <div className="flex-none self-center">
                    <HiChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
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
