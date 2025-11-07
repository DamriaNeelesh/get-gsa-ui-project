'use client';

import clsx from "clsx";

import type { PeriodFilter } from "@/lib/filters";

type PeriodFieldProps = {
  value: PeriodFilter;
  onChange: (period: PeriodFilter) => void;
};

const PRESETS: Array<{ label: string; value: 30 | 60 | 90 }> = [
  { label: "Next 30 days", value: 30 },
  { label: "Next 60 days", value: 60 },
  { label: "Next 90 days", value: 90 },
];

export const PeriodField = ({ value, onChange }: PeriodFieldProps) => {
  const currentPreset = value && "preset" in value ? value.preset : null;
  const range = value && "range" in value ? value.range : { start: "", end: "" };

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-neutral-700">Period</legend>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            className={clsx(
              "rounded-full border px-3 py-1 text-sm font-medium transition",
              currentPreset === preset.value
                ? "border-accent bg-accent text-white shadow-subtle"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-accent hover:text-accent",
            )}
            onClick={() => onChange({ preset: preset.value })}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="period-start" className="text-xs font-medium text-neutral-600">
            Start date
          </label>
          <input
            type="date"
            id="period-start"
            value={range.start ?? ""}
            onChange={(event) =>
              onChange({ range: { start: event.target.value || null, end: range.end ?? null } })
            }
            className="focus-ring rounded-lg border border-neutral-200 px-3 py-2 text-sm shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="period-end" className="text-xs font-medium text-neutral-600">
            End date
          </label>
          <input
            type="date"
            id="period-end"
            value={range.end ?? ""}
            onChange={(event) =>
              onChange({ range: { start: range.start ?? null, end: event.target.value || null } })
            }
            className="focus-ring rounded-lg border border-neutral-200 px-3 py-2 text-sm shadow-sm"
          />
        </div>
      </div>
      <button
        type="button"
        className="self-start text-sm font-medium text-accent hover:text-accent/80"
        onClick={() => onChange(null)}
      >
        Clear period
      </button>
    </fieldset>
  );
};

