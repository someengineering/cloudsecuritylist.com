import { HiDocument, HiMicrophone, HiNewspaper } from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';
import { defineType } from 'sanity';

export enum PUBLICATION_TYPE {
  NEWSLETTER = 'newsletter',
  PODCAST = 'podcast',
  OTHER = 'other',
}

export const PUBLICATION_TYPES: Record<
  PUBLICATION_TYPE,
  { title: string; icon: IconType }
> = {
  [PUBLICATION_TYPE.NEWSLETTER]: {
    title: 'Newsletter',
    icon: HiNewspaper,
  },
  [PUBLICATION_TYPE.PODCAST]: {
    title: 'Podcast',
    icon: HiMicrophone,
  },
  [PUBLICATION_TYPE.OTHER]: {
    title: 'Other',
    icon: HiDocument,
  },
};

export default defineType({
  name: 'publicationType',
  title: 'Publication type',
  type: 'string',
  options: {
    list: Object.entries(PUBLICATION_TYPES).map(([value, type]) => ({
      title: type.title,
      value,
    })),
  },
  validation: (rule) => rule.required(),
});
