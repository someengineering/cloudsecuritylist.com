import { urlFor } from '@/lib/sanity/image';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import parseGithubUrl from 'parse-github-url';

export const projectImage = ({
  mark,
  repository,
  organizationMark,
}: {
  mark?: SanityImageSource | null;
  repository?: string;
  organizationMark?: SanityImageSource | null;
}) => {
  if (mark) {
    return urlFor(mark).url();
  }

  if (repository?.includes('github.com')) {
    const githubOwner = parseGithubUrl(repository)?.owner;

    if (githubOwner) {
      return `https://avatars.githubusercontent.com/${githubOwner}`;
    }
  }

  if (organizationMark) {
    return urlFor(organizationMark).url();
  }
};
