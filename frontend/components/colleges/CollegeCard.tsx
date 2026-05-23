"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Star,
  Bookmark,
  Trophy,
  TrendingUp,
  IndianRupee,
  Briefcase,
  Flame,
} from "lucide-react";
import type { College } from "@/types/college";
import { useCompareStore, MAX_COMPARE } from "@/store/compareStore";
import CollegeImage from "@/components/ui/CollegeImage";
import RecruiterAvatars from "@/components/colleges/RecruiterAvatars";
import { useAuth } from "@/lib/auth-context";
import { saveCollege, unsaveCollege } from "@/services/authService";
import { useState } from "react";

interface CollegeCardProps {
  college: College;
  saved?: boolean;
  onSaveChange?: () => void;
  variant?: "default" | "featured";
}

function formatFees(fees: number): string {
  if (fees >= 100000) {
    const lakhs = fees / 100000;
    return lakhs % 1 === 0 ? `₹${lakhs}L` : `₹${lakhs.toFixed(1)}L`;
  }
  return `₹${fees.toLocaleString("en-IN")}`;
}

export default function CollegeCard({
  college,
  saved = false,
  onSaveChange,
  variant = "default",
}: CollegeCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { toggle, isSelected, selected } = useCompareStore();
  const selectedFlag = isSelected(college.id);
  const atLimit = selected.length >= MAX_COMPARE && !selectedFlag;
  const [isSaved, setIsSaved] = useState(saved);
  const [saving, setSaving] = useState(false);

  const isFeatured = variant === "featured" || college.featured;
  const courses = college.courses?.slice(0, 3) ?? [];
  const recruiters = college.recruiters ?? [];

  const rank = college.nirfRank ?? college.ranking;
  const placementRate = college.placementPercentage ?? college.placement;
  const ratingValue = college.careers360Rating ?? college.rating ?? 0;
  const avgPkg = college.avgPackage ?? 0;
  const highestPkg = college.highestPackage ?? 0;

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent("/")}`);
      return;
    }
    setSaving(true);
    try {
      if (isSaved) {
        await unsaveCollege(college.id);
        setIsSaved(false);
      } else {
        await saveCollege(college.id);
        setIsSaved(true);
      }
      onSaveChange?.();
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const handleCompareChange = () => {
    if (!atLimit || selectedFlag) toggle(college);
  };

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl ${
        isFeatured 
          ? "border-orange-200 ring-1 ring-orange-100/50 hover:border-orange-300" 
          : "border-slate-200/80 hover:border-orange-200/60"
      }`}
    >
      {/* Card Header Image Overlay */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
          <CollegeImage
            src={college.banner || college.image || "/images/placeholder-campus.jpg"}
            alt={college.name}
            sizes="(max-width:768px) 100vw, 33vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        <span
          aria-hidden
          className="card-shine pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
        />

        {/* Badges Column Left */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          {isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#ff6b35] to-orange-500 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow shadow-orange-500/20">
              <Flame className="h-3 w-3 fill-current text-white animate-pulse" />
              Featured
            </span>
          )}
          {rank != null && rank > 0 && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#1e3a5f]/95 px-2.5 py-1 text-[11px] font-bold text-white shadow backdrop-blur-sm">
              <Trophy className="h-3 w-3 text-yellow-400" />
              #{rank} NIRF
            </span>
          )}
        </div>

        {/* Rating and Save Right */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 z-10">
          {ratingValue > 0 && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-white/95 px-2 py-1 text-xs font-bold text-slate-800 shadow">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {ratingValue.toFixed(1)}
            </span>
          )}
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            title={isSaved ? "Remove from saved" : "Save college"}
            aria-label={isSaved ? "Remove from saved" : "Save college"}
            className={`rounded-lg p-1.5 shadow backdrop-blur-sm transition ${
              isSaved
                ? "bg-[#ff6b35] text-white"
                : "bg-white/95 text-slate-500 hover:bg-white hover:text-[#ff6b35]"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Logo Container */}
        <div className="absolute bottom-3 left-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border-2 border-white bg-white shadow-lg z-10">
          <CollegeImage
            src={college.logo}
            alt={`${college.name} logo`}
            variant="logo"
            className="object-contain p-1"
            sizes="56px"
          />
        </div>

        {/* Established Year Badge */}
        {college.establishedYear ? (
          <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            Est. {college.establishedYear}
          </span>
        ) : null}
      </div>

      {/* Card Body content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2">
          {college.accreditation && (
            <span className="text-[10px] font-bold tracking-wider text-[#ff6b35] uppercase">
              {college.accreditation}
            </span>
          )}
          <h2 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#ff6b35]">
            <Link href={`/colleges/${college.id}`} className="hover:underline">
              {college.name}
            </Link>
          </h2>

          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 font-medium">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#ff6b35]" />
            {college.location}, {college.state || "Telangana"}
          </p>
        </div>

        {/* Stats Grid - Careers360 style */}
        <div className="my-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-slate-50 p-3 text-xs border border-slate-100">
          <div>
            <p className="text-[10px] font-medium text-slate-400 uppercase">Avg Package</p>
            <p className="text-sm font-bold text-slate-800">
              {avgPkg > 0 ? `₹${avgPkg.toFixed(1)} LPA` : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-slate-400 uppercase">Highest Pkg</p>
            <p className="text-sm font-bold text-slate-800 font-mono">
              {highestPkg > 0 ? `₹${highestPkg.toFixed(1)} LPA` : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-slate-400 uppercase">Placement %</p>
            <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              {placementRate > 0 ? `${placementRate}%` : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-slate-400 uppercase">Annual Fees</p>
            <p className="text-sm font-bold text-slate-800 flex items-center gap-0.5">
              <IndianRupee className="h-3 w-3 text-slate-500 shrink-0" />
              {formatFees(college.fees)}
            </p>
          </div>
        </div>

        {/* Courses offered */}
        {courses.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {courses.map((course) => (
                <span
                  key={course}
                  className="rounded-md bg-orange-50/50 border border-orange-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                >
                  {course}
                </span>
              ))}
              {(college.courses?.length ?? 0) > courses.length && (
                <span className="rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-[#ff6b35]">
                  +{(college.courses?.length ?? 0) - courses.length} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Recruiters section */}
        {recruiters.length > 0 && (
          <div className="mb-4 border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Briefcase className="h-3 w-3 text-slate-400" />
                Top Hiring Partners
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">
                {recruiters.length} recruiters
              </span>
            </div>
            <div className="mt-1.5">
              <RecruiterAvatars recruiters={recruiters} max={5} />
            </div>
          </div>
        )}

        {/* Actions Button Block */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <Link
            href={`/colleges/${college.id}`}
            className="flex-1 rounded-xl bg-[#ff6b35] py-2.5 text-center text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#e85a28] hover:shadow-md hover:shadow-orange-100"
          >
            View College
          </Link>

          <label
            className={`flex cursor-pointer select-none items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition-all duration-200 ${
              selectedFlag
                ? "border-[#ff6b35] bg-orange-50 text-[#ff6b35]"
                : atLimit
                  ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400"
                  : "border-slate-200 text-slate-600 hover:border-orange-200 hover:bg-orange-50/50"
            }`}
          >
            <input
              type="checkbox"
              checked={selectedFlag}
              disabled={atLimit}
              onChange={handleCompareChange}
              className="h-4 w-4 rounded border-slate-300 text-[#ff6b35] focus:ring-[#ff6b35] disabled:opacity-50"
            />
            <span>Compare</span>
          </label>
        </div>
      </div>
    </article>
  );
}
