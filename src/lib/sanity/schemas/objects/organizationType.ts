import {
  HiAcademicCap,
  HiBuildingOffice,
  HiBuildingOffice2,
  HiGiftTop,
  HiPuzzlePiece,
  HiShieldCheck,
} from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';
import { defineType } from 'sanity';

export enum ORGANIZATION_TYPE {
  PUBLIC = 'public',
  PRIVATE = 'private',
  ACQUIRED = 'acquired',
  NONPROFIT = 'nonprofit',
  GOVERNMENT = 'government',
  ACADEMIC = 'academic',
}

export const ORGANIZATION_TYPES: Record<
  ORGANIZATION_TYPE,
  { title: string; icon: IconType }
> = {
  [ORGANIZATION_TYPE.PUBLIC]: {
    title: 'Public company',
    icon: HiBuildingOffice2,
  },
  [ORGANIZATION_TYPE.PRIVATE]: {
    title: 'Private company',
    icon: HiBuildingOffice,
  },
  [ORGANIZATION_TYPE.ACQUIRED]: {
    title: 'Acquired entity',
    icon: HiPuzzlePiece,
  },
  [ORGANIZATION_TYPE.NONPROFIT]: {
    title: 'Nonprofit',
    icon: HiGiftTop,
  },
  [ORGANIZATION_TYPE.GOVERNMENT]: {
    title: 'Government entity',
    icon: HiShieldCheck,
  },
  [ORGANIZATION_TYPE.ACADEMIC]: {
    title: 'Academic institution',
    icon: HiAcademicCap,
  },
};

export default defineType({
  name: 'organizationType',
  title: 'Organization type',
  type: 'string',
  options: {
    list: Object.entries(ORGANIZATION_TYPES).map(([value, type]) => ({
      title: type.title,
      value,
    })),
  },
  validation: (rule) => rule.required(),
});
