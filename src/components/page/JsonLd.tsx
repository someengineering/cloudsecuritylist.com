import { Thing, WithContext } from 'schema-dts';

export default function PageHeader({
  schema,
}: {
  schema?: WithContext<Thing> | WithContext<Thing>[];
}) {
  if (!schema) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}
