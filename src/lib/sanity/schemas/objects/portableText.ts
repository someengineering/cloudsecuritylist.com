import { EarthGlobeIcon, LinkIcon } from '@sanity/icons';
import { Rule } from 'sanity';

export const annotations = [
  {
    name: 'link',
    type: 'object',
    title: 'Link',
    icon: EarthGlobeIcon,
    fields: [
      {
        name: 'url',
        type: 'url',
        validation: (rule: Rule) =>
          rule
            .required()
            .uri({ scheme: 'https', allowRelative: true })
            .regex(/https:\/\/(www\.)?cloudsecuritylist\.com(\/.*)?/gi, {
              invert: true,
            })
            .warning(
              `This is not an external link. Consider using an internal link instead.`,
            ),
      },
    ],
  },
  {
    name: 'internalLink',
    type: 'object',
    title: 'Internal link',
    icon: LinkIcon,
    fields: [
      {
        name: 'reference',
        type: 'reference',
        to: [
          { type: 'cloudProvider' },
          { type: 'organization' },
          { type: 'productCategory' },
        ],
      },
    ],
  },
];
