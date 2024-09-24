export default function Footer({
  copyright,
  navigation,
}: {
  copyright?: string;
  navigation?: { name: string; href: string }[];
}) {
  return (
    <footer className="mx-auto max-w-7xl space-y-10 overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
      {(navigation ?? []).length > 3 ? (
        <nav
          aria-label="Footer"
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
        >
          {navigation?.map((item) => (
            <div key={item.name} className="pb-6">
              <a
                href={item.href}
                className="text-sm leading-6 text-gray-600 hover:text-gray-800"
              >
                {item.name}
              </a>
            </div>
          ))}
        </nav>
      ) : null}
      <p className="text-center text-xs leading-5 text-gray-500">{copyright}</p>
    </footer>
  );
}
