import { apiVersion } from '@/lib/sanity/env';
import {
  ORGANIZATION_TYPE,
  ORGANIZATION_TYPES,
} from '@/lib/sanity/schemas/objects/organizationType';
import {
  BasketIcon,
  CaseIcon,
  CogIcon,
  DashboardIcon,
  DocumentsIcon,
  SchemaIcon,
  TagsIcon,
} from '@sanity/icons';
import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S, context) =>
  context.currentUser?.email?.includes('@some.engineering')
    ? S.list()
        .title('Cloud Security List')
        .items([
          S.documentTypeListItem('cloudProvider').title('Cloud providers'),
          S.divider(),
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
                .child((marketSegmentId) =>
                  S.documentTypeList('productCategory')
                    .title('Product categories')
                    .apiVersion(apiVersion)
                    .filter('$marketSegmentId == marketSegment._ref')
                    .params({ marketSegmentId })
                    .initialValueTemplates([
                      S.initialValueTemplateItem(
                        'product-category-by-market-segment',
                        { marketSegmentId },
                      ),
                    ]),
                ),
            ),
          S.divider(),
          S.documentTypeListItem('organization').title('Organizations'),
          S.listItem()
            .title('Organizations by type')
            .icon(TagsIcon)
            .child(
              S.list()
                .id('organizationType')
                .title('Organization types')
                .items(
                  ORGANIZATION_TYPES.map((type) =>
                    S.listItem()
                      .id(type.value)
                      .title(type.title)
                      .icon(type.icon)
                      .child((organizationType) =>
                        S.documentTypeList('organization')
                          .title('Organizations')
                          .apiVersion(apiVersion)
                          .filter('organizationType == $organizationType')
                          .params({ organizationType })
                          .initialValueTemplates([
                            S.initialValueTemplateItem('organization-by-type', {
                              organizationType,
                            }),
                          ]),
                      ),
                  ),
                ),
            ),
          S.listItem()
            .title('Vendors by product category')
            .icon(CaseIcon)
            .child(
              S.documentTypeList('marketSegment')
                .apiVersion(apiVersion)
                .child((marketSegmentId) =>
                  S.documentTypeList('productCategory')
                    .title('Product categories')
                    .apiVersion(apiVersion)
                    .filter('$marketSegmentId == marketSegment._ref')
                    .params({ marketSegmentId })
                    .initialValueTemplates([
                      S.initialValueTemplateItem(
                        'product-category-by-market-segment',
                        { marketSegmentId },
                      ),
                    ])
                    .child((productCategoryId) =>
                      S.documentTypeList('organization')
                        .title('Vendors')
                        .apiVersion(apiVersion)
                        .filter(
                          `organizationType != "${ORGANIZATION_TYPE.ACQUIRED}" && $productCategoryId in productCategories[]._ref`,
                        )
                        .params({ productCategoryId })
                        .initialValueTemplates([
                          S.initialValueTemplateItem(
                            'organization-by-product-category',
                            { productCategoryId },
                          ),
                        ]),
                    ),
                ),
            ),
          S.listItem()
            .title('Vendors by cloud provider')
            .icon(CaseIcon)
            .child(
              S.documentTypeList('cloudProvider')
                .apiVersion(apiVersion)
                .child((cloudProviderId) =>
                  S.documentTypeList('organization')
                    .title('Vendors')
                    .apiVersion(apiVersion)
                    .filter(
                      `organizationType != "${ORGANIZATION_TYPE.ACQUIRED}" && $cloudProviderId in supportedCloudProviders[]._ref`,
                    )
                    .params({ cloudProviderId })
                    .initialValueTemplates([
                      S.initialValueTemplateItem(
                        'organization-by-cloud-provider',
                        {
                          cloudProviderId,
                        },
                      ),
                    ]),
                ),
            ),
          S.listItem()
            .title('Acquisitions by organization')
            .icon(BasketIcon)
            .child(
              S.documentTypeList('organization')
                .apiVersion(apiVersion)
                .filter(
                  `organizationType != "${ORGANIZATION_TYPE.ACQUIRED}" && count(*[_type == "organization" && parentOrganization._ref == ^._id]) > 0`,
                )
                .child((parentOrganizationId) =>
                  S.documentTypeList('organization')
                    .title('Acquisitions')
                    .apiVersion(apiVersion)
                    .filter('$parentOrganizationId == parentOrganization._ref')
                    .params({ parentOrganizationId })
                    .initialValueTemplates([
                      S.initialValueTemplateItem('organization-by-parent', {
                        parentOrganizationId,
                      }),
                    ]),
                ),
            ),
          S.divider(),
          S.documentTypeListItem('research'),
          S.documentTypeListItem('openSourceProject').title(
            'Open-source projects',
          ),
          S.documentTypeListItem('framework')
            .title('Frameworks')
            .icon(DocumentsIcon),
          S.divider(),
          S.documentTypeListItem('page').title('Pages').icon(DocumentsIcon),
          S.listItem()
            .title('Site settings')
            .icon(CogIcon)
            .child(
              S.document()
                .schemaType('siteSettings')
                ?.documentId('siteSettings'),
            ),
        ])
    : S.documentTypeList('organization')
        .title('Cloud security vendors')
        .apiVersion(apiVersion)
        .filter(
          '_type == "organization" && organizationType in $organizationTypes',
        )
        .params({
          organizationTypes: [
            ORGANIZATION_TYPE.PRIVATE,
            ORGANIZATION_TYPE.PUBLIC,
          ],
        });
