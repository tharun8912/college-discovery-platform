"use client";

import Link from "next/link";
import { MapPin, IndianRupee, TrendingUp, Star, BookOpen, Trophy } from "lucide-react";
import type { College } from "@/types/college";
import CollegeImage from "@/components/ui/CollegeImage";
import { useCompareStore } from "@/store/compareStore";
import { formatFees, getBestCollegeIds } from "@/lib/compareUtils";

interface CompareMobileCardsProps {
  colleges: College[];
}

function MetricRow({
  label,
  icon,
  values,
  bestIds,
}: {
  label: string;
  icon: React.ReactNode;
  values: { id: number; text: string }[];
  bestIds: Set<number>;
}) {
  return (
    <div className="border-b border-slate-100 py-3 last:border-0">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {icon}
        {label}
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${values.length}, 1fr)` }}>
        {values.map((v) => (
          <div
            key={v.id}
            className={`rounded-lg px-2 py-1.5 text-center text-sm ${
              bestIds.has(v.id)
                ? "bg-emerald-50 font-semibold text-emerald-800 ring-1 ring-emerald-200"
                : "bg-slate-50 text-slate-700"
            }`}
          >
            {v.text}
            {bestIds.has(v.id) && (
              <Trophy className="mx-auto mt-0.5 h-3 w-3 text-emerald-600" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CompareMobileCards({ colleges }: CompareMobileCardsProps) {
  const { remove } = useCompareStore();
  const bestFees = getBestCollegeIds(colleges, "fees");
  const bestPlacement = getBestCollegeIds(colleges, "placement");
  const bestRating = getBestCollegeIds(colleges, "rating");
  const bestCourses = getBestCollegeIds(colleges, "courseCount");

  return (
    <div className="space-y-4 lg:hidden">
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${colleges.length}, 1fr)` }}>
        {colleges.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm"
          >
            <div className="relative mx-auto h-12 w-12 overflow-hidden rounded-lg border bg-white">
              <CollegeImage src={c.logo} alt="" variant="logo" sizes="48px" />
            </div>
            <Link
              href={`/colleges/${c.id}`}
              className="mt-2 line-clamp-2 text-xs font-semibold text-[#ff6b35]"
            >
              {c.name}
            </Link>
            <button
              type="button"
              onClick={() => remove(c.id)}
              className="mt-1 text-[10px] text-slate-400"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <MetricRow
          label="Location"
          icon={<MapPin className="h-3.5 w-3.5" />}
          bestIds={new Set()}
          values={colleges.map((c) => ({ id: c.id, text: c.location }))}
        />
        <MetricRow
          label="Fees / yr"
          icon={<IndianRupee className="h-3.5 w-3.5" />}
          bestIds={bestFees}
          values={colleges.map((c) => ({ id: c.id, text: formatFees(c.fees) }))}
        />
        <MetricRow
          label="Placement"
          icon={<TrendingUp className="h-3.5 w-3.5" />}
          bestIds={bestPlacement}
          values={colleges.map((c) => ({ id: c.id, text: `${c.placement}%` }))}
        />
        <MetricRow
          label="Rating"
          icon={<Star className="h-3.5 w-3.5" />}
          bestIds={bestRating}
          values={colleges.map((c) => ({ id: c.id, text: (c.rating ?? 0).toFixed(1) }))}
        />
        <div className="pt-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <BookOpen className="h-3.5 w-3.5" />
            Courses
          </div>
          <div className="space-y-3">
            {colleges.map((c) => (
              <div
                key={c.id}
                className={`rounded-lg p-2 ${bestCourses.has(c.id) ? "bg-emerald-50 ring-1 ring-emerald-200" : "bg-slate-50"}`}
              >
                <p className="mb-1 text-[10px] font-medium text-slate-500 line-clamp-1">
                  {c.name.split(" ")[0]}
                </p>
                <div className="flex flex-wrap gap-1">
                  {(c.courses ?? []).map((course) => (
                    <span
                      key={course}
                      className="rounded bg-white px-1.5 py-0.5 text-[10px] text-slate-600"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
