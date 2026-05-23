"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
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
  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = (patch: Partial<CollegeFilters>) =>
    onChange({ ...filters, ...patch, page: 1 });

  const clearAll = () => {
    onChange({
      search: "",
      location: "all",
      state: "all",
      course: "all",
      ownershipType: "all",
      exam: "all",
      minFees: undefined,
      maxFees: undefined,
      maxNirfRank: undefined,
      minAvgPackage: undefined,
      minPlacementPercentage: undefined,
      page: 1,
      limit: 12,
    });
  };

  const hasActiveFilters = 
    (filters.search && filters.search.trim() !== "") ||
    (filters.location && filters.location !== "all") ||
    (filters.state && filters.state !== "all") ||
    (filters.course && filters.course !== "all") ||
    (filters.ownershipType && filters.ownershipType !== "all") ||
    (filters.exam && filters.exam !== "all") ||
    filters.minFees !== undefined ||
    filters.maxFees !== undefined ||
    filters.maxNirfRank !== undefined ||
    filters.minAvgPackage !== undefined ||
    filters.minPlacementPercentage !== undefined;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#ff6b35]">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Search & Find Colleges</h2>
            <p className="text-xs text-slate-500">Filter by rank, packages, fees, state and exams</p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset All Filters
          </button>
        )}
      </div>

      {/* Main Grid Filters */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <label className="relative col-span-1 md:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search colleges by name, shortname or location..."
            value={filters.search ?? ""}
            onChange={(e) => update({ search: e.target.value })}
            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-[#ff6b35] focus:ring-2 focus:ring-orange-100/50"
          />
        </label>

        {/* State */}
        <select
          value={filters.state ?? "all"}
          onChange={(e) => update({ state: e.target.value })}
          className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-3 text-sm font-medium text-slate-700 outline-none transition-all hover:bg-slate-50 focus:border-[#ff6b35] focus:bg-white"
        >
          <option value="all">All States</option>
          <option value="Telangana">Telangana</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
        </select>

        {/* Location / City */}
        <select
          value={filters.location ?? "all"}
          onChange={(e) => update({ location: e.target.value })}
          className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-3 text-sm font-medium text-slate-700 outline-none transition-all hover:bg-slate-50 focus:border-[#ff6b35] focus:bg-white"
        >
          <option value="all">All Cities</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Course */}
        <select
          value={filters.course ?? "all"}
          onChange={(e) => update({ course: e.target.value })}
          className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-3 text-sm font-medium text-slate-700 outline-none transition-all hover:bg-slate-50 focus:border-[#ff6b35] focus:bg-white"
        >
          <option value="all">All Courses / Specializations</option>
          {courses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Fee Budget */}
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min Fees (₹/Yr)"
            value={filters.minFees ?? ""}
            onChange={(e) =>
              update({
                minFees: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-3 text-sm outline-none transition-all hover:bg-slate-50 focus:border-[#ff6b35] focus:bg-white"
          />
          <input
            type="number"
            placeholder="Max Fees (₹/Yr)"
            value={filters.maxFees ?? ""}
            onChange={(e) =>
              update({
                maxFees: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-3 text-sm outline-none transition-all hover:bg-slate-50 focus:border-[#ff6b35] focus:bg-white"
          />
        </div>

        {/* Advanced Filters Button */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50"
        >
          {showAdvanced ? (
            <>
              Hide Advanced Filters
              <ChevronUp className="h-4 w-4 text-[#ff6b35]" />
            </>
          ) : (
            <>
              Show Advanced Filters
              <ChevronDown className="h-4 w-4 text-[#ff6b35]" />
            </>
          )}
        </button>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="mt-5 border-t border-slate-100 pt-5 animate-in fade-in slide-in-from-top-3 duration-200">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Careers360 Advanced Parameters</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* NIRF Rank Range */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Max NIRF Rank</label>
              <select
                value={filters.maxNirfRank ?? "all"}
                onChange={(e) =>
                  update({
                    maxNirfRank: e.target.value === "all" ? undefined : Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#ff6b35] focus:bg-white"
              >
                <option value="all">Any rank</option>
                <option value="10">Top 10 NIRF</option>
                <option value="50">Top 50 NIRF</option>
                <option value="100">Top 100 NIRF</option>
                <option value="150">Top 150 NIRF</option>
                <option value="200">Top 200 NIRF</option>
              </select>
            </div>

            {/* Min Avg Package */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Min Average Package</label>
              <select
                value={filters.minAvgPackage ?? "all"}
                onChange={(e) =>
                  update({
                    minAvgPackage: e.target.value === "all" ? undefined : Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#ff6b35] focus:bg-white"
              >
                <option value="all">Any average package</option>
                <option value="5">Above 5 LPA</option>
                <option value="8">Above 8 LPA</option>
                <option value="12">Above 12 LPA</option>
                <option value="18">Above 18 LPA</option>
                <option value="24">Above 24 LPA</option>
              </select>
            </div>

            {/* Min Placement Percentage */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Min Placement Rate</label>
              <select
                value={filters.minPlacementPercentage ?? "all"}
                onChange={(e) =>
                  update({
                    minPlacementPercentage: e.target.value === "all" ? undefined : Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#ff6b35] focus:bg-white"
              >
                <option value="all">Any placement rate</option>
                <option value="80">Above 80%</option>
                <option value="85">Above 85%</option>
                <option value="90">Above 90%</option>
                <option value="95">Above 95%</option>
              </select>
            </div>

            {/* Ownership Type */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Ownership Type</label>
              <select
                value={filters.ownershipType ?? "all"}
                onChange={(e) => update({ ownershipType: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#ff6b35] focus:bg-white"
              >
                <option value="all">All Ownership Types</option>
                <option value="Public">Public (Govt of India)</option>
                <option value="Government">Government (State Govt)</option>
                <option value="Private">Private (Self-Financed)</option>
                <option value="PPP">Public-Private Partnership</option>
              </select>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Accepted Exams */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Entrance Exams Accepted</label>
              <select
                value={filters.exam ?? "all"}
                onChange={(e) => update({ exam: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#ff6b35] focus:bg-white"
              >
                <option value="all">All Entrance Exams</option>
                <option value="JEE Main">JEE Main</option>
                <option value="JEE Advanced">JEE Advanced</option>
                <option value="TS EAMCET">TS EAMCET</option>
                <option value="AP EAMCET">AP EAMCET</option>
                <option value="BITSAT">BITSAT</option>
                <option value="SRMJEEE">SRMJEEE</option>
                <option value="KLEEE">KLEEE</option>
                <option value="UGEE">UGEE</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
