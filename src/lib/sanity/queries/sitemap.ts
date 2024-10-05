import { groq } from 'next-sanity';

export const SITEMAP_QUERY = groq`
  *[ _type == "siteSettings" && _id == "siteSettings" ][0] {
    "items":
      [{
        url,
        "lastModified": _updatedAt,
      }] +
      (*[_type == "page" && defined(slug.current)] | order(slug.current asc) {
        "url": ^.url + "/" + slug.current,
        "lastModified": [
          { "timestamp": _updatedAt },
          select(defined(listType) => { "timestamp": *[_type == ^.listType] | order(_updatedAt desc) [0]._updatedAt }),
        ],
      } { url, "lastModified": lastModified | order(coalesce(timestamp, "") desc) [0].timestamp }) +
      (*[_type == "productCategory" && defined(slug.current)] | order(slug.current asc) {
        "url": ^.url + "/category/" + slug.current,
        "lastModified": [
          { "timestamp": _updatedAt },
          { "timestamp": *[_type == "marketSegment" && _id == ^.marketSegment._ref] | order(_updatedAt desc) [0]._updatedAt },
          { "timestamp": *[_type == "organization" && organizationType != "acquired" && ^._id in productCategories[]._ref] | order(_updatedAt desc) [0]._updatedAt },
          { "timestamp": *[_type == "productCategory" && _id in ^.similarCategories[]._ref] | order(_updatedAt desc) [0]._updatedAt },
        ],
      } { url, "lastModified": lastModified | order(coalesce(timestamp, "") desc) [0].timestamp }) +
      (*[_type == "organization" && defined(slug.current) && organizationType != "acquired"] | order(slug.current asc) {
        "url": ^.url + "/organization/" + slug.current,
        "lastModified": [
          { "timestamp": _updatedAt },
          { "timestamp": *[_type == "cloudProvider" && _id in ^.supportedCloudProviders[]._ref] | order(_updatedAt desc) [0]._updatedAt },
          { "timestamp": *[_type == "productCategory" && _id in ^.productCategories[]._ref] | order(_updatedAt desc) [0]._updatedAt },
          { "timestamp": *[_type == "organization" && organizationType == "acquired" && parentOrganization._ref == ^._id] | order(_updatedAt desc) [0]._updatedAt },
          { "timestamp": *[_type == "research" && organization._ref == ^._id] | order(_updatedAt desc) [0]._updatedAt },
        ],
      } { url, "lastModified": lastModified | order(coalesce(timestamp, "") desc) [0].timestamp }) +
      (*[_type == "cloudProvider" && defined(slug.current)] | order(slug.current asc) {
        "url": ^.url + "/provider/" + slug.current,
        "lastModified": [
          { "timestamp": _updatedAt },
          { "timestamp": *[_type == "organization" && organizationType != "acquired" && ^._id in supportedCloudProviders[]._ref] | order(_updatedAt desc) [0]._updatedAt },
        ],
      } { url, "lastModified": lastModified | order(coalesce(timestamp, "") desc) [0].timestamp })
  }.items
`;
