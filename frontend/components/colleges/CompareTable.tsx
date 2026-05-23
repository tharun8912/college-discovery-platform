"use client";

import Link from "next/link";
import { MapPin, IndianRupee, TrendingUp, Star, BookOpen, Trophy } from "lucide-react";
import type { College } from "@/types/college";
import CollegeImage from "@/components/ui/CollegeImage";
import { useCompareStore } from "@/store/compareStore";
import {
  formatFees,
  getBestCollegeIds,
  type CompareMetric,
} from "@/lib/compareUtils";

interface CompareTableProps {
  colleges: College[];
}

function BestBadge() {
  return (
    <span className="ml-1.5 inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
      <Trophy className="h-2.5 w-2.5" />
      Best
    </span>
  );
}

function Cell({
  collegeId,
  bestIds,
  children,
  className = "",
}: {
  collegeId: number;
  bestIds: Set<number>;
  children: React.ReactNode;
  className?: string;
}) {
  const isBest = bestIds.has(collegeId);
  return (
    <td
      className={`p-4 align-top text-sm text-slate-700 ${isBest ? "bg-emerald-50/80 font-semibold text-emerald-900" : ""} ${className}`}
    >
      <div className="flex flex-wrap items-center gap-1">
        {children}
        {isBest && <BestBadge />}
      </div>
    </td>
  );
}

export default function CompareTable({ colleges }: CompareTableProps) {
  const { remove } = useCompareStore();

  const bestFees = getBestCollegeIds(colleges, "fees");
  const bestPlacement = getBestCollegeIds(colleges, "placement");
  const bestRating = getBestCollegeIds(colleges, "rating");
  const bestCourses = getBestCollegeIds(colleges, "courseCount");
  const bestNirf = getBestCollegeIds(colleges, "nirfRank");
  const bestAvgPackage = getBestCollegeIds(colleges, "avgPackage");
  const bestHighestPackage = getBestCollegeIds(colleges, "highestPackage");

  const metrics: {
    key: string;
    label: string;
    icon: React.ReactNode;
    bestIds: Set<number>;
    render: (c: College) => React.ReactNode;
  }[] = [
    {
      key: "location",
      label: "Location",
      icon: <MapPin className="h-4 w-4 text-[#ff6b35]" />,
      bestIds: new Set(),
      render: (c) => c.location,
    },
    {
      key: "nirfRank",
      label: "NIRF Rank",
      icon: <Trophy className="h-4 w-4 text-amber-500" />,
      bestIds: bestNirf,
      render: (c) => (c.nirfRank || c.ranking) ? `#${c.nirfRank || c.ranking}` : "—",
    },
    {
      key: "rating",
      label: "Rating (Out of 5)",
      icon: <Star className="h-4 w-4 fill-amber-400 text-amber-400" />,
      bestIds: bestRating,
      render: (c) => (c.careers360Rating || c.rating || 0).toFixed(1),
    },
    {
      key: "fees",
      label: "Annual Fees",
      icon: <IndianRupee className="h-4 w-4 text-red-500" />,
      bestIds: bestFees,
      render: (c) => formatFees(c.fees),
    },
    {
      key: "avgPackage",
      label: "Avg Package",
      icon: <IndianRupee className="h-4 w-4 text-blue-500" />,
      bestIds: bestAvgPackage,
      render: (c) => c.avgPackage ? formatFees(c.avgPackage) : "—",
    },
    {
      key: "highestPackage",
      label: "Highest Package",
      icon: <IndianRupee className="h-4 w-4 text-emerald-500" />,
      bestIds: bestHighestPackage,
      render: (c) => c.highestPackage ? formatFees(c.highestPackage) : "—",
    },
    {
      key: "placement",
      label: "Placement %",
      icon: <TrendingUp className="h-4 w-4 text-emerald-600" />,
      bestIds: bestPlacement,
      render: (c) => `${c.placementPercentage || c.placement || 0}%`,
    },
    {
      key: "courses",
      label: "Courses",
      icon: <BookOpen className="h-4 w-4 text-[#1e3a5f]" />,
      bestIds: bestCourses,
      render: (c) => (
        <div className="flex flex-wrap gap-1">
          {(c.courses ?? []).length > 0 ? (
            (c.courses ?? []).map((course) => (
              <span
                key={course}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
              >
                {course}
              </span>
            ))
          ) : (
            <span className="text-slate-400">—</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="max-h-[min(70vh,720px)] overflow-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="sticky left-0 top-0 z-30 min-w-[140px] border-b border-slate-200 bg-[#f5f7fa] p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.06)]">
                Criteria
              </th>
              {colleges.map((c) => (
                <th
                  key={c.id}
                  className="sticky top-0 z-20 min-w-[200px] border-b border-slate-200 bg-[#f5f7fa] p-4 align-top"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      <CollegeImage
                        src={c.logo}
                        alt={`${c.name} logo`}
                        variant="logo"
                        sizes="56px"
                      />
                    </div>
                    <Link
                      href={`/colleges/${c.id}`}
                      className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-[#ff6b35] hover:underline"
                    >
                      {c.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(c.id)}
                      className="mt-2 text-xs text-slate-400 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
              {colleges.length < 3 && (
                <th className="sticky top-0 z-20 min-w-[160px] border-b border-dashed border-slate-200 bg-slate-50/80 p-4 align-top">
                  <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
                    <span className="text-2xl font-light">+</span>
                    <Link
                      href="/colleges"
                      className="mt-1 text-xs font-medium text-[#ff6b35] hover:underline"
                    >
                      Add college
                    </Link>
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {metrics.map((row) => (
              <tr key={row.key} className="border-b border-slate-100 last:border-0">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-white p-4 text-sm font-medium text-slate-600 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.04)]"
                >
                  <span className="flex items-center gap-2">
                    {row.icon}
                    {row.label}
                  </span>
                </th>
                {colleges.map((c) => (
                  <Cell key={c.id} collegeId={c.id} bestIds={row.bestIds}>
                    {row.render(c)}
                  </Cell>
                ))}
                {colleges.length < 3 && (
                  <td className="bg-slate-50/50 p-4 text-sm text-slate-300">—</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="border-t border-slate-100 bg-slate-50/80 px-4 py-2 text-center text-xs text-slate-500">
        <Trophy className="mr-1 inline h-3 w-3 text-emerald-600" />
        Green highlights show the best value in each row (lowest fees, highest placement, rating &amp; course count)
      </p>
    </div>
  );
}
