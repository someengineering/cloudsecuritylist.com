'use client';

import Logo from '@/assets/logo-horizontal.svg';
import Icon from '@/components/common/Icon';
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { HiBars3, HiChevronDown, HiXMark } from 'react-icons/hi2';

export default function Header({
  title,
  navigation,
}: {
  title?: string;
  navigation?: {
    name: string;
    href?: string | null;
    children?:
      | {
          slug: string;
          title: string;
          description: string | null;
          icon: string | null;
        }[]
      | null;
  }[];
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header>
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <Link
          href="/"
          className="-m-1.5 flex flex-shrink-0 items-center p-1.5 text-cyan-600 hover:text-cyan-700 focus:outline-none"
        >
          <span className="sr-only">{title}</span>
          <Logo className="h-9 w-auto sm:h-10" aria-hidden="true" />
        </Link>
        <div className="relative -mr-6 hidden text-sm font-semibold leading-6 text-gray-600 lg:flex">
          {navigation?.map((item) => (
            <div
              className={clsx(
                'relative px-3',
                item.children?.length && 'group/menu',
              )}
              key={item.name}
            >
              <Link
                href={item.href || '#'}
                className={clsx(
                  'group relative flex items-center p-3',
                  pathname === item.href
                    ? 'text-cyan-600 hover:text-cyan-700'
                    : 'hover:text-gray-700',
                )}
                key={item.name}
              >
                {item.name}
                {item.children?.length ? (
                  <HiChevronDown className="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                ) : null}
              </Link>
              {item.children?.length ? (
                <div className="invisible absolute right-0 z-50 w-screen max-w-md space-y-1 overflow-hidden rounded-2xl bg-white p-4 shadow-lg ring-1 ring-gray-900/5 group-hover/menu:visible">
                  {item.children.map((child) => (
                    <div
                      key={child.slug}
                      className={clsx(
                        'group relative flex gap-x-6 rounded-lg p-4 text-sm leading-6',
                        pathname === `/${child.slug}`
                          ? 'bg-cyan-50'
                          : 'hover:bg-gray-50',
                      )}
                    >
                      <div
                        className={clsx(
                          'flex h-11 w-11 flex-none items-center justify-center rounded-lg',
                          pathname === `/${child.slug}`
                            ? 'bg-cyan-600'
                            : 'bg-gray-50 group-hover:bg-white',
                        )}
                      >
                        <Icon
                          name={child.icon ?? 'HiOutlineSparkles'}
                          className={clsx(
                            'h-6 w-6',
                            pathname === `/${child.slug}`
                              ? 'text-white'
                              : 'text-gray-600 group-hover:text-cyan-600',
                          )}
                        />
                      </div>
                      <div className="flex-auto">
                        <Link
                          href={`/${child.slug}`}
                          className={clsx(
                            'block',
                            pathname === `/${child.slug}`
                              ? 'text-cyan-800 group-hover:text-cyan-900'
                              : 'text-gray-900 group-hover:text-cyan-600',
                          )}
                        >
                          {child.title}
                          <span className="absolute inset-0" />
                        </Link>
                        <p className="mt-1 font-normal group-hover:text-gray-700">
                          {child.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <HiBars3 className="h-6 w-6" />
          </button>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50 bg-gray-500/50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="-m-1.5 p-1.5 text-cyan-600 hover:text-cyan-700 focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">{title}</span>
              <Logo className="h-9 w-auto sm:h-10" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <HiXMark className="h-6 w-6" />
            </button>
          </div>
          <div className="space-y-2 py-10">
            {navigation?.map((item) =>
              item.children?.length ? (
                <Disclosure key={item.name} as="div" className="-mx-3">
                  <DisclosureButton
                    as={item.href ? Link : undefined}
                    href={item.href || '#'}
                    className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                    <HiChevronDown className="h-4 w-4 flex-none group-data-[open]:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.slug}
                        href={`/${child.slug}`}
                        className={clsx(
                          'flex items-center gap-x-3 rounded-lg py-2 pl-6 pr-3 text-sm leading-7',
                          pathname === `/${child.slug}`
                            ? 'bg-cyan-50 font-bold text-cyan-700 hover:text-cyan-900'
                            : 'font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon
                          name={child.icon ?? 'HiOutlineSparkles'}
                          className="h-5 w-5"
                        />
                        {child.title}
                      </Link>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
              ) : (
                <Link
                  key={item.name}
                  href={item.href || '#'}
                  className={clsx(
                    '-mx-3 block rounded-lg p-3 py-2 text-base leading-7',
                    pathname === item.href
                      ? 'bg-cyan-50 font-bold text-cyan-700 hover:text-cyan-900'
                      : 'font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ),
            )}
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
