"use client";

import clsx from "clsx";

import type { Application } from "@/data/applications";
import { STATUSES } from "@/data/applications";

type ProgressDashboardProps = {
  applications: Application[];
};

export const ProgressDashboard = ({
  applications,
}: ProgressDashboardProps) => {
  const totals = STATUSES.reduce<Record<string, number>>((acc, status) => {
    acc[status] = applications.filter((app) => app.status === status).length;
    return acc;
  }, {});

  const totalCount = applications.length;
  const average = totalCount
    ? Math.round(
        applications.reduce((sum, app) => sum + app.percentComplete, 0) /
          totalCount,
      )
    : 0;

  return (
    <section
      aria-labelledby="progress-heading"
      className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-subtle"
    >
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h2
            id="progress-heading"
            className="text-lg font-semibold text-neutral-900"
          >
            Pursuit progress
          </h2>
          <p className="text-sm text-neutral-500">
            Snapshot of statuses across visible applications.
          </p>
        </header>

        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          {STATUSES.map((status) => (
            <div
              key={status}
              className="rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2"
            >
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                {status}
              </dt>
              <dd className="text-xl font-semibold text-neutral-900">
                {totals[status] ?? 0}
              </dd>
            </div>
          ))}
        </dl>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-neutral-500">
            <span>Status distribution</span>
            <span>{totalCount} total</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100">
            <div className="flex h-full">
              {STATUSES.map((status) => {
                const count = totals[status] ?? 0;
                if (!totalCount || !count) return null;
                return (
                  <div
                    key={status}
                    className={clsx(
                      "h-full",
                      status === "Draft" && "bg-neutral-300",
                      status === "Ready" && "bg-warning",
                      status === "Submitted" && "bg-accent",
                      status === "Awarded" && "bg-success",
                      status === "Lost" && "bg-danger",
                    )}
                    style={{ width: `${(count / totalCount) * 100}%` }}
                    aria-label={`${status} ${count}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-neutral-500">
            <span>Average completion</span>
            <span>{average}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-neutral-100">
            <div
              className="h-2 rounded-full bg-accent"
              style={{ width: `${average}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

