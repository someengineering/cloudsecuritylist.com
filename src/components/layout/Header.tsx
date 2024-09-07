'use client';

import Icon from '@/assets/icon.svg';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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
    <header className="bg-white">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <Link
          href="/"
          className="-m-1.5 flex items-center p-1.5 text-xl font-bold"
        >
          <Icon className="mr-1.5 h-12 w-12 text-cyan-600" aria-hidden="true" />
          {title}
        </Link>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation?.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'text-sm leading-6',
                pathname === item.href
                  ? 'font-bold text-cyan-700 hover:text-cyan-800'
                  : 'font-semibold text-gray-900 hover:text-gray-950',
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="-m-1.5 p-1.5 text-xl font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              {title}
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
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
                        ? 'bg-cyan-50 font-bold text-cyan-900'
                        : 'font-semibold text-gray-900 hover:bg-gray-50',
                    )}
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
