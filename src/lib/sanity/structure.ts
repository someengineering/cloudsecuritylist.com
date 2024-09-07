import { apiVersion } from '@/lib/sanity/env';
import {
  CaseIcon,
  CogIcon,
  DashboardIcon,
  DocumentsIcon,
  SchemaIcon,
  TagsIcon,
} from '@sanity/icons';
import type { StructureResolver } from 'sanity/structure';

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('marketSegment')
        .title('Market segments')
        .icon(DashboardIcon),
      S.documentTypeListItem('productCategory')
        .title('Product categories')
        .icon(TagsIcon),
      S.listItem()
        .title('Product categories by market segment')
        .icon(SchemaIcon)
        .child(
          S.documentTypeList('marketSegment')
            .apiVersion(apiVersion)
            .filter(
              'count(*[_type == "productCategory" && references(^._id)]) > 0',
            )
            .child((id) =>
              S.documentList()
                .title('Product categories')
                .apiVersion(apiVersion)
                .filter(
                  '_type == "productCategory" && $id == marketSegment._ref',
                )
                .params({ id }),
            ),
        ),
      S.divider(),
      S.documentTypeListItem('organization').title('Organizations'),
      S.listItem()
        .title('Vendors by product category')
        .icon(CaseIcon)
        .child(
          S.documentTypeList('marketSegment')
            .apiVersion(apiVersion)
            .filter(
              'count(*[_type == "productCategory" && references(^._id)]) > 0',
            )
            .child((id) =>
              S.documentList()
                .title('Product categories')
                .apiVersion(apiVersion)
                .filter(
                  '_type == "productCategory" && $id == marketSegment._ref',
                )
                .params({ id })
                .child((id) =>
                  S.documentList()
                    .title('Vendors')
                    .filter(
                      '_type == "organization" && $id in productCategories[]._ref',
                    )
                    .params({ id }),
                ),
            ),
        ),
      S.divider(),
      S.documentTypeListItem('research'),
      S.documentTypeListItem('framework')
        .title('Frameworks')
        .icon(DocumentsIcon),
      S.divider(),
      S.documentTypeListItem('page').title('Pages').icon(DocumentsIcon),
      S.listItem()
        .title('Site settings')
        .icon(CogIcon)
        .child(
          S.document().schemaType('siteSettings')?.documentId('siteSettings'),
        ),
    ]);
