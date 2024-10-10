import { apiVersion } from '@/lib/sanity/env';
import { groq } from 'next-sanity';
import { defineType } from 'sanity';

export default defineType({
  name: 'alternateSlugs',
  title: 'Alternate slugs',
  type: 'array',
  of: [
    {
      type: 'slug',
      options: {
        isUnique: async (slug, context) => {
          const { document, getClient } = context;
          const client = getClient({ apiVersion });
          const id = document?._id.replace(/^drafts\./, '') ?? '';

          return !!(await client.fetch(
            groq`!defined(*[_type == $type && ((_id in [$draft, $published] && slug.current == $slug) || !(_id in [$draft, $published]) && (slug.current == $slug || $slug in alternateSlugs[].current))][0])`,
            {
              type: document?._type ?? '',
              draft: `drafts.${id}`,
              published: id,
              slug,
            },
          ));
        },
      },
      validation: (rule) => rule.required(),
    },
  ],
  validation: (rule) => rule.unique(),
});
