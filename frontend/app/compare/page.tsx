"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GitCompare, Save } from "lucide-react";
import { compareColleges } from "@/services/collegeService";
import { saveComparison } from "@/services/authService";
import type { College } from "@/types/college";
import { useCompareStore, MAX_COMPARE } from "@/store/compareStore";
import { useAuth } from "@/lib/auth-context";
import CompareTable from "@/components/colleges/CompareTable";
import CompareMobileCards from "@/components/colleges/CompareMobileCards";
import CompareShareMenu from "@/components/colleges/CompareShareMenu";
import { Skeleton } from "@/components/ui/Skeleton";

function CompareSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="hidden h-96 w-full rounded-2xl lg:block" />
      <Skeleton className="h-80 w-full rounded-2xl lg:hidden" />
    </div>
  );
}

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selected, clear, setSelected } = useCompareStore();
  const { user } = useAuth();
  const [data, setData] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const urlIds = searchParams
    .get("ids")
    ?.split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n))
    .slice(0, MAX_COMPARE);

  useEffect(() => {
    if (urlIds && urlIds.length >= 2) {
      const storeKey = [...selected.map((c) => c.id)].sort((a, b) => a - b).join(",");
      const urlKey = [...urlIds].sort((a, b) => a - b).join(",");
      if (storeKey !== urlKey) {
        setLoading(true);
        compareColleges(urlIds)
          .then((colleges) => setSelected(colleges))
          .catch(() => setError("Failed to load shared comparison"))
          .finally(() => setLoading(false));
      }
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selected.length < 2) {
      setData([]);
      if (selected.length === 0 && !urlIds?.length) {
        router.replace("/compare", { scroll: false });
      }
      return;
    }

    const ids = selected.map((c) => c.id);
    const query = `ids=${ids.join(",")}`;
    if (searchParams.get("ids") !== ids.join(",")) {
      router.replace(`/compare?${query}`, { scroll: false });
    }

    setLoading(true);
    setError(null);
    setSaved(false);
    compareColleges(ids)
      .then(setData)
      .catch(() => setError("Failed to load comparison"))
      .finally(() => setLoading(false));
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!user || selected.length < 2) return;
    try {
      await saveComparison(
        `Comparison ${new Date().toLocaleDateString()}`,
        selected.map((c) => c.id)
      );
      setSaved(true);
    } catch {
      setError("Could not save comparison. Please try again.");
    }
  };

  if (selected.length < 2) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <GitCompare className="mx-auto h-14 w-14 text-[#ff6b35]" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Compare up to {MAX_COMPARE} colleges
        </h1>
        <p className="mt-2 text-slate-600">
          Add colleges from listings or cards, then compare fees, placements,
          ratings, locations, and courses side by side.
        </p>
        <Link
          href="/colleges"
          className="mt-8 inline-block rounded-xl bg-[#ff6b35] px-6 py-3 font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-[#e85a28]"
        >
          Browse colleges
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pb-24 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Compare colleges</h1>
          <p className="mt-1 text-slate-500">
            Side-by-side comparison · {selected.length}/{MAX_COMPARE} selected
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              clear();
              router.replace("/compare");
            }}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Clear all
          </button>
          {user && (
            <button
              type="button"
              onClick={handleSave}
              disabled={saved || loading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2a4d73] disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saved ? "Saved" : "Save comparison"}
            </button>
          )}
        </div>
      </div>

      {!loading && data.length >= 2 && (
        <div className="mb-6">
          <CompareShareMenu colleges={data} />
        </div>
      )}

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && <CompareSkeleton />}

      {!loading && data.length >= 2 && (
        <>
          <div className="hidden lg:block">
            <CompareTable colleges={data} />
          </div>
          <CompareMobileCards colleges={data} />
        </>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<CompareSkeleton />}>
      <CompareContent />
    </Suspense>
  );
}
