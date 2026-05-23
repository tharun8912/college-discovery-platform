"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Filter, Sparkles } from "lucide-react";
import type { PredictorResponse } from "@/types/predictor";
import type { ResultFilter } from "@/lib/predictorUi";
import { CHANCE_STYLES } from "@/lib/predictorUi";
import PredictionCard from "./PredictionCard";

interface PredictorResultsProps {
  data: PredictorResponse;
}

const FILTERS: { id: ResultFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "safe", label: "Safe" },
  { id: "moderate", label: "Moderate" },
  { id: "borderline", label: "Borderline" },
  { id: "reach", label: "Reach" },
  { id: "dream", label: "Dream" },
];

export default function PredictorResults({ data }: PredictorResultsProps) {
  const [filter, setFilter] = useState<ResultFilter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return data.predictions;
    return data.predictions.filter((p) => p.chanceLevel === filter);
  }, [data.predictions, filter]);

  const countFor = (id: ResultFilter) =>
    id === "all"
      ? data.predictions.length
      : data.summary[id as keyof typeof data.summary] ?? 0;

  return (
    <section className="mt-10">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-[#1e3a5f] to-[#2d5280] p-6 text-white shadow-lg lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-orange-200">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Prediction report
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold">{data.message}</h2>
            <p className="mt-2 text-sm text-blue-100">
              {data.exam} · Rank {data.rank.toLocaleString("en-IN")} ·{" "}
              {data.categoryLabel}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["safe", "moderate", "borderline", "reach", "dream"] as const).map(
              (key) =>
                data.summary[key] > 0 && (
                  <span
                    key={key}
                    className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${CHANCE_STYLES[key].bg} ${CHANCE_STYLES[key].text}`}
                  >
                    {CHANCE_STYLES[key].label}: {data.summary[key]}
                  </span>
                )
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-slate-500" />
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            disabled={f.id !== "all" && countFor(f.id) === 0}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === f.id
                ? "bg-[#ff6b35] text-white shadow-md"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-[#ff6b35] disabled:opacity-40"
            }`}
          >
            {f.label}
            <span className="ml-1 opacity-80">({countFor(f.id)})</span>
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {filtered.length > 0 ? (
          filtered.map((p) => (
            <PredictionCard key={p.college.id} prediction={p} rank={data.rank} />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
            <p className="text-slate-600">No colleges in this category.</p>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="mt-2 text-sm font-semibold text-[#ff6b35] hover:underline"
            >
              Show all results
            </button>
          </div>
        )}
      </div>

      {data.predictions.length === 0 && (
        <Link
          href="/colleges"
          className="mt-4 inline-block font-semibold text-[#ff6b35] hover:underline"
        >
          Browse all colleges →
        </Link>
      )}

      <p className="mt-8 text-center text-xs text-slate-400">
        Predictions use rule-based cutoffs and category relaxation factors. Actual
        admission depends on counselling rounds, seat matrix, and branch preference.
      </p>
    </section>
  );
}
