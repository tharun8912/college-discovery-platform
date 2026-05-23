"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import CollegeCard from "@/components/colleges/CollegeCard";
import {
  getSavedColleges,
  getSavedComparisons,
} from "@/services/authService";
import type { College, SavedComparison } from "@/types/college";
import { CollegeCardSkeleton } from "@/components/ui/Skeleton";
import { compareColleges } from "@/services/collegeService";

function SavedContent() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [comparisons, setComparisons] = useState<SavedComparison[]>([]);
  const [comparisonDetails, setComparisonDetails] = useState<
    Record<number, College[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSavedColleges(), getSavedComparisons()])
      .then(async ([cols, comps]) => {
        setColleges(cols);
        setComparisons(comps);
        const details: Record<number, College[]> = {};
        for (const c of comps) {
          if (c.collegeIds.length >= 2) {
            details[c.id] = await compareColleges(c.collegeIds);
          }
        }
        setComparisonDetails(details);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">Saved items</h1>
      <p className="mt-1 text-slate-500">Your bookmarked colleges and comparisons</p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Saved colleges</h2>
        {loading ? (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CollegeCardSkeleton key={i} />
            ))}
          </div>
        ) : colleges.length === 0 ? (
          <p className="mt-4 text-slate-500">
            No saved colleges.{" "}
            <Link href="/colleges" className="text-[#ff6b35]">
              Browse colleges
            </Link>
          </p>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {colleges.map((c) => (
              <CollegeCard key={c.id} college={c} saved />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Saved comparisons</h2>
        {comparisons.length === 0 ? (
          <p className="mt-4 text-slate-500">
            No saved comparisons.{" "}
            <Link href="/compare" className="text-[#ff6b35]">
              Compare colleges
            </Link>
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {comparisons.map((comp) => (
              <div
                key={comp.id}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <h3 className="font-semibold">{comp.name}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {(comparisonDetails[comp.id] ?? [])
                    .map((c) => c.name)
                    .join(" vs ")}
                </p>
                <Link
                  href={`/compare`}
                  className="mt-2 inline-block text-sm text-[#ff6b35]"
                >
                  Open compare tool →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function SavedPage() {
  return (
    <ProtectedRoute>
      <SavedContent />
    </ProtectedRoute>
  );
}
