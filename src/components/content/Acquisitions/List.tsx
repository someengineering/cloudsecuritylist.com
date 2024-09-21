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
    <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
      {acquisitions.length > 0 ? (
        <dl className="mx-auto max-w-2xl space-y-16">
          {acquisitions?.map((acquisition) => {
            const mark =
              acquisition.mark ?? acquisition.parentOrganization?.mark;

            return (
              <div
                key={acquisition._id}
                className="group relative flex items-start space-x-8"
              >
                {mark ? (
                  <div className="flex-shrink-0 pt-2.5">
                    <Image
                      src={urlFor(mark).url()}
                      width={64}
                      height={64}
                      alt=""
                      aria-hidden="true"
                      className="h-16 w-16 object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-14 w-14 flex-shrink-0 rounded bg-slate-200" />
                )}
                <div>
                  <dt className="text-gray-900">
                    {acquisition.pressRelease ? (
                      <Link
                        href={acquisition.pressRelease}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold leading-8 text-cyan-600 focus:outline-none group-hover:text-cyan-700"
                      >
                        <span aria-hidden="true" className="absolute inset-0" />
                        {acquisition.name}
                      </Link>
                    ) : (
                      <span className="text-lg font-semibold leading-8">
                        {acquisition.name}
                      </span>
                    )}
                    {acquisition.parentOrganization ||
                    acquisition.acquisitionDate ||
                    acquisition.acquisitionPrice ? (
                      <>
                        {' '}
                        (acquired
                        {acquisition.parentOrganization ? (
                          <>
                            {' '}
                            by{' '}
                            <Link
                              href={`/organization/${acquisition.parentOrganization.slug}`}
                            >
                              {acquisition.parentOrganization.name}
                            </Link>
                          </>
                        ) : null}
                        {acquisition.acquisitionDate
                          ? ` on ${new Intl.DateTimeFormat('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }).format(new Date(acquisition.acquisitionDate))}`
                          : null}
                        {acquisition.acquisitionPrice
                          ? ` for ${new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              trailingZeroDisplay: 'stripIfInteger',
                            }).format(acquisition.acquisitionPrice)}`
                          : null}
                        )
                      </>
                    ) : null}
                  </dt>
                  <dd className="mt-1 text-base leading-7 text-gray-600">
                    {acquisition.description}
                  </dd>
                </div>
              </div>
            );
          })}
          {!error && (loading || (lastDate && lastId)) && (
            <div
              ref={sentryRef}
              className="flex animate-pulse items-start space-x-8"
              aria-hidden="true"
            >
              <div className="h-16 w-16 flex-shrink-0 rounded bg-slate-200" />
              <div className="w-full">
                <div className="flex items-end space-x-2 text-gray-900">
                  <div className="h-5 w-1/5 rounded bg-slate-200" />
                  <div className="h-4 w-1/2 rounded bg-slate-200" />
                </div>
                <div className="space-y-3 pt-4">
                  <div className="grid grid-cols-3 gap-4">
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
          )}
        </dl>
      ) : null}
    </section>
  );
}
