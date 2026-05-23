"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import type { CollegeFilters } from "@/types/college";

interface SearchFiltersProps {
  filters: CollegeFilters;
  locations: string[];
  courses: string[];
  onChange: (filters: CollegeFilters) => void;
}

export default function SearchFilters({
  filters,
  locations,
  courses,
  onChange,
}: SearchFiltersProps) {
  const update = (patch: Partial<CollegeFilters>) =>
    onChange({ ...filters, ...patch, page: 1 });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-slate-800">
        <SlidersHorizontal className="h-5 w-5 text-[#ff6b35]" />
        <h2 className="font-semibold">Search & Filters</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <label className="relative lg:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search colleges..."
            value={filters.search ?? ""}
            onChange={(e) => update({ search: e.target.value })}
            className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#ff6b35] focus:ring-2 focus:ring-orange-100"
          />
        </label>
        <select
          value={filters.location ?? "all"}
          onChange={(e) => update({ location: e.target.value })}
          className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#ff6b35]"
        >
          <option value="all">All locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        <select
          value={filters.course ?? "all"}
          onChange={(e) => update({ course: e.target.value })}
          className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#ff6b35]"
        >
          <option value="all">All courses</option>
          {courses.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min ₹"
            value={filters.minFees ?? ""}
            onChange={(e) =>
              update({
                minFees: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#ff6b35]"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={filters.maxFees ?? ""}
            onChange={(e) =>
              update({
                maxFees: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#ff6b35]"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={() =>
          onChange({
            search: "",
            location: "all",
            course: "all",
            minFees: undefined,
            maxFees: undefined,
            page: 1,
          })
        }
        className="mt-3 text-sm font-medium text-[#ff6b35] hover:underline"
      >
        Clear filters
      </button>
    </div>
  );
}
