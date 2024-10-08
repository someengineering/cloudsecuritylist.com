'use client';

import {
  Filters,
  useFilters,
} from '@/components/content/OpenSourceProjects/Context';
import { urlFor } from '@/lib/sanity/image';
import { ORGANIZATION_TYPES } from '@/lib/sanity/schemas/objects/organizationType';
import { OPEN_SOURCE_PROJECTS_QUERYResult } from '@/lib/sanity/types';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import parseGithubUrl from 'parse-github-url';
import { useEffect, useState } from 'react';
import { HiCodeBracket } from 'react-icons/hi2';
import { SiGithub, SiGitlab } from 'react-icons/si';
import useInfiniteScroll from 'react-infinite-scroll-hook';

export default function List({
  initialData,
  getOpenSourceProjects,
}: {
  initialData: OPEN_SOURCE_PROJECTS_QUERYResult;
  getOpenSourceProjects: (
    filters: Filters,
    prev?: string,
  ) => Promise<OPEN_SOURCE_PROJECTS_QUERYResult>;
}) {
  const { filters } = useFilters();
  const [openSourceProjects, setOpenSourceProjects] =
    useState<OPEN_SOURCE_PROJECTS_QUERYResult>(initialData);
  const [lastItem, setLastItem] = useState<string | undefined>(
    initialData[initialData.length - 1]?.name,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const [sentryRef] = useInfiniteScroll({
    loading: loading,
    hasNextPage: filters.paginated && !!lastItem,
    onLoadMore: async () => {
      setLoading(true);

      if (lastItem) {
        const data = await getOpenSourceProjects(filters, lastItem);

        if (!data) {
          setError(true);
          return;
        }

        if (data.length && data[data.length - 1].name !== lastItem) {
          setLastItem(data[data.length - 1].name);
          setOpenSourceProjects([...openSourceProjects, ...data]);
        } else {
          setLastItem(undefined);
        }
      }

      setLoading(false);
    },
    disabled: !filters.paginated || error,
  });

  useEffect(() => {
    setOpenSourceProjects(initialData);
    setLastItem(
      initialData.length ? initialData[initialData.length - 1].name : undefined,
    );
  }, [initialData]);

  if (!openSourceProjects?.length) {
    return null;
  }

  return (
    <ul
      role="list"
      className="container mx-auto mt-10 grid max-w-7xl auto-rows-fr grid-cols-1 gap-4 px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8"
    >
      {openSourceProjects.map((project) => {
        const githubOwner = project.repository.includes('github.com')
          ? parseGithubUrl(project.repository)?.owner
          : undefined;
        const imageUrl = project.mark
          ? urlFor(project.mark).url()
          : githubOwner
            ? `https://avatars.githubusercontent.com/${githubOwner}`
            : project.organization?.mark
              ? urlFor(project.organization.mark).url()
              : undefined;

        const organizationType = project.organization
          ? ORGANIZATION_TYPES.find(
              (type) => type.value === project.organization?.organizationType,
            )
          : undefined;
        const organizationLabel = project.organization
          ? project.organization.name !== project.name
            ? `Parent ${
                organizationType?.title.toLowerCase().includes('company')
                  ? 'company'
                  : 'organization'
              } (${project.organization.name})`
            : organizationType?.title.toLowerCase().includes('company')
              ? 'Company'
              : 'Organization'
          : undefined;

        return (
          <li
            key={project._id}
            className="relative flex flex-col space-y-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-offset-2 hover:border-gray-400 lg:px-5"
          >
            <div className="flex items-center space-x-3">
              {imageUrl ? (
                <div className="flex-shrink-0">
                  <Image
                    src={imageUrl}
                    width={56}
                    height={56}
                    alt=""
                    aria-hidden="true"
                    className={clsx(
                      'h-12 w-12 object-cover xs:h-14 xs:w-14',
                      imageUrl.includes('avatars.githubusercontent.com') &&
                        'rounded',
                    )}
                  />
                </div>
              ) : (
                <div className="h-12 w-12 flex-shrink-0 rounded bg-slate-100 xs:h-14 xs:w-14" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-start">
                    <Link
                      href={project.repository}
                      className="line-clamp-1 font-semibold text-gray-900 focus:outline-none"
                    >
                      <span aria-hidden="true" className="absolute inset-0" />
                      {project.name}
                    </Link>
                  </div>
                  <ul
                    role="list"
                    className="z-10 hidden items-end gap-x-2.5 xs:flex"
                  >
                    <li>
                      <Link
                        href={project.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {project.repository.includes('github.com') ? (
                          <>
                            <span className="sr-only">GitHub</span>
                            <SiGithub className="h-5 w-5" title="GitHub" />
                          </>
                        ) : project.repository.includes('gitlab.com') ? (
                          <>
                            <span className="sr-only">GitLab</span>
                            <SiGitlab className="h-5 w-5" title="GitLab" />
                          </>
                        ) : (
                          <>
                            <span className="sr-only">Repository</span>
                            <HiCodeBracket
                              className="h-5 w-5"
                              title="Repository"
                            />
                          </>
                        )}
                      </Link>
                    </li>
                    {project.organization && organizationType ? (
                      <li>
                        <Link
                          href={`/organization/${project.organization.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <span className="sr-only">{organizationLabel}</span>
                          <organizationType.icon
                            className="h-5 w-5"
                            title={organizationLabel}
                          />
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">{project.description}</div>
            {project.productCategories?.length ? (
              <div className="flex grow flex-wrap content-end items-end gap-x-2 gap-y-1.5">
                {project.productCategories.map((category) => (
                  <Link
                    href={`/category/${category.slug}`}
                    className="z-10 inline-flex items-center rounded-md bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-600 ring-1 ring-inset ring-cyan-500/10 hover:text-cyan-700 hover:ring-cyan-500/20"
                    key={category._id}
                  >
                    {category.expansion ? (
                      <abbr title={category.expansion} className="no-underline">
                        {category.name}
                      </abbr>
                    ) : (
                      category.name
                    )}
                  </Link>
                ))}
              </div>
            ) : null}
          </li>
        );
      })}
      {filters.paginated && !error && (loading || lastItem) ? (
        <li
          ref={sentryRef}
          className="relative rounded-lg border border-gray-300 bg-white p-4 shadow-sm lg:px-5"
          aria-hidden="true"
        >
          <div className="flex h-full animate-pulse flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 flex-shrink-0 rounded bg-slate-200 sm:h-14 sm:w-14" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex flex-grow flex-col items-start">
                    <div className="mb-2.5 h-5 w-3/4 rounded bg-slate-200" />
                  </div>
                  <ul role="list" className="flex items-end gap-x-2.5">
                    <li>
                      <div className="h-5 w-5 rounded bg-slate-200" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="space-y-3 pt-1.5">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-2 rounded bg-slate-200" />
                <div className="col-span-1 h-2 rounded bg-slate-200" />
              </div>
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-2 h-2 rounded bg-slate-200" />
                <div className="col-span-3 h-2 rounded bg-slate-200" />
              </div>
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-1 h-2 rounded bg-slate-200" />
                <div className="col-span-2 h-2 rounded bg-slate-200" />
                <div className="col-span-2 h-2 rounded bg-slate-200" />
              </div>
              <div className="h-2 w-1/2 rounded bg-slate-200" />
            </div>
            <div className="flex grow flex-wrap items-end gap-x-2 gap-y-1.5 pb-1">
              {[...Array(5)].map((_val, idx) => (
                <div
                  className="flex h-4 w-10 rounded bg-slate-200"
                  key={`skeleton-tag-${idx}`}
                />
              ))}
            </div>
          </div>
        </li>
      ) : null}
    </ul>
  );
}
