"use client";

import { useEffect, useState } from "react";
import CollegeCard from "@/components/colleges/CollegeCard";
import { getFeaturedColleges } from "@/services/collegeService";
import type { College } from "@/types/college";

export default function HomePage() {
  const [featured, setFeatured] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getFeaturedColleges();
        const list: College[] = Array.isArray(res) ? res : (res?.data ?? []);
        if (mounted) setFeatured(list);
      } catch {
        if (mounted) setError("Could not load featured colleges.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-4xl font-bold">CampusCompass</h1>

      {error && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </p>
      )}

      <h2 className="mb-4 text-2xl font-semibold">Featured Colleges</h2>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[220px] animate-pulse rounded-2xl border border-slate-200 bg-slate-50"
              />
            ))
          : featured.map((c) => <CollegeCard key={c.id} college={c} variant="featured" />)}
      </div>
    </div>
  );
}


