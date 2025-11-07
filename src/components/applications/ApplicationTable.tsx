"use client";

import { format } from "date-fns";
import { formatDistanceToNowStrict, parseISO } from "date-fns";

import type { Application } from "@/data/applications";

type ApplicationTableProps = {
  applications: Application[];
  onSelect: (application: Application) => void;
  highlightTerms: string[];
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlight = (text: string, highlights: string[]) => {
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

export const ApplicationTable = ({
  applications,
  onSelect,
  highlightTerms,
}: ApplicationTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-subtle">
      <table className="min-w-full divide-y divide-neutral-200 text-left">
        <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              Opportunity
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Agency
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Due
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              % Complete
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Fit Score
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 text-sm text-neutral-700">
          {applications.map((app) => {
            const dueDate = parseISO(app.dueDate);
            const relative = formatDistanceToNowStrict(dueDate, {
              addSuffix: true,
            });
            return (
              <tr
                key={app.id}
                tabIndex={0}
                className="cursor-pointer transition hover:bg-accent-muted/40 focus-visible:bg-accent-muted/40"
                onClick={() => onSelect(app)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    onSelect(app);
                  }
                }}
              >
                <td className="max-w-[18rem] px-4 py-3 font-medium text-neutral-900">
                  <div className="flex flex-col gap-1">
                    <span>{highlight(app.title, highlightTerms)}</span>
                    <span className="text-xs font-medium text-neutral-500">
                      NAICS {app.naics}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {app.setAside.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-accent-muted/70 px-2 py-0.5 text-[10px] font-semibold uppercase text-accent"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{app.agency}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-semibold text-neutral-800">
                      {format(dueDate, "MMM d, yyyy")}
                    </span>
                    <span className="text-xs text-neutral-500">{relative}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-700">
                    {app.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-800">
                      {app.percentComplete}%
                    </span>
                    <div className="h-2 w-20 rounded-full bg-neutral-100">
                      <div
                        className="h-2 rounded-full bg-accent"
                        style={{ width: `${app.percentComplete}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-neutral-800">
                  {app.fitScore}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

