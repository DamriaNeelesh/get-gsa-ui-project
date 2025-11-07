import { parseISO, addDays, isWithinInterval } from "date-fns";
import type { Application } from "@/data/applications";

export type SortOption = "dueDate" | "percentComplete" | "fitScore";

export type PeriodFilter =
  | { preset: 30 | 60 | 90 }
  | { range: { start: string | null; end: string | null } }
  | null;

export type CeilingFilter = {
  min: number | null;
  max: number | null;
};

export type FilterState = {
  naics: string | null;
  setAsides: string[];
  vehicle: string | null;
  agencies: string[];
  period: PeriodFilter;
  ceiling: CeilingFilter;
  keywords: string[];
};

export const defaultFilters: FilterState = {
  naics: null,
  setAsides: [],
  vehicle: null,
  agencies: [],
  period: null,
  ceiling: { min: null, max: null },
  keywords: [],
};

export const FILTER_QUERY_KEY = "filters";

export const serializeFilters = (filters: FilterState) => {
  const payload = {
    ...filters,
    ceiling: {
      min: filters.ceiling.min ?? undefined,
      max: filters.ceiling.max ?? undefined,
    },
    period: filters.period
      ? "preset" in filters.period
        ? { preset: filters.period.preset }
        : { range: filters.period.range }
      : null,
  };

  return JSON.stringify(payload);
};

export const deserializeFilters = (value: string | null): FilterState | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<FilterState> & {
      period?: PeriodFilter;
      ceiling?: CeilingFilter;
    };
    if (!parsed || typeof parsed !== "object") return null;

    return {
      naics: parsed.naics ?? null,
      setAsides: parsed.setAsides?.filter(Boolean) ?? [],
      vehicle: parsed.vehicle ?? null,
      agencies: parsed.agencies?.filter(Boolean) ?? [],
      period: parsed.period ? normalisePeriod(parsed.period) : null,
      ceiling: {
        min: numberOrNull(parsed.ceiling?.min),
        max: numberOrNull(parsed.ceiling?.max),
      },
      keywords: Array.from(new Set(parsed.keywords ?? [])).filter(Boolean),
    } satisfies FilterState;
  } catch (error) {
    console.error("Failed to parse filters", error);
    return null;
  }
};

const numberOrNull = (value: unknown) => {
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : null;
};

const normalisePeriod = (period: PeriodFilter): PeriodFilter => {
  if (!period) return null;
  if ("preset" in period) {
    if (period.preset === 30 || period.preset === 60 || period.preset === 90) {
      return { preset: period.preset };
    }
    return null;
  }

  const start = period.range?.start ?? null;
  const end = period.range?.end ?? null;
  return { range: { start, end } };
};

export const filterApplications = (
  data: Application[],
  filters: FilterState,
) => {
  return data.filter((app) => {
    if (filters.naics && app.naics !== filters.naics) return false;

    if (filters.vehicle && app.vehicle !== filters.vehicle) return false;

    if (filters.setAsides.length) {
      const hasMatch = filters.setAsides.some((tag) =>
        app.setAside.includes(tag),
      );
      if (!hasMatch) return false;
    }

    if (filters.agencies.length) {
      if (!filters.agencies.includes(app.agency)) return false;
    }

    if (filters.period) {
      const dueDate = parseISO(app.dueDate);
      if ("preset" in filters.period) {
        const end = addDays(new Date(), filters.period.preset);
        if (dueDate < new Date() || dueDate > end) return false;
      } else {
        const { start, end } = filters.period.range;
        if (start && end) {
          const interval = {
            start: parseISO(start),
            end: parseISO(end),
          };
          if (!isWithinInterval(dueDate, interval)) return false;
        } else if (start && dueDate < parseISO(start)) {
          return false;
        } else if (end && dueDate > parseISO(end)) {
          return false;
        }
      }
    }

    const { min, max } = filters.ceiling;
    if (min !== null && app.ceiling < min) return false;
    if (max !== null && app.ceiling > max) return false;

    if (filters.keywords.length) {
      const haystack = `${app.title} ${app.keywords.join(" ")}`.toLowerCase();
      const hasKeyword = filters.keywords.some((keyword) =>
        haystack.includes(keyword.toLowerCase()),
      );
      if (!hasKeyword) return false;
    }

    return true;
  });
};

export const sortApplications = (
  data: Application[],
  sort: SortOption,
) => {
  const sorted = [...data];
  switch (sort) {
    case "dueDate":
      sorted.sort(
        (a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime(),
      );
      break;
    case "percentComplete":
      sorted.sort((a, b) => b.percentComplete - a.percentComplete);
      break;
    case "fitScore":
      sorted.sort((a, b) => b.fitScore - a.fitScore);
      break;
    default:
      break;
  }

  return sorted;
};

export const buildQueryFromFilters = (filters: FilterState) => {
  const params = new URLSearchParams();
  const serialised = serializeFilters(filters);
  params.set(FILTER_QUERY_KEY, serialised);
  return params;
};

export const parseFiltersFromSearch = (search: string): FilterState | null => {
  if (!search) return null;
  const params = new URLSearchParams(search);
  const raw = params.get(FILTER_QUERY_KEY);
  return deserializeFilters(raw);
};

export const hasActiveFilters = (filters: FilterState) => {
  return (
    Boolean(filters.naics) ||
    Boolean(filters.vehicle) ||
    filters.setAsides.length > 0 ||
    filters.agencies.length > 0 ||
    Boolean(filters.period) ||
    filters.ceiling.min !== null ||
    filters.ceiling.max !== null ||
    filters.keywords.length > 0
  );
};

export const validateCeiling = (ceiling: CeilingFilter) => {
  if (
    ceiling.min !== null &&
    ceiling.max !== null &&
    ceiling.min > ceiling.max
  ) {
    return "Minimum cannot exceed maximum.";
  }
  if (ceiling.min !== null && ceiling.min < 0) {
    return "Minimum must be positive.";
  }
  if (ceiling.max !== null && ceiling.max < 0) {
    return "Maximum must be positive.";
  }
  return null;
};

export const mergeFilters = (
  base: FilterState,
  patch: Partial<FilterState>,
): FilterState => ({
  ...base,
  ...patch,
  ceiling: patch.ceiling ? { ...patch.ceiling } : { ...base.ceiling },
  period: patch.period ?? base.period,
  setAsides: patch.setAsides ?? [...base.setAsides],
  agencies: patch.agencies ?? [...base.agencies],
  keywords: patch.keywords ?? [...base.keywords],
});

