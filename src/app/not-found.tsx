import '@/styles/globals.css';

import { plusJakartaSans } from '@/app/font';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import PageHeader from '@/components/page/Header';
import { getSiteSettings } from '@/lib/sanity';
import { clsx } from 'clsx';
import PlausibleProvider from 'next-plausible';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { HiChevronRight, HiOutlineSparkles } from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';

export default async function NotFoundPage() {
  const { title, navigation, copyright, featuredPages } =
    (await getSiteSettings()) ?? {};

  return (
    <html
      lang="en"
      className={clsx('h-full scroll-smooth', plusJakartaSans.variable)}
    >
      <head>
        <PlausibleProvider domain="cloudsecuritylist.com" trackOutboundLinks />
      </head>
      <body className="bg-white">
        <Header title={title} navigation={navigation} />
        <main>
          <PageHeader
            title="Page not found"
            eyebrow="404"
            description="Oh no! This page seems to have evaporated into the cloud. Even our most advanced threat detection can’t locate it."
          />
          {featuredPages?.length ? (
            <div className="mx-auto flow-root max-w-lg">
              <h2 className="sr-only">Popular pages</h2>
              <ul role="list" className="-mt-6 divide-y divide-gray-900/5">
                {featuredPages.map((page) => {
                  const Icon = page.icon
                    ? dynamic(() =>
                        import('react-icons/hi2')
                          .then(
                            (mod) =>
                              (mod[
                                page.icon as keyof typeof mod
                              ] as IconType) ?? HiOutlineSparkles,
                          )
                          .catch(() => HiOutlineSparkles),
                      )
                    : HiOutlineSparkles;

                  return (
                    <li
                      key={page.slug}
                      className="group relative flex gap-x-6 py-6"
                    >
                      <div className="mx-auto flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-cyan-50/50 group-hover:bg-cyan-50/75">
                        <Icon className="h-7 w-7 text-cyan-700 group-hover:text-cyan-800" />
                      </div>
                      <div className="flex-auto">
                        <h3 className="text-balance text-lg font-semibold">
                          <Link
                            href={`/${page.slug}`}
                            className="text-cyan-600 focus:outline-none group-hover:text-cyan-700"
                          >
                            <span
                              aria-hidden="true"
                              className="absolute inset-0"
                            />
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
              <div className="mt-10 flex justify-center">
                <Link
                  href="/"
                  className="text-sm font-semibold leading-6 text-cyan-600 hover:text-cyan-700"
                >
                  <span aria-hidden="true" className="mr-1">
                    &larr;
                  </span>
                  Back to home
                </Link>
              </div>
            </div>
          ) : null}
        </main>
        <Footer copyright={copyright} navigation={navigation} />
      </body>
    </html>
  );
}
