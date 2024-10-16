import Card from '@/components/common/CardGrid/Card';
import CardSkeleton from '@/components/common/CardGrid/CardSkeleton';
import React from 'react';
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
      ) : null}
    </ul>
  );
}
