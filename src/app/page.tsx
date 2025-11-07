"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import toast from "react-hot-toast";

import { AgencyCombobox } from "@/components/filters/AgencyCombobox";
import { KeywordInput } from "@/components/filters/KeywordInput";
import { MultiSelectField } from "@/components/filters/MultiSelectField";
import { PeriodField } from "@/components/filters/PeriodField";
import { SelectField } from "@/components/filters/SelectField";
import { Button } from "@/components/ui/Button";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { DetailsDrawer } from "@/components/applications/DetailsDrawer";
import { ResultsSkeleton } from "@/components/applications/ResultsSkeleton";
import { ProgressDashboard } from "@/components/dashboard/ProgressDashboard";
import {
  FilterState,
  SortOption,
  buildQueryFromFilters,
  defaultFilters,
  deserializeFilters,
  filterApplications,
  parseFiltersFromSearch,
  serializeFilters,
  sortApplications,
  validateCeiling,
} from "@/lib/filters";
import { applications as seedApplications } from "@/data/applications";

const LAST_FILTERS_KEY = "get-gsa:lastFilters";
const PRESET_KEY = "get-gsa:preset";
const VIEW_MODE_KEY = "get-gsa:viewMode";

type ViewMode = "cards" | "table";

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "dueDate", label: "Due date" },
  { value: "percentComplete", label: "% complete" },
  { value: "fitScore", label: "Fit score" },
];

