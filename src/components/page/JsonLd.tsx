import { headers } from 'next/headers';
import { Thing, WithContext } from 'schema-dts';

export default async function PageHeader({
  schema,
}: {
  schema?: WithContext<Thing> | WithContext<Thing>[];
}) {
  if (!schema) {
    return null;
  }

  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
      nonce={nonce}
    />
  );
}
