'use client';

import Logo from '@/assets/logo-horizontal.svg';
import { Dialog, DialogPanel } from '@headlessui/react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { HiBars3, HiXMark } from 'react-icons/hi2';

export default function Header({
  title,
  navigation,
}: {
  title?: string;
  navigation?: { name: string; href: string }[];
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
        <div className="hidden gap-x-12 lg:flex">
          {navigation?.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'text-sm leading-6',
                pathname === item.href
                  ? 'font-bold text-cyan-600 hover:text-cyan-700'
                  : 'font-semibold text-gray-700 hover:text-gray-800',
              )}
            >
              {item.name}
            </Link>
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
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation?.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      '-mx-3 block rounded-lg px-3 py-2 text-base leading-7',
                      pathname === item.href
                        ? 'bg-cyan-50 font-bold text-cyan-700 hover:text-cyan-900'
                        : 'font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
