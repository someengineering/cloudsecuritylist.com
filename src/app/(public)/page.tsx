import Vendors from '@/components/content/Vendors';
import { ORGANIZATION_TYPE } from '@/lib/sanity/schemas/objects/organizationType';

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { category: productCategories, type: organizationTypes } = searchParams;

  return (
    <>
      <Vendors
        filters={{
          productCategories:
            typeof productCategories === 'string'
              ? [productCategories]
              : (productCategories ?? []),
          organizationTypes:
            typeof organizationTypes === 'string'
              ? Object.values<string>(ORGANIZATION_TYPE).includes(
                  organizationTypes,
                )
                ? [organizationTypes as ORGANIZATION_TYPE]
                : []
              : ((organizationTypes?.filter(
                  (type) => type in ORGANIZATION_TYPE,
                ) as ORGANIZATION_TYPE[]) ?? []),
        }}
      />
    </>
  );
}
