import { groq } from 'next-sanity';

export const SITEMAP_DATA_QUERY = groq`
  {
    "baseUrl": *[_type == "siteSettings" && _id == "siteSettings"][0].url,
    "items": 
      (*[_type == "page" && defined(slug.current)] {
        "url": "/" + slug.current,
        "lastModified": array::compact([
          _updatedAt,
          select(
            defined(listType) => *[_type == ^.listType] | order(_updatedAt desc) [0]._updatedAt,
            null
          ),
        ]),
      }) +
      (*[_type == "productCategory" && defined(slug.current)] {
        "url": "/category/" + slug.current,
        "lastModified": array::compact([
          _updatedAt,
          *[_type == "organization" && organizationType != "acquired" && ^._id in productCategories[]._ref] | order(_updatedAt desc) [0]._updatedAt,
          *[_type == "marketSegment" && _id == ^.marketSegment._ref] | order(_updatedAt desc) [0]._updatedAt,
        ]),
      }) +
      (*[_type == "organization" && defined(slug.current) && organizationType != "acquired"] {
        "url": "/organization/" + slug.current,
        "lastModified": array::compact([
          _updatedAt,
          *[_type == "cloudProvider" && _id in ^.supportedCloudProviders[]._ref] | order(_updatedAt desc) [0]._updatedAt,
          *[_type == "productCategory" && _id in ^.productCategories[]._ref] | order(_updatedAt desc) [0]._updatedAt,
          *[_type == "organization" && organizationType == "acquired" && parentOrganization._ref == ^._id] | order(_updatedAt desc) [0]._updatedAt,
          *[_type == "research" && organization._ref == ^._id] | order(_updatedAt desc) [0]._updatedAt,
        ]),
      }) +
      (*[_type == "cloudProvider" && defined(slug.current)] {
        "url": "/provider/" + slug.current,
        "lastModified": array::compact([
          _updatedAt,
          *[_type == "organization" && organizationType != "acquired" && ^._id in supportedCloudProviders[]._ref] | order(_updatedAt desc) [0]._updatedAt,
        ]),
      }),
  }
`;
