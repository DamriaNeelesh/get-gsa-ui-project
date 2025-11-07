'use client';

import { useMemo } from "react";
import {
  CalendarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  AdjustmentsHorizontalIcon,
  ListBulletIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { format, formatDistanceToNow } from "date-fns";

import type { Application } from "@/data/applications";
import type { SortOption } from "@/lib/filters";

type ApplicationsListProps = {
  applications: Application[];
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (view: "grid" | "list") => void;
  keywords: string[];
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  loading: boolean;
  onSelect: (application: Application) => void;
};

const sortOptions: Array<{ label: string; value: SortOption }> = [
  { label: "Due date", value: "dueDate" },
  { label: "% complete", value: "percentComplete" },
  { label: "Fit score", value: "fitScore" },
];

const badgeClasses: Record<Application["status"], string> = {
  Draft: "bg-neutral-100 text-neutral-700",
  Ready: "bg-accent-muted text-accent",
  Submitted: "bg-sky-100 text-sky-700",
  Awarded: "bg-success-muted text-success",
  Lost: "bg-danger-muted text-danger",
};

const highlightTitle = (title: string, keywords: string[]) => {
  if (!keywords.length) return title;
  const pattern = new RegExp(`(${keywords.map((kw) => kw.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")).join("|")})`, "ig");
  const parts = title.split(pattern);
  return parts.map((part, index) => {
    const match = keywords.some((keyword) => keyword.toLowerCase() === part.toLowerCase());
    return match ? (
      <mark key={index} className="rounded bg-accent-muted px-1 py-0.5 text-accent">
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    );
  });
};

const percentClass = (percent: number) => {
  if (percent >= 80) return "bg-success";
  if (percent >= 50) return "bg-accent";
  return "bg-warning";
};

export const ApplicationsList = ({
  applications,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  keywords,
  searchTerm,
  onSearchTermChange,
  loading,
  onSelect,
}: ApplicationsListProps) => {
  const emptyMessage = useMemo(() => {
    if (loading) return null;
    if (!applications.length) {
      return (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center text-neutral-600">
          <ClockIcon className="h-8 w-8 text-neutral-400" aria-hidden />
          <div>
            <h3 className="text-lg font-semibold text-neutral-800">No matches just yet</h3>
            <p className="text-sm text-neutral-500">
              Soften a filter, try another keyword, or load a saved preset to explore different slices of the pipeline.
            </p>
          </div>
        </div>
      );
    }
    return null;
  }, [applications.length, loading]);

  return (
    <section className="flex flex-col gap-4" aria-live="polite">
      <header className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-subtle ring-1 ring-neutral-200/70 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-1">
          <h2 className="text-lg font-semibold text-neutral-900">Applications</h2>
          <p className="text-sm text-neutral-500">
            {loading
              ? "Running filters..."
              : `${applications.length} opportunity${applications.length === 1 ? "" : "ies"} visible`}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm shadow-inner">
            <span className="sr-only">Quick search</span>
            <ArrowTrendingUpIcon className="h-4 w-4 text-neutral-400" aria-hidden />
            <input
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              placeholder="Search titles..."
              className="w-full border-none bg-transparent text-sm text-neutral-700 outline-none placeholder:text-neutral-400"
            />
          </label>
          <div className="flex items-center gap-2 self-start">
            <label htmlFor="sort-select" className="hidden text-xs font-medium uppercase tracking-wide text-neutral-500 sm:inline">
              Sort by
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(event) => onSortChange(event.target.value as SortOption)}
              className="focus-ring rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-1">
              <button
                type="button"
                className={clsx(
                  "rounded-md px-2 py-1 text-sm font-medium transition",
                  viewMode === "list"
                    ? "bg-white text-accent shadow"
                    : "text-neutral-500 hover:text-accent",
                )}
                onClick={() => onViewModeChange("list")}
                aria-label="List view"
              >
                <ListBulletIcon className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                className={clsx(
                  "rounded-md px-2 py-1 text-sm font-medium transition",
                  viewMode === "grid"
                    ? "bg-white text-accent shadow"
                    : "text-neutral-500 hover:text-accent",
                )}
                onClick={() => onViewModeChange("grid")}
                aria-label="Grid view"
              >
                <Squares2X2Icon className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className={clsx("grid gap-3", viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}
          aria-hidden
        >
          {Array.from({ length: viewMode === "grid" ? 4 : 3 }).map((_, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-6 shadow-subtle"
            >
              <div className="skeleton absolute inset-0" />
              <div className="h-5 w-1/2 rounded bg-neutral-100" />
              <div className="mt-4 h-3 w-1/3 rounded bg-neutral-100" />
              <div className="mt-8 flex gap-2">
                <div className="h-3 w-1/4 rounded bg-neutral-100" />
                <div className="h-3 w-1/5 rounded bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      ) : applications.length ? (
        <div
          className={clsx(
            "grid gap-3",
            viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1",
          )}
        >
          {applications.map((application) => {
            const due = new Date(application.dueDate);
            const relative = formatDistanceToNow(due, {
              addSuffix: true,
            });
            const dueDate = format(due, "MMM d, yyyy");

            return (
              <article
                key={application.id}
                tabIndex={0}
                role="button"
                onClick={() => onSelect(application)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(application);
                  }
                }}
                className="group flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-6 shadow-subtle transition hover:-translate-y-1 hover:shadow-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <header className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {highlightTitle(application.title, keywords)}
                    </h3>
                    <span className={clsx("rounded-full px-3 py-1 text-xs font-semibold", badgeClasses[application.status])}>
                      {application.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-500">
                    <span className="inline-flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" aria-hidden />
                      {dueDate}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" aria-hidden />
                      {relative}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <AdjustmentsHorizontalIcon className="h-4 w-4" aria-hidden />
                      Fit {application.fitScore}
                    </span>
                  </div>
                </header>

                <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 font-medium text-neutral-700">
                    {application.agency}
                  </span>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 font-medium text-neutral-700">
                    NAICS {application.naics}
                  </span>
                  {application.setAside.map((tag) => (
                    <span key={tag} className="rounded-full bg-accent-muted px-2.5 py-1 text-sm font-medium text-accent">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100" aria-hidden>
                    <div
                      className={clsx("h-full rounded-full transition-all duration-500", percentClass(application.percentComplete))}
                      style={{ width: `${application.percentComplete}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-xs font-semibold text-neutral-500">
                    {application.percentComplete}%
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        emptyMessage
      )}
    </section>
  );
};

