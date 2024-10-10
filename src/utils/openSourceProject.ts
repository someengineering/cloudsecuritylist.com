import { urlFor } from '@/lib/sanity/image';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import parseGithubUrl from 'parse-github-url';

export const repositoryHost = (repositoryUrl: string) => {
  try {
    return new URL(repositoryUrl).hostname.replace('www.', '');
  } catch {
    return undefined;
  }
};

export const projectImage = ({
  mark,
  repositoryUrl,
  organizationMark,
}: {
  mark?: SanityImageSource | null;
  repositoryUrl?: string;
  organizationMark?: SanityImageSource | null;
}) => {
  if (mark) {
    return urlFor(mark).url();
  }

  try {
    if (
      repositoryUrl &&
      new URL(repositoryUrl).hostname.includes('github.com')
    ) {
      const githubOwner = parseGithubUrl(repositoryUrl)?.owner;

      if (githubOwner) {
        return `https://avatars.githubusercontent.com/${githubOwner}`;
      }
    }
  } catch {
    /* ignore invalid repository URLs */
  }

  if (organizationMark) {
    return urlFor(organizationMark).url();
  }
};
