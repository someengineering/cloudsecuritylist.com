import Card from '@/components/common/CardGrid/Card';
import CardSkeleton from '@/components/common/CardGrid/CardSkeleton';
import Link from 'next/link';
import React from 'react';
import { HiPlus } from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';
import type { IntersectionObserverHookRefCallback } from 'react-intersection-observer-hook';

export type CardProps = {
  href: string;
  imageSrc?: string;
  title: string;
  description: string;
  label?: { title: string; icon?: IconType };
  links?: { title: string; href: string; icon: IconType }[];
  tags?: { text: string | React.JSX.Element; href: string }[];
};

export default function CardGrid({
  cards,
  sentryRef,
}: {
  cards: CardProps[];
  sentryRef?: IntersectionObserverHookRefCallback;
}) {
  if (!cards.length && !sentryRef) {
    return null;
  }

  return (
    <ul
      role="list"
      className="container mx-auto grid max-w-7xl auto-rows-fr grid-cols-1 gap-4 px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8"
    >
      {cards.map((card) => (
        <Card key={card.href} {...card} />
      ))}
      {sentryRef ? (
        <CardSkeleton
          ref={sentryRef}
          label={cards.some((card) => !!card.label)}
          tags={cards.some((card) => !!card.tags?.length)}
        />
      ) : (
        <li>
          <Link
            href="mailto:info@cloudsecuritylist.com"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex h-full w-full flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 lg:px-5"
          >
            <HiPlus className="mb-2 h-10 w-10 text-gray-400" />
            <span className="block font-semibold text-gray-900">
              Something missing from this list?
            </span>
            <span className="block text-balance text-sm text-gray-500">
              Email us at{' '}
              <span className="font-medium">info@cloudsecuritylist.com</span> to
              propose additions or changes.
            </span>
          </Link>
        </li>
      )}
    </ul>
  );
}
