"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

import type { Application } from "@/data/applications";
import { applications as seedApplications } from "@/data/applications";
import { ParameterPanel } from "@/components/ParameterPanel";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { ApplicationsList } from "@/components/ApplicationsList";
import { DetailsDrawer } from "@/components/DetailsDrawer";
import {
  buildQueryFromFilters,
  defaultFilters,
  deserializeFilters,
  filterApplications,
  FilterState,
  mergeFilters,
  parseFiltersFromSearch,
  serializeFilters,
  sortApplications,
  SortOption,
  validateCeiling,
} from "@/lib/filters";

const LAST_FILTERS_KEY = "get-gsa:last-filters";
const PRESET_KEY = "get-gsa:preset";
const VIEW_MODE_KEY = "get-gsa:view";

type ViewMode = "grid" | "list";

const unique = <T,>(items: T[]) => Array.from(new Set(items));

const applySearch = (data: Application[], query: string) => {
  if (!query.trim()) return data;
  const term = query.trim().toLowerCase();
  return data.filter((application) => {
    const haystack = `${application.title} ${application.agency} ${application.keywords.join(" ")}`.toLowerCase();
    return haystack.includes(term);
  });
};

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [data, setData] = useState<Application[]>(() => seedApplications.map((item) => ({ ...item })));
  const [draftFilters, setDraftFilters] = useState<FilterState>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(defaultFilters);
  const [sort, setSort] = useState<SortOption>("dueDate");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [baseResults, setBaseResults] = useState<Application[]>(() =>
    sortApplications(filterApplications(seedApplications, defaultFilters), "dueDate"),
  );
  const [visibleResults, setVisibleResults] = useState<Application[]>(() =>
    sortApplications(filterApplications(seedApplications, defaultFilters), "dueDate"),
  );
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [hasPreset, setHasPreset] = useState(false);
  const [ceilingError, setCeilingError] = useState<string | null>(null);

  const isInitialised = useRef(false);
  const applyTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (applyTimeout.current) {
        clearTimeout(applyTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    const storedView = typeof window !== "undefined" ? localStorage.getItem(VIEW_MODE_KEY) : null;
    if (storedView === "list" || storedView === "grid") {
      setViewMode(storedView);
    }
    setHasPreset(Boolean(localStorage.getItem(PRESET_KEY)));
  }, []);

  useEffect(() => {
    const searchString = searchParams.toString();
    if (isInitialised.current) return;

    let initialFilters: FilterState = defaultFilters;
    const parsedFromUrl = parseFiltersFromSearch(searchString ? `?${searchString}` : "");
    const stored = deserializeFilters(localStorage.getItem(LAST_FILTERS_KEY));

    if (parsedFromUrl) {
      initialFilters = mergeFilters(defaultFilters, parsedFromUrl);
    } else if (stored) {
      initialFilters = mergeFilters(defaultFilters, stored);
    }

    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
    isInitialised.current = true;
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCeilingError(validateCeiling(draftFilters.ceiling));
  }, [draftFilters.ceiling]);

  useEffect(() => {
    const filtered = sortApplications(filterApplications(data, appliedFilters), sort);
    setBaseResults(filtered);
  }, [data, appliedFilters, sort]);

  useEffect(() => {
    setVisibleResults(applySearch(baseResults, debouncedSearch));
  }, [baseResults, debouncedSearch]);

  const naicsOptions = useMemo(
    () =>
      unique(data.map((application) => application.naics)).map((code) => ({
        value: code,
        label: code,
      })),
    [data],
  );

  const setAsideOptions = useMemo(
    () =>
      unique(data.flatMap((application) => application.setAside)).map((tag) => ({
        value: tag,
        label: tag,
      })),
    [data],
  );

  const vehicleOptions = useMemo(
    () =>
      unique(data.map((application) => application.vehicle)).map((vehicle) => ({
        value: vehicle,
        label: vehicle,
      })),
    [data],
  );

  const agencyOptions = useMemo(
    () => unique(data.map((application) => application.agency)).sort(),
    [data],
  );

  const keywordHighlights = useMemo(() => {
    const keywords = new Set<string>();
    appliedFilters.keywords.forEach((keyword) => keywords.add(keyword));
    if (debouncedSearch.trim()) keywords.add(debouncedSearch.trim().toLowerCase());
    return Array.from(keywords);
  }, [appliedFilters.keywords, debouncedSearch]);

  const handleApply = (filters: FilterState) => {
    if (applyTimeout.current) {
      clearTimeout(applyTimeout.current);
    }
    setLoading(true);
    const nextFilters = mergeFilters(defaultFilters, filters);
    const delay = 300 + Math.random() * 300;
    applyTimeout.current = setTimeout(() => {
      setAppliedFilters(nextFilters);
      setLoading(false);
      localStorage.setItem(LAST_FILTERS_KEY, serializeFilters(nextFilters));
      const query = buildQueryFromFilters(nextFilters);
      router.replace(`${pathname}?${query.toString()}`, { scroll: false });
    }, delay);
  };

  const handleSavePreset = () => {
    localStorage.setItem(PRESET_KEY, serializeFilters(draftFilters));
    setHasPreset(true);
    toast.success("Preset saved");
  };

  const handleLoadPreset = () => {
    const preset = deserializeFilters(localStorage.getItem(PRESET_KEY));
    if (!preset) {
      toast.error("No preset found yet");
      return;
    }
    const merged = mergeFilters(defaultFilters, preset);
    setDraftFilters(merged);
    toast.success("Preset loaded");
    handleApply(merged);
  };

  const handleReset = () => {
    const cleanFilters = mergeFilters(defaultFilters, defaultFilters);
    setDraftFilters(cleanFilters);
    setSearchTerm("");
    setDebouncedSearch("");
    setCeilingError(null);
    handleApply(cleanFilters);
  };

  const handleSortChange = (next: SortOption) => {
    setSort(next);
  };

  const handleViewModeChange = (next: ViewMode) => {
    setViewMode(next);
    localStorage.setItem(VIEW_MODE_KEY, next);
  };

  const handleMarkSubmitted = (id: string) => {
    setData((previous) => {
      const next = previous.map((application) =>
        application.id === id
          ? {
              ...application,
              status: "Submitted",
              percentComplete: 100,
            }
          : application,
      );
      return next;
    });
    setSelected((current) =>
      current && current.id === id
        ? { ...current, status: "Submitted", percentComplete: 100 }
        : current,
    );
    toast.success("Marked as submitted");
  };

  useEffect(() => {
    if (selected) {
      const fresh = data.find((item) => item.id === selected.id);
      if (fresh) {
        setSelected({ ...fresh });
      }
    }
  }, [data]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-100 via-white to-neutral-100 pb-12">
      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-24 pt-10 lg:grid lg:grid-cols-[minmax(280px,320px)_1fr] lg:gap-8 lg:px-8">
        <div className="order-2 flex flex-col gap-6 lg:order-1">
          <ParameterPanel
            filters={draftFilters}
            onChange={setDraftFilters}
            onReset={handleReset}
            onSavePreset={handleSavePreset}
            onLoadPreset={handleLoadPreset}
            hasPreset={hasPreset}
            onApply={() => handleApply(draftFilters)}
            ceilingError={ceilingError}
            disabled={loading}
            naicsOptions={naicsOptions}
            setAsideOptions={setAsideOptions}
            vehicleOptions={vehicleOptions}
            agencyOptions={agencyOptions}
            appliedKeywordHighlights={appliedFilters.keywords}
          />
          <ProgressDashboard applications={visibleResults} />
        </div>
        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <header className="rounded-3xl bg-surface-subtle p-8 text-white shadow-subtle">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">Get-GSA mini workspace</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight">Track opportunities with clarity and confidence.</h1>
            <p className="mt-4 max-w-2xl text-base text-white/80">
              Use the panel to the left to focus on the deals that matter. Saved presets, instant keyword chips, and a responsive dashboard
              keep your capture team aligned.
            </p>
          </header>
          <ApplicationsList
            applications={visibleResults}
            sort={sort}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            keywords={keywordHighlights}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            loading={loading}
            onSelect={setSelected}
          />
        </div>
      </div>
      <DetailsDrawer application={selected} onClose={() => setSelected(null)} onMarkSubmitted={handleMarkSubmitted} />
    </main>
  );
}
