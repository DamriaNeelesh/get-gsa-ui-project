"use client";

export const ResultsSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-subtle"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 w-1/2 rounded bg-neutral-200" />
            <div className="h-6 w-24 rounded-full bg-neutral-200" />
          </div>
          <div className="h-4 w-1/3 rounded bg-neutral-200" />
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full bg-neutral-200" />
            <div className="h-6 w-20 rounded-full bg-neutral-200" />
            <div className="h-6 w-12 rounded-full bg-neutral-200" />
          </div>
          <div className="h-2 w-full rounded bg-neutral-200" />
        </div>
      ))}
    </div>
  );
};

