import type { IntersectionObserverHookRefCallback } from 'react-intersection-observer-hook';

export default function CardSkeleton({
  ref,
  label = true,
  tags = true,
}: {
  ref: IntersectionObserverHookRefCallback;
  label?: boolean;
  tags?: boolean;
}) {
  return (
    <li
      ref={ref}
      className="relative rounded-lg border border-gray-300 bg-white p-4 shadow-sm lg:px-5"
      aria-hidden="true"
    >
      <div className="flex h-full animate-pulse flex-col space-y-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 flex-shrink-0 rounded bg-slate-200 sm:h-14 sm:w-14" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex flex-grow flex-col items-start">
                <div className="mb-2.5 h-5 w-3/4 rounded bg-slate-200" />
                {label ? (
                  <div className="h-3 w-1/2 rounded bg-slate-200" />
                ) : null}
              </div>
              <ul
                role="list"
                className="z-10 hidden items-end gap-x-2.5 xs:flex"
              >
                {[...Array(3)].map((_val, idx) => (
                  <li key={`skeleton-icon-${idx}`}>
                    <div className="h-5 w-5 rounded bg-slate-200" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="space-y-2.5 pt-1.5">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 h-2 rounded bg-slate-200" />
            <div className="col-span-1 h-2 rounded bg-slate-200" />
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-2 h-2 rounded bg-slate-200" />
            <div className="col-span-3 h-2 rounded bg-slate-200" />
          </div>
          <div className="h-2 w-1/2 rounded bg-slate-200" />
        </div>
        {tags ? (
          <div className="flex grow flex-wrap items-end gap-x-2 gap-y-1.5 pb-1">
            {[...Array(5)].map((_val, idx) => (
              <div
                className="flex h-4 w-10 rounded bg-slate-200"
                key={`skeleton-tag-${idx}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </li>
  );
}
