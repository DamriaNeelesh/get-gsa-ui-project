"use client";

import { format } from "date-fns";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import clsx from "clsx";

import type { Application } from "@/data/applications";

type ApplicationCardProps = {
  application: Application;
  onClick: () => void;
  highlightTerms: string[];
};

const statusTone: Record<Application["status"], string> = {
  Draft: "bg-neutral-100 text-neutral-700 border-neutral-200",
  Ready: "bg-warning-muted text-warning border-warning/70",
  Submitted: "bg-accent-muted text-accent border-accent/50",
  Awarded: "bg-success-muted text-success border-success/70",
  Lost: "bg-danger-muted text-danger border-danger/70",
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const renderWithHighlight = (text: string, highlights: string[]) => {
  if (!highlights.length) return text;
  const pattern = new RegExp(
    `(${highlights.map((term) => escapeRegExp(term)).join("|")})`,
    "gi",
  );
  const segments = text.split(pattern);

  return segments.map((segment, index) => {
    if (!segment) return null;
    const isMatch = highlights.some(
      (term) => segment.toLowerCase() === term.toLowerCase(),
    );
    if (isMatch) {
      return (
        <mark
          key={`${segment}-${index}`}
          className="rounded bg-accent-muted px-1 py-0.5 text-accent"
        >
          {segment}
        </mark>
      );
    }
    return <span key={`${segment}-${index}`}>{segment}</span>;
  });
};

export const ApplicationCard = ({
  application,
  onClick,
  highlightTerms,
}: ApplicationCardProps) => {
  const dueDate = parseISO(application.dueDate);
  const relativeDue = formatDistanceToNowStrict(dueDate, { addSuffix: true });

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      className="focus-ring flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-subtle transition hover:-translate-y-0.5 hover:shadow-card"
      aria-label={`View ${application.title}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-neutral-900">
            {renderWithHighlight(application.title, highlightTerms)}
          </h3>
          <p className="text-sm text-neutral-500">
            {application.agency} • NAICS {application.naics}
          </p>
        </div>
        <span
          className={clsx(
            "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
            statusTone[application.status],
          )}
        >
          {application.status}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
        <span className="rounded-full bg-neutral-100 px-2 py-1 text-neutral-600">
          {relativeDue}
        </span>
        <span className="rounded-full bg-neutral-100 px-2 py-1 text-neutral-600">
          Due {format(dueDate, "MMM d, yyyy")}
        </span>
        <span className="rounded-full bg-neutral-100 px-2 py-1 text-neutral-600">
          Fit Score {application.fitScore}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {application.setAside.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-accent-muted/70 px-2 py-1 text-xs font-semibold text-accent"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-neutral-500">
            % complete
          </span>
          <div className="mt-1 h-2 w-full rounded-full bg-neutral-100 sm:w-32">
            <div
              className="h-2 rounded-full bg-accent transition-all"
              style={{ width: `${application.percentComplete}%` }}
            />
          </div>
        </div>
        <div className="flex flex-col text-left sm:text-right">
          <span className="text-xs font-medium text-neutral-500">
            Ceiling
          </span>
          <span className="text-sm font-semibold text-neutral-800">
            ${application.ceiling.toLocaleString()}
          </span>
        </div>
      </div>
    </article>
  );
};

