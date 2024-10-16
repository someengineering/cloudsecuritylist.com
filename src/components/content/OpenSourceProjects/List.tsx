'use client';

import CardGrid from '@/components/common/CardGrid';
import {
  Filters,
  useFilters,
} from '@/components/content/OpenSourceProjects/Context';
import { ORGANIZATION_TYPES } from '@/lib/sanity/schemas/objects/organizationType';
import { OPEN_SOURCE_PROJECTS_QUERYResult } from '@/lib/sanity/types';
import { projectImage, repositoryHost } from '@/utils/openSourceProject';
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
    <CardGrid
      cards={openSourceProjects.map((project) => {
        const organizationType = project.organization
          ? ORGANIZATION_TYPES[project.organization.organizationType]
          : undefined;

        const repoHost = repositoryHost(project.repository);

        return {
          href: `/open-source/${project.slug}`,
          imageSrc: projectImage({
            mark: project.mark,
            repositoryUrl: project.repository,
            organizationMark: project.organization?.mark,
          }),
          title: project.name,
          description: project.description,
          links: [
            {
              href: project.repository,
              ...(repoHost?.endsWith('github.com')
                ? { title: 'GitHub', icon: SiGithub }
                : repoHost?.endsWith('gitlab.com')
                  ? { title: 'GitLab', icon: SiGitlab }
                  : { title: 'Repository', icon: HiCodeBracket }),
            },
            ...(project.organization && organizationType
              ? [
                  {
                    title:
                      project.organization.name !== project.name
                        ? `Parent ${
                            organizationType?.title
                              .toLowerCase()
                              .includes('company')
                              ? 'company'
                              : 'organization'
                          } (${project.organization.name})`
                        : organizationType?.title
                              .toLowerCase()
                              .includes('company')
                          ? 'Company'
                          : 'Organization',
                    href: `/organization/${project.organization.slug}`,
                    icon: organizationType.icon,
                  },
                ]
              : []),
          ],
          tags: project.productCategories?.map((category) => ({
            text: category.expansion ? (
              <abbr title={category.expansion} className="no-underline">
                {category.name}
              </abbr>
            ) : (
              category.name
            ),
            href: `/category/${category.slug}`,
          })),
        };
      })}
      sentryRef={
        filters.paginated && !error && (loading || lastItem)
          ? sentryRef
          : undefined
      }
    />
  );
}
