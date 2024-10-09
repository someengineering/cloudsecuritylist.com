import { CLOUD_PROVIDER_UPDATED_AT } from '@/lib/sanity/queries/fragments/cloudProvider';
import { OPEN_SOURCE_PROJECT_UPDATED_AT } from '@/lib/sanity/queries/fragments/openSourceProject';
import { ORGANIZATION_UPDATED_AT } from '@/lib/sanity/queries/fragments/organization';
import { PAGE_UPDATED_AT } from '@/lib/sanity/queries/fragments/page';
import { PRODUCT_CATEGORY_UPDATED_AT } from '@/lib/sanity/queries/fragments/productCategory';
import { groq } from 'next-sanity';

export const SITEMAP_QUERY = groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    "items":
      [{ url, "created": _createdAt, "lastModified": _updatedAt }] +
      *[_type == "page" && defined(slug.current) && (!defined(unlisted) || unlisted == false)] | order(slug.current asc) {
        "url": ^.url + "/" + slug.current,
        "created": _createdAt,
        "lastModified": ${PAGE_UPDATED_AT}
      } +
      *[_type == "productCategory" && defined(slug.current)] | order(slug.current asc) {
        "url": ^.url + "/category/" + slug.current,
        "created": _createdAt,
        "lastModified": ${PRODUCT_CATEGORY_UPDATED_AT}
      } +
      *[_type == "organization" && defined(slug.current) && organizationType != "acquired"] | order(slug.current asc) {
        "url": ^.url + "/organization/" + slug.current,
        "created": _createdAt,
        "lastModified": ${ORGANIZATION_UPDATED_AT}
      } +
      *[_type == "openSourceProject" && defined(slug.current) && name != organization->name] | order(slug.current asc) {
        "url": ^.url + "/open-source/" + slug.current,
        "created": _createdAt,
        "lastModified": ${OPEN_SOURCE_PROJECT_UPDATED_AT}
      } +
      *[_type == "cloudProvider" && defined(slug.current)] | order(slug.current asc) {
        "url": ^.url + "/provider/" + slug.current,
        "created": _createdAt,
        "lastModified": ${CLOUD_PROVIDER_UPDATED_AT}
      }
  }.items [defined(url)] | { url, "lastModified": coalesce(lastModified, created) }
`;
