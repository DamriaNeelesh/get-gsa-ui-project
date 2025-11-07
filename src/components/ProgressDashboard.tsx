'use client';

import { useMemo } from "react";

import type { Application, ApplicationStatus } from "@/data/applications";

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  Draft: "bg-neutral-200 text-neutral-700",
  Ready: "bg-accent-muted text-accent",
  Submitted: "bg-sky-100 text-sky-700",
  Awarded: "bg-success-muted text-success",
  Lost: "bg-danger-muted text-danger",
};

type ProgressDashboardProps = {
  applications: Application[];
};

export const ProgressDashboard = ({ applications }: ProgressDashboardProps) => {
  const { counts, averageComplete } = useMemo(() => {
    const statusCounts: Record<ApplicationStatus, number> = {
      Draft: 0,
      Ready: 0,
      Submitted: 0,
      Awarded: 0,
      Lost: 0,
    };

    let totalComplete = 0;
    applications.forEach((application) => {
      statusCounts[application.status] += 1;
      totalComplete += application.percentComplete;
    });

    const average = applications.length
      ? Math.round(totalComplete / applications.length)
      : 0;

    return { counts: statusCounts, averageComplete: average };
  }, [applications]);

  const total = applications.length || 1;

  return (
    <section
      aria-label="Progress dashboard"
      className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-subtle ring-1 ring-neutral-200/70"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Progress pulse</h2>
          <p className="text-sm text-neutral-500">
            Snapshot of the visible opportunities grouped by status and completion.
          </p>
        </div>
        <span className="rounded-full bg-accent-muted px-3 py-1 text-xs font-semibold text-accent">
          {applications.length} visible
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Object.entries(counts).map(([status, value]) => (
          <div
            key={status}
            className="rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-center text-sm font-medium text-neutral-600"
          >
            <dt className="text-xs uppercase tracking-wide text-neutral-400">{status}</dt>
            <dd className="text-xl font-semibold text-neutral-900">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-medium text-neutral-600">
          <span>Status mix</span>
          <span>100%</span>
        </div>
        <div className="flex overflow-hidden rounded-full border border-neutral-200 bg-neutral-100" aria-hidden>
          {Object.entries(counts).map(([status, value]) => {
            const percentage = (value / total) * 100;
            return (
              <div
                key={status}
                style={{ width: `${percentage}%` }}
                className={`h-3 transition-[width] duration-500 ${STATUS_COLORS[status as ApplicationStatus].split(" ")[0]}`}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
          {Object.entries(counts).map(([status, value]) => {
            const color = STATUS_COLORS[status as ApplicationStatus];
            return (
              <span key={status} className="flex items-center gap-1">
                <span className={`h-2 w-2 rounded-full ${color.split(" ")[0]}`} aria-hidden />
                {status}
                <span className="font-semibold text-neutral-700">{Math.round((value / total) * 100)}%</span>
              </span>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-medium text-neutral-600">
          <span>Average completion</span>
          <span>{averageComplete}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500"
            style={{ width: `${averageComplete}%` }}
            role="progressbar"
            aria-valuenow={averageComplete}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Average percent complete"
          />
        </div>
      </div>
    </section>
  );
};

