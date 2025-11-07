'use client';

import { useMemo } from "react";

import { AgencyCombobox } from "@/components/filters/AgencyCombobox";
import { KeywordInput } from "@/components/filters/KeywordInput";
import { MultiSelectField } from "@/components/filters/MultiSelectField";
import type { Option } from "@/components/filters/SelectField";
import { SelectField } from "@/components/filters/SelectField";
import { PeriodField } from "@/components/filters/PeriodField";
import { Button } from "@/components/ui/Button";
import type { FilterState } from "@/lib/filters";

type ParameterPanelProps = {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
  onSavePreset: () => void;
  onLoadPreset: () => void;
  hasPreset: boolean;
  onApply: () => void;
  ceilingError: string | null;
  disabled?: boolean;
  naicsOptions: Option[];
  setAsideOptions: Option[];
  vehicleOptions: Option[];
  agencyOptions: string[];
  appliedKeywordHighlights: string[];
};

export const ParameterPanel = ({
  filters,
  onChange,
  onReset,
  onSavePreset,
  onLoadPreset,
  hasPreset,
  onApply,
  ceilingError,
  disabled = false,
  naicsOptions,
  setAsideOptions,
  vehicleOptions,
  agencyOptions,
  appliedKeywordHighlights,
}: ParameterPanelProps) => {
  const helperKeywords = useMemo(() => {
    if (!appliedKeywordHighlights.length) return "";
    return `Active keywords: ${appliedKeywordHighlights.join(", ")}`;
  }, [appliedKeywordHighlights]);

  return (
    <aside
      aria-label="Search parameters"
      className="sticky top-4 flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-subtle ring-1 ring-neutral-200/70"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Criteria</h2>
          <p className="text-sm text-neutral-500">
            Tune the workspace by combining structured filters with quick keyword chips.
          </p>
        </div>
        <Button variant="ghost" type="button" onClick={onReset} aria-label="Reset all filters">
          Reset all
        </Button>
      </div>

      <SelectField
        id="naics"
        label="NAICS"
        placeholder="Select a NAICS code"
        value={filters.naics}
        onChange={(value) => onChange({ ...filters, naics: value })}
        options={naicsOptions}
        helperText="Matches must be an exact NAICS code."
      />

      <MultiSelectField
        id="setAside"
        label="Set-Aside"
        placeholder="Choose set-aside tags"
        values={filters.setAsides}
        onChange={(values) => onChange({ ...filters, setAsides: values })}
        options={setAsideOptions}
      />

      <SelectField
        id="vehicle"
        label="Vehicle"
        placeholder="Select contract vehicle"
        value={filters.vehicle}
        onChange={(value) => onChange({ ...filters, vehicle: value })}
        options={vehicleOptions}
      />

      <AgencyCombobox
        id="agency"
        label="Agencies"
        options={agencyOptions}
        values={filters.agencies}
        onChange={(agencies) => onChange({ ...filters, agencies })}
      />

      <PeriodField
        value={filters.period}
        onChange={(period) => onChange({ ...filters, period })}
      />

      <fieldset className="grid gap-2 sm:grid-cols-2">
        <legend className="text-sm font-medium text-neutral-700">Ceiling ($)</legend>
        <label className="flex flex-col gap-1 text-xs font-medium text-neutral-600">
          Minimum
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={filters.ceiling.min ?? ""}
            onChange={(event) =>
              onChange({
                ...filters,
                ceiling: {
                  ...filters.ceiling,
                  min: event.target.value === "" ? null : Number(event.target.value),
                },
              })
            }
            className="focus-ring rounded-lg border border-neutral-200 px-3 py-2 text-sm shadow-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-neutral-600">
          Maximum
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={filters.ceiling.max ?? ""}
            onChange={(event) =>
              onChange({
                ...filters,
                ceiling: {
                  ...filters.ceiling,
                  max: event.target.value === "" ? null : Number(event.target.value),
                },
              })
            }
            className="focus-ring rounded-lg border border-neutral-200 px-3 py-2 text-sm shadow-sm"
          />
        </label>
        <p className="col-span-full text-xs text-neutral-500" role={ceilingError ? "alert" : undefined}>
          {ceilingError ?? "Provide either bound or both for a range."}
        </p>
      </fieldset>

      <KeywordInput
        values={filters.keywords}
        onChange={(keywords) => onChange({ ...filters, keywords })}
      />
      {helperKeywords ? (
        <div className="rounded-lg border border-dashed border-accent-muted/80 bg-accent-muted/30 px-3 py-2 text-xs text-neutral-600">
          {helperKeywords}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-4">
        <Button type="button" onClick={onApply} disabled={disabled || Boolean(ceilingError)} fullWidth>
          Apply
        </Button>
        <Button type="button" variant="secondary" onClick={onSavePreset} disabled={disabled}>
          Save preset
        </Button>
        <Button type="button" variant="ghost" onClick={onLoadPreset} disabled={!hasPreset || disabled}>
          Load preset
        </Button>
      </div>
    </aside>
  );
};