const formatNumberInput = (value: number | null) => (value ?? "").toString();

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createFilterClone = (base: FilterState): FilterState => ({
    ...base,
    setAsides: [...base.setAsides],
    agencies: [...base.agencies],
    keywords: [...base.keywords],
    ceiling: { ...base.ceiling },
    period: base.period
      ? "preset" in base.period
        ? { preset: base.period.preset }
        : { range: { ...base.period.range } }
      : null,
  });

  const computeInitialFilters = useCallback(() => {
    const fromSearch = parseFiltersFromSearch(searchParams?.toString() ?? "");
    if (fromSearch) return createFilterClone(fromSearch);
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(LAST_FILTERS_KEY);
      if (stored) {
        const parsed = deserializeFilters(stored);
        if (parsed) return createFilterClone(parsed);
      }
    }
    return createFilterClone(defaultFilters);
  }, [searchParams]);

  const [applications, setApplications] = useState(seedApplications);
  const [filters, setFilters] = useState<FilterState>(() => computeInitialFilters());
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(
    () => computeInitialFilters(),
  );
  const [sort, setSort] = useState<SortOption>("dueDate");
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(VIEW_MODE_KEY);
      if (stored === "cards" || stored === "table") {
        return stored;
      }
    }
    return "cards";
  });
  const [isApplying, setIsApplying] = useState(false);
  const [hasPreset, setHasPreset] = useState(() => {
    if (typeof window !== "undefined") {
      return Boolean(window.localStorage.getItem(PRESET_KEY));
    }
    return false;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const applyTimeoutRef = useRef<number | null>(null);

  const appliedSerialised = serializeFilters(appliedFilters);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const next = computeInitialFilters();
    const nextSerialised = serializeFilters(next);
    if (nextSerialised !== appliedSerialised) {
      startTransition(() => {
        setFilters(createFilterClone(next));
        setAppliedFilters(createFilterClone(next));
      });
    }
  }, [appliedSerialised, computeInitialFilters]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedQuery(searchQuery.trim().toLowerCase());
    }, 250);
    return () => window.clearTimeout(handle);
  }, [searchQuery]);

  useEffect(() => {
    return () => {
      if (applyTimeoutRef.current) {
        window.clearTimeout(applyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedPreset = window.localStorage.getItem(PRESET_KEY);
    const nextHasPreset = Boolean(storedPreset);
    if (nextHasPreset !== hasPreset) {
      startTransition(() => setHasPreset(nextHasPreset));
    }
  }, [hasPreset]);

  const naicsOptions = useMemo(() => {
    const unique = Array.from(new Set(applications.map((app) => app.naics)));
    return unique
      .sort()
      .map((value) => ({ value, label: `${value}` }));
  }, [applications]);

  const vehicleOptions = useMemo(() => {
    const unique = Array.from(new Set(applications.map((app) => app.vehicle)));
    return unique
      .sort()
      .map((value) => ({ value, label: value }));
  }, [applications]);

  const setAsideOptions = useMemo(() => {
    const unique = Array.from(
      new Set(applications.flatMap((app) => app.setAside)),
    );
    return unique
      .sort()
      .map((value) => ({ value, label: value }));
  }, [applications]);

  const agencyOptions = useMemo(() => {
    return Array.from(new Set(applications.map((app) => app.agency))).sort();
  }, [applications]);

  const ceilingError = validateCeiling(filters.ceiling);

  const filtersChanged = useMemo(
    () => serializeFilters(filters) !== appliedSerialised,
    [filters, appliedSerialised],
  );

  const applyFiltersWithDelay = (nextFilters: FilterState) => {
    setIsApplying(true);
    if (applyTimeoutRef.current) {
      window.clearTimeout(applyTimeoutRef.current);
    }
    const delay = 300 + Math.random() * 300;
    applyTimeoutRef.current = window.setTimeout(() => {
      setAppliedFilters(nextFilters);
      setIsApplying(false);
      const serialised = serializeFilters(nextFilters);
      window.localStorage.setItem(LAST_FILTERS_KEY, serialised);
      const defaultSerialised = serializeFilters(defaultFilters);
      if (serialised === defaultSerialised) {
        router.replace(pathname, { scroll: false });
      } else {
        const params = buildQueryFromFilters(nextFilters);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, delay) as unknown as number;
  };

  const handleApply = () => {
    applyFiltersWithDelay(filters);
  };

  const handleReset = () => {
    const resetFilters = createFilterClone(defaultFilters);
    setFilters(resetFilters);
    setSearchQuery("");
    setDebouncedQuery("");
    applyFiltersWithDelay(resetFilters);
  };

  const handleSavePreset = () => {
    window.localStorage.setItem(PRESET_KEY, serializeFilters(filters));
    setHasPreset(true);
    toast.success("Preset saved");
  };

  const handleLoadPreset = () => {
    const stored = window.localStorage.getItem(PRESET_KEY);
    if (!stored) return;
    const parsed = deserializeFilters(stored);
    if (!parsed) {
      toast.error("Unable to load preset");
      return;
    }
    const nextFilters = createFilterClone(parsed);
    setFilters(nextFilters);
    applyFiltersWithDelay(nextFilters);
    toast.success("Preset loaded");
  };

  const filteredApplications = useMemo(() => {
    const filtered = filterApplications(applications, appliedFilters);
    const refined = debouncedQuery
      ? filtered.filter((app) => {
          const haystack = `${app.title} ${app.agency} ${app.keywords.join(" ")}`.toLowerCase();
          return haystack.includes(debouncedQuery);
        })
      : filtered;
    return sortApplications(refined, sort);
  }, [applications, appliedFilters, debouncedQuery, sort]);

  const highlightTerms = useMemo(() => {
    const base = new Set(
      appliedFilters.keywords.map((keyword) => keyword.toLowerCase()),
    );
    if (debouncedQuery) {
      base.add(debouncedQuery.toLowerCase());
    }
    return Array.from(base);
  }, [appliedFilters.keywords, debouncedQuery]);

  const activeApplication = useMemo(() => {
    return applications.find((app) => app.id === activeId) ?? null;
  }, [applications, activeId]);

  const handleMarkSubmitted = (id: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, status: "Submitted", percentComplete: 100 }
          : app,
      ),
    );
    toast.success("Marked as submitted");
  };

  const totalMatches = filteredApplications.length;

  return (
    <main className="bg-neutral-50 pb-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-8 sm:px-6 lg:flex-row lg:gap-8 lg:px-10">
        <aside className="flex w-full flex-col gap-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-subtle lg:sticky lg:top-8 lg:h-fit lg:w-80">
          <header className="space-y-2">
            <h1 className="text-2xl font-semibold text-neutral-900">
              Opportunity criteria
            </h1>
            <p className="text-sm text-neutral-500">
              Dial in search settings and capture them for reuse. Filters persist across visits.
            </p>
          </header>
          <div className="space-y-4">
            <SelectField
              id="naics"
              label="NAICS"
              placeholder="Select NAICS"
              value={filters.naics}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, naics: value }))
              }
              options={naicsOptions}
            />
            <MultiSelectField
              id="set-aside"
              label="Set-Aside"
              placeholder="Add set-asides"
              values={filters.setAsides}
              onChange={(values) =>
                setFilters((prev) => ({ ...prev, setAsides: values }))
              }
              options={setAsideOptions}
            />
            <SelectField
              id="vehicle"
              label="Vehicle"
              placeholder="Select vehicle"
              value={filters.vehicle}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, vehicle: value }))
              }
              options={vehicleOptions}
            />
            <AgencyCombobox
              id="agency"
              label="Agencies"
              options={agencyOptions}
              values={filters.agencies}
              onChange={(values) =>
                setFilters((prev) => ({ ...prev, agencies: values }))
              }
            />
            <PeriodField
              value={filters.period}
              onChange={(period) =>
                setFilters((prev) => ({ ...prev, period }))
              }
            />
            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium text-neutral-700">
                Ceiling
              </legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="ceiling-min"
                    className="text-xs font-medium text-neutral-500"
                  >
                    Minimum
                  </label>
                  <input
                    id="ceiling-min"
                    inputMode="numeric"
                    type="number"
                    value={formatNumberInput(filters.ceiling.min)}
                    onChange={(event) => {
                      const value = event.target.value;
                      const next = value === "" ? null : Number(value);
                      setFilters((prev) => ({
                        ...prev,
                        ceiling: { ...prev.ceiling, min: Number.isNaN(next) ? null : next },
                      }));
                    }}
                    className="focus-ring rounded-lg border border-neutral-200 px-3 py-2 text-sm shadow-sm"
                    aria-invalid={Boolean(ceilingError)}
                    aria-describedby="ceiling-helper"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="ceiling-max"
                    className="text-xs font-medium text-neutral-500"
                  >
                    Maximum
                  </label>
                  <input
                    id="ceiling-max"
                    inputMode="numeric"
                    type="number"
                    value={formatNumberInput(filters.ceiling.max)}
                    onChange={(event) => {
                      const value = event.target.value;
                      const next = value === "" ? null : Number(value);
                      setFilters((prev) => ({
                        ...prev,
                        ceiling: { ...prev.ceiling, max: Number.isNaN(next) ? null : next },
                      }));
                    }}
                    className="focus-ring rounded-lg border border-neutral-200 px-3 py-2 text-sm shadow-sm"
                    aria-invalid={Boolean(ceilingError)}
                    aria-describedby="ceiling-helper"
                  />
                </div>
              </div>
              <p
                id="ceiling-helper"
                className={clsx(
                  "text-xs",
                  ceilingError ? "text-danger" : "text-neutral-500",
                )}
              >
                {ceilingError ?? "Leave blank for no ceiling limit."}
              </p>
            </fieldset>
            <KeywordInput
              values={filters.keywords}
              onChange={(keywords) =>
                setFilters((prev) => ({ ...prev, keywords }))
              }
            />
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleSavePreset}
              >
                Save preset
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleLoadPreset}
                disabled={!hasPreset}
              >
                Load preset
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="primary"
                onClick={handleApply}
                disabled={Boolean(ceilingError) || isApplying || !filtersChanged}
                fullWidth
              >
                {isApplying ? "Applying..." : "Apply"}
              </Button>
              <Button type="button" variant="ghost" onClick={handleReset}>
                Reset all
              </Button>
            </div>
            {filtersChanged ? (
              <p className="text-xs text-neutral-500">
                Unsaved filter changes will apply once you press Apply.
              </p>
            ) : null}
          </div>
        </aside>

        <section className="flex min-h-screen flex-1 flex-col gap-6 pb-16">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-subtle">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900">
                      {totalMatches} applications
                    </h2>
                    <p className="text-sm text-neutral-500">
                      Results update after Apply. Keyword search is debounced for speed.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      View
                    </span>
                    <div className="flex rounded-full border border-neutral-200 bg-neutral-50 p-1">
                      <button
                        type="button"
                        onClick={() => setViewMode("cards")}
                        className={clsx(
                          "rounded-full px-3 py-1 text-xs font-semibold transition",
                          viewMode === "cards"
                            ? "bg-white text-accent shadow-subtle"
                            : "text-neutral-500 hover:text-accent",
                        )}
                        aria-pressed={viewMode === "cards"}
                      >
                        Cards
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("table")}
                        className={clsx(
                          "rounded-full px-3 py-1 text-xs font-semibold transition",
                          viewMode === "table"
                            ? "bg-white text-accent shadow-subtle"
                            : "text-neutral-500 hover:text-accent",
                        )}
                        aria-pressed={viewMode === "table"}
                      >
                        Table
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex w-full items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500 sm:max-w-md">
                    <span className="sr-only">Search applications</span>
                    <input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search within results"
                      className="flex-1 border-none bg-transparent text-sm text-neutral-700 outline-none"
                    />
                  </label>
                  <div className="flex items-center gap-2">
                    <label htmlFor="sort" className="text-sm font-medium text-neutral-600">
                      Sort by
                    </label>
                    <select
                      id="sort"
                      value={sort}
                      onChange={(event) =>
                        setSort(event.target.value as SortOption)
                      }
                      className="focus-ring rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <ProgressDashboard applications={filteredApplications} />
          </div>

          <div className="flex-1">
            {isApplying ? (
              <ResultsSkeleton />
            ) : filteredApplications.length ? (
              viewMode === "cards" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredApplications.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      application={app}
                      onClick={() => setActiveId(app.id)}
                      highlightTerms={highlightTerms}
                    />
                  ))}
                </div>
              ) : (
                <ApplicationTable
                  applications={filteredApplications}
                  onSelect={(app) => setActiveId(app.id)}
                  highlightTerms={highlightTerms}
                />
              )
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center">
                <h3 className="text-lg font-semibold text-neutral-800">
                  No applications match your filters yet
                </h3>
                <p className="max-w-md text-sm text-neutral-500">
                  Try widening your date range, clearing the ceiling limits, or removing a keyword to explore adjacent opportunities.
                </p>
                <Button variant="secondary" onClick={handleReset}>
                  Reset filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
      <DetailsDrawer
        application={activeApplication}
        open={Boolean(activeApplication)}
        onClose={() => setActiveId(null)}
        onMarkSubmitted={(id) => {
          handleMarkSubmitted(id);
          setActiveId(id);
        }}
      />
    </main>
  );
}

