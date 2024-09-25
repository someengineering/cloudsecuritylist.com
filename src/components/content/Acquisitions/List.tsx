'use client';

import { urlFor } from '@/lib/sanity/image';
import { ACQUISITIONS_QUERYResult } from '@/lib/sanity/types';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';

export default function List({
  initialData,
  getAcquisitions,
}: {
  initialData: ACQUISITIONS_QUERYResult;
  getAcquisitions: (
    prevDate?: string,
    prevId?: string,
  ) => Promise<ACQUISITIONS_QUERYResult>;
}) {
  const [acquisitions, setAcquisitions] =
    useState<ACQUISITIONS_QUERYResult>(initialData);
  const [lastDate, setLastDate] = useState<string | undefined>(
    initialData[initialData.length - 1]?.acquisitionDate ?? undefined,
  );
  const [lastId, setLastId] = useState<string | undefined>(
    initialData[initialData.length - 1]?._id,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const [sentryRef] = useInfiniteScroll({
    loading: loading,
    hasNextPage: !!lastDate && !!lastId,
    onLoadMore: async () => {
      setLoading(true);

      if (lastDate && lastId) {
        const data = await getAcquisitions(lastDate, lastId);

        if (!data) {
          setError(true);
          return;
        }

        if (data.length && data[data.length - 1]._id !== lastId) {
          setLastDate(data[data.length - 1].acquisitionDate ?? undefined);
          setLastId(data[data.length - 1]._id);
          setAcquisitions([...acquisitions, ...data]);
        } else {
          setLastDate(undefined);
          setLastId(undefined);
        }
      }

      setLoading(false);
    },
    disabled: error,
  });

  useEffect(() => {
    setAcquisitions(initialData);
    setLastDate(
      initialData.length
        ? (initialData[initialData.length - 1].acquisitionDate ?? undefined)
        : undefined,
    );
    setLastId(
      initialData.length ? initialData[initialData.length - 1]._id : undefined,
    );
  }, [initialData]);

  if (!acquisitions?.length) {
    return null;
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16 lg:px-8">
      {acquisitions.length > 0 ? (
        <ul role="list" className="-mb-14">
          {acquisitions?.map((acquisition, idx) => {
            const mark =
              acquisition.mark ?? acquisition.parentOrganization?.mark;

            return (
              <li key={acquisition._id} className="group relative pb-14">
                {idx !== acquisitions.length - 1 ||
                (!error && (loading || (lastDate && lastId))) ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-8 top-8 -ml-px h-full w-1 bg-gray-200"
                  />
                ) : null}
                <div className="relative flex space-x-4">
                  {mark ? (
                    <div className="h-16 w-16 flex-shrink-0 bg-white ring-8 ring-white">
                      <Image
                        src={urlFor(mark).url()}
                        width={64}
                        height={64}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 flex-shrink-0 rounded bg-slate-200 ring-8 ring-white" />
                  )}
                  <div className="mt-0.5">
                    <div className="flex justify-between space-x-6 pt-3">
                      <h3 className="text-pretty text-lg leading-8 text-gray-700">
                        {acquisition.pressRelease ? (
                          <Link
                            href={acquisition.pressRelease}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-cyan-600 focus:outline-none group-hover:text-cyan-700"
                          >
                            <span
                              aria-hidden="true"
                              className="absolute inset-0"
                            />
                            {acquisition.name}
                          </Link>
                        ) : (
                          <span className="font-semibold">
                            {acquisition.name}
                          </span>
                        )}{' '}
                        acquired by{' '}
                        <Link
                          href={`/organization/${acquisition.parentOrganization?.slug}`}
                          className="font-medium"
                        >
                          {acquisition.parentOrganization?.name}
                        </Link>
                        {acquisition.acquisitionPrice
                          ? ` for ${new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              notation: 'compact',
                            }).format(acquisition.acquisitionPrice)}`
                          : null}
                      </h3>
                      {acquisition.acquisitionDate ? (
                        <div className="whitespace-nowrap text-right leading-8 text-gray-500">
                          <time dateTime={acquisition.acquisitionDate}>
                            {new Intl.DateTimeFormat('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }).format(new Date(acquisition.acquisitionDate))}
                          </time>
                        </div>
                      ) : null}
                    </div>
                    <p className="mt-2 max-w-prose text-pretty leading-7 text-gray-600">
                      {acquisition.description}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
          {!error && (loading || (lastDate && lastId)) ? (
            <li ref={sentryRef} className="pb-14" aria-hidden="true">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 h-16 w-16 flex-shrink-0 bg-white ring-8 ring-white" />
                  <div className="h-16 w-16 flex-shrink-0 animate-pulse rounded-full bg-slate-200" />
                </div>
                <div className="mt-0.5 w-full animate-pulse pt-5">
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-1/2 rounded bg-slate-200" />
                    <div className="h-4 w-1/5 rounded bg-slate-200" />
                  </div>
                  <div className="space-y-3.5 pt-5">
                    <div className="grid w-11/12 grid-cols-3 gap-4">
                      <div className="col-span-2 h-3 rounded bg-slate-200" />
                      <div className="col-span-1 h-3 rounded bg-slate-200" />
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      <div className="col-span-1 h-3 rounded bg-slate-200" />
                      <div className="col-span-2 h-3 rounded bg-slate-200" />
                      <div className="col-span-2 h-3 rounded bg-slate-200" />
                    </div>
                    <div className="h-3 w-1/2 rounded bg-slate-200" />
                  </div>
                </div>
              </div>
            </li>
          ) : null}
        </ul>
      ) : null}
    </section>
  );
}
