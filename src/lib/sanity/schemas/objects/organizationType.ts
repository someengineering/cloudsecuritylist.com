import {
  AcademicCapIcon,
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  CodeBracketSquareIcon,
  GiftTopIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
} from '@heroicons/react/16/solid';
import { defineType } from 'sanity';

export enum ORGANIZATION_TYPE {
  PUBLIC = 'public',
  PRIVATE = 'private',
  NONPROFIT = 'nonprofit',
  GOVERNMENT = 'government',
  ACADEMIC = 'academic',
  OPEN_SOURCE = 'open-source',
  SUBSIDIARY = 'subsidiary',
}

export const ORGANIZATION_TYPES = [
  {
    title: 'Public company',
    value: ORGANIZATION_TYPE.PUBLIC,
    icon: BuildingOffice2Icon,
  },
  {
    title: 'Private company',
    value: ORGANIZATION_TYPE.PRIVATE,
    icon: BuildingOfficeIcon,
  },
  {
    title: 'Nonprofit',
    value: ORGANIZATION_TYPE.NONPROFIT,
    icon: GiftTopIcon,
  },
  {
    title: 'Government entity',
    value: ORGANIZATION_TYPE.GOVERNMENT,
    icon: ShieldCheckIcon,
  },
  {
    title: 'Academic institution',
    value: ORGANIZATION_TYPE.ACADEMIC,
    icon: AcademicCapIcon,
  },
  {
    title: 'Open-source project',
    value: ORGANIZATION_TYPE.OPEN_SOURCE,
    icon: CodeBracketSquareIcon,
  },
  {
    title: 'Corporate subsidiary',
    value: ORGANIZATION_TYPE.SUBSIDIARY,
    icon: Squares2X2Icon,
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
