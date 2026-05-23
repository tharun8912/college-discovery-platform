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
  const courses = college.courses?.slice(0, 4) ?? [];
  const recruiters = college.recruiters ?? [];

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
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-orange-200/60 hover:shadow-xl hover:shadow-orange-100/40 ${
        isFeatured ? "ring-1 ring-orange-100/50" : ""
      }`}
    >
      <div className="relative h-40 overflow-hidden bg-slate-100">
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
          <CollegeImage
            src={college.banner || college.image}
            alt={college.name}
            sizes="(max-width:768px) 100vw, 33vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
        <span
          aria-hidden
          className="card-shine pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100"
        />

        {college.ranking != null && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg bg-[#1e3a5f]/90 px-2 py-1 text-xs font-bold text-white shadow backdrop-blur-sm">
            <Trophy className="h-3 w-3 text-amber-300" />
            #{college.ranking} NIRF
          </span>
        )}

        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-lg bg-white/95 px-2 py-1 text-xs font-bold text-amber-600 shadow">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {college.rating.toFixed(1)}
          </span>
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

        <div className="absolute bottom-3 left-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border-2 border-white bg-white shadow-lg">
          <CollegeImage
            src={college.logo}
            alt={`${college.name} logo`}
            variant="logo"
            className="object-contain p-1"
            sizes="48px"
          />
        </div>

        <div className="absolute bottom-3 right-3 flex flex-wrap justify-end gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/95 px-2 py-1 text-xs font-semibold text-white shadow">
            <TrendingUp className="h-3 w-3" />
            {college.placement}% placed
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-white/95 px-2 py-1 text-xs font-semibold text-slate-800 shadow">
            <IndianRupee className="h-3 w-3 text-emerald-600" />
            {formatFees(college.fees)}/yr
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h2 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900 transition-colors group-hover:text-[#ff6b35]">
          <Link href={`/colleges/${college.id}`} className="hover:underline">
            {college.name}
          </Link>
        </h2>

        <p className="mt-1.5 flex items-center gap-1 text-sm text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#ff6b35]" />
          {college.location}
        </p>

        {courses.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {courses.map((course) => (
              <span
                key={course}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
              >
                {course}
              </span>
            ))}
            {(college.courses?.length ?? 0) > courses.length && (
              <span className="rounded-md bg-orange-50 px-2 py-0.5 text-xs font-medium text-[#ff6b35]">
                +{(college.courses?.length ?? 0) - courses.length}
              </span>
            )}
          </div>
        )}

        {recruiters.length > 0 && (
          <div className="mt-3 border-t border-slate-100 pt-3">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Top recruiters
            </p>
            <RecruiterAvatars recruiters={recruiters} max={5} />
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <Link
            href={`/colleges/${college.id}`}
            className="flex-1 rounded-lg bg-[#ff6b35] py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#e85a28] hover:shadow-md"
          >
            View Details
          </Link>

          <label
            className={`flex cursor-pointer select-none items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
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
            <span className="hidden sm:inline">Compare</span>
          </label>
        </div>
      </div>
    </article>
  );
}
