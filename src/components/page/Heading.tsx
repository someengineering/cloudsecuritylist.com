export default async function PageHeading({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  if (!title) {
    return null;
  }

  return (
    <div className="px-6 py-12 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-6 text-lg leading-8 text-gray-600">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
