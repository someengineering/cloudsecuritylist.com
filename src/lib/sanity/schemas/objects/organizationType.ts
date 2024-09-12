import {
  HiAcademicCap,
  HiBuildingOffice,
  HiBuildingOffice2,
  HiGiftTop,
  HiPuzzlePiece,
  HiShieldCheck,
} from 'react-icons/hi2';
import { defineType } from 'sanity';

export enum ORGANIZATION_TYPE {
  PUBLIC = 'public',
  PRIVATE = 'private',
  ACQUIRED = 'acquired',
  NONPROFIT = 'nonprofit',
  GOVERNMENT = 'government',
  ACADEMIC = 'academic',
}

export const ORGANIZATION_TYPES = [
  {
    title: 'Public company',
    value: ORGANIZATION_TYPE.PUBLIC,
    icon: HiBuildingOffice2,
  },
  {
    title: 'Private company',
    value: ORGANIZATION_TYPE.PRIVATE,
    icon: HiBuildingOffice,
  },
  {
    title: 'Acquired entity',
    value: ORGANIZATION_TYPE.ACQUIRED,
    icon: HiPuzzlePiece,
  },
  {
    title: 'Nonprofit',
    value: ORGANIZATION_TYPE.NONPROFIT,
    icon: HiGiftTop,
  },
  {
    title: 'Government entity',
    value: ORGANIZATION_TYPE.GOVERNMENT,
    icon: HiShieldCheck,
  },
  {
    title: 'Academic institution',
    value: ORGANIZATION_TYPE.ACADEMIC,
    icon: HiAcademicCap,
  },
];

export default defineType({
  name: 'organizationType',
  title: 'Organization type',
  type: 'string',
  options: {
    list: ORGANIZATION_TYPES.map((type) => ({
      title: type.title,
      value: type.value,
    })),
  },
  validation: (rule) => rule.required(),
});
