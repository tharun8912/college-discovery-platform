"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CollegeCard from "@/components/colleges/CollegeCard";
import CompareBar from "@/components/colleges/CompareBar";
import SearchFilters from "@/components/colleges/SearchFilters";
import { getColleges, getCourses, getLocations } from "@/services/collegeService";
import type { College, CollegeFilters } from "@/types/college";
import { CollegeCardSkeleton } from "@/components/ui/Skeleton";

export default function CollegesListing() {
  const searchParams = useSearchParams();
  const [colleges, setColleges] = useState<College[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [filters, setFilters] = useState<CollegeFilters>({
    search: searchParams.get("search") ?? "",
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
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getLocations(), getCourses()])
      .then(([locs, crs]) => {
        setLocations(locs);
        setCourses(crs);
      })
      .catch(() => {});
  }, []);

  const load = useCallback(async (f: CollegeFilters) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getColleges(f);
      setColleges(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch {
      setError(
        "Could not load colleges. Check your connection or try again later."
      );
      setColleges([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(filters), 300);
    return () => clearTimeout(t);
  }, [filters, load]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pb-28 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Discover Top Engineering Colleges
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Search and compare rankings, fees, packages, and eligibility criteria for premier institutions.
        </p>
      </div>

      <SearchFilters
        filters={filters}
        locations={locations}
        courses={courses}
        onChange={setFilters}
      />

      {error && (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </p>
      )}

      <p className="my-6 text-sm font-medium text-slate-600">
        {loading ? "Loading..." : `${colleges.length} colleges on this page`}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <CollegeCardSkeleton key={i} />)
          : colleges.map((c) => <CollegeCard key={c.id} college={c} />)}
      </div>

      {!loading && colleges.length === 0 && !error && (
        <p className="py-12 text-center text-slate-500">No colleges match your filters.</p>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          <button
            type="button"
            disabled={(filters.page ?? 1) <= 1}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium disabled:opacity-40"
          >
            Previous
          </button>
          <span className="flex items-center px-4 text-sm text-slate-600">
            Page {filters.page ?? 1} of {totalPages}
          </span>
          <button
            type="button"
            disabled={(filters.page ?? 1) >= totalPages}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      <CompareBar />
    </div>
  );
}
