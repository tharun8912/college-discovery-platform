"use client";

import Link from "next/link";
import { MapPin, TrendingUp, IndianRupee, Star, Target } from "lucide-react";
import type { CollegePrediction } from "@/types/predictor";
import CollegeImage from "@/components/ui/CollegeImage";
import { CHANCE_STYLES, formatPredictorFees } from "@/lib/predictorUi";

interface PredictionCardProps {
  prediction: CollegePrediction;
  rank: number;
}

export default function PredictionCard({ prediction, rank }: PredictionCardProps) {
  const { college, probability, chanceLevel, effectiveCutoff, placement, fees } =
    prediction;
  const style = CHANCE_STYLES[chanceLevel];

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 transition hover:shadow-md ${style.bg}`}
    >
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white bg-white shadow-sm">
          <CollegeImage
            src={college.logo}
            alt={`${college.name} logo`}
            variant="logo"
            sizes="64px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ring-1 ${style.bg} ${style.text}`}
              >
                {style.label} · {probability}% chance
              </span>
              <h3 className="mt-2 text-lg font-bold leading-snug text-slate-900">
                <Link
                  href={`/colleges/${college.id}`}
                  className="hover:text-[#ff6b35] hover:underline"
                >
                  {college.name}
                </Link>
              </h3>
              <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-[#ff6b35]" />
                {college.location}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold tabular-nums ${style.text}`}>
                {probability}%
              </p>
              <p className="text-xs text-slate-500">admission chance</p>
            </div>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${style.bar}`}
              style={{ width: `${probability}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-white/80 px-3 py-2 ring-1 ring-slate-100">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Placement
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-sm font-bold text-slate-800">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                {placement}%
              </p>
            </div>
            <div className="rounded-lg bg-white/80 px-3 py-2 ring-1 ring-slate-100">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Fees / year
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-sm font-bold text-slate-800">
                <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
                {formatPredictorFees(fees)}
              </p>
            </div>
            <div className="rounded-lg bg-white/80 px-3 py-2 ring-1 ring-slate-100">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Rating
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-sm font-bold text-slate-800">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {(college.rating ?? 0).toFixed(1)}
              </p>
            </div>
            <div className="rounded-lg bg-white/80 px-3 py-2 ring-1 ring-slate-100">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Est. cutoff
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-sm font-bold text-slate-800">
                <Target className="h-3.5 w-3.5 text-[#1e3a5f]" />
                {effectiveCutoff != null
                  ? effectiveCutoff.toLocaleString("en-IN")
                  : "—"}
              </p>
              <p className="text-[10px] text-slate-400">
                Your rank: {rank.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/colleges/${college.id}`}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#ff6b35] hover:text-[#ff6b35]"
            >
              View college
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
