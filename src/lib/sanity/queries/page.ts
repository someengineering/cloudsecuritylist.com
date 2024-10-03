import { PAGE } from '@/lib/sanity/queries/fragments/page';
import { groq } from 'next-sanity';

export const PAGE_SLUGS_QUERY = groq`
  *[
    _type == "page" &&
    defined(slug.current)
  ].slug.current
`;

export const PAGES_QUERY = groq`
  *[
    _type == "page" &&
    defined(slug.current)
  ] {
    ${PAGE}
  }
`;

export const PAGE_QUERY = groq`
  *[
    _type == "page" &&
    slug.current == $slug
  ][0] {
    _createdAt,
    _updatedAt,
    "_listItemsUpdatedAt": select(
      defined(listType) => *[_type == ^.listType] | order(_updatedAt desc) [0]._updatedAt,
      null
    ),
    ${PAGE}
  } {
    ...,
    "_updatedAt": select(
      defined(_listItemsUpdatedAt) && _listItemsUpdatedAt >= _updatedAt => _listItemsUpdatedAt,
      _updatedAt
    ),
    "_listItemsUpdatedAt": null,
  }
`;
