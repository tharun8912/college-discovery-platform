"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Star,
  IndianRupee,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { getCollegeById } from "@/services/collegeService";
import type { College } from "@/types/college";
import CollegeImage from "@/components/ui/CollegeImage";
import { useCompareStore } from "@/store/compareStore";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CollegeDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toggle, isSelected } = useCompareStore();

  useEffect(() => {
    if (!Number.isInteger(id) || id <= 0) {
      setError("Invalid college");
      setLoading(false);
      return;
    }
    getCollegeById(id)
      .then(setCollege)
      .catch(() => setError("College not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-red-600">{error}</p>
        <Link href="/colleges" className="mt-4 inline-block text-[#ff6b35] hover:underline">
          ← Back to colleges
        </Link>
      </div>
    );
  }

  const gallery = [
    college.banner || college.image,
    ...(college.campusImages ?? []),
  ].filter(Boolean) as string[];

  const inCompare = isSelected(college.id);
  const avgReview =
    college.reviews && college.reviews.length > 0
      ? college.reviews.reduce((s, r) => s + r.rating, 0) / college.reviews.length
      : college.rating;

  return (
    <div className="bg-white">
      <div className="relative h-56 sm:h-72 lg:h-80">
        <CollegeImage
          src={college.banner || college.image}
          alt={college.name}
          priority
          sizes="100vw"
          variant="banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-5xl px-4 pb-6 lg:px-8">
          <div className="flex items-end gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-4 border-white bg-white shadow-lg">
              <CollegeImage src={college.logo} alt="Logo" variant="logo" sizes="80px" />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold sm:text-3xl">{college.name}</h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-white/90">
                <MapPin className="h-4 w-4" />
                {college.location}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <Link
          href="/colleges"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#ff6b35]"
        >
          <ArrowLeft className="h-4 w-4" />
          All colleges
        </Link>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => toggle(college)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              inCompare
                ? "bg-[#ff6b35] text-white"
                : "border border-[#ff6b35] text-[#ff6b35]"
            }`}
          >
            {inCompare ? "Added to compare" : "Add to compare"}
          </button>
          {college.website && (
            <a
              href={college.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#152a45]"
            >
              Official website
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {[
            { label: "Annual fees", value: `₹${college.fees.toLocaleString("en-IN")}`, icon: IndianRupee },
            { label: "Placement", value: `${college.placement}%`, icon: TrendingUp },
            { label: "Rating", value: college.rating.toFixed(1), icon: Star },
            { label: "Programs", value: `${college.courses?.length ?? 0}`, icon: BookOpen },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-[#f5f7fa] p-4 text-center"
            >
              <Icon className="mx-auto h-5 w-5 text-[#ff6b35]" />
              <p className="mt-2 text-xs text-slate-500">{label}</p>
              <p className="text-lg font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">Overview</h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            {college.description || "No description available."}
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">Courses offered</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {(college.courses ?? []).map((c) => (
              <span
                key={c}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
              >
                {c}
              </span>
            ))}
          </div>
        </section>

        {gallery.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-slate-900">Campus gallery</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative h-48 overflow-hidden rounded-xl border border-slate-200"
                >
                  <CollegeImage src={src} alt={`Campus ${i + 1}`} sizes="400px" />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Student reviews</h2>
            <span className="text-sm text-slate-500">
              {avgReview.toFixed(1)} avg · {college.reviews?.length ?? 0} reviews
            </span>
          </div>
          <div className="mt-4 space-y-4">
            {(college.reviews ?? []).length === 0 ? (
              <p className="text-slate-500">No reviews yet.</p>
            ) : (
              college.reviews!.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{r.author}</span>
                    <span className="flex items-center gap-1 text-amber-600">
                      <Star className="h-4 w-4 fill-amber-400" />
                      {r.rating}
                    </span>
                  </div>
                  <p className="mt-2 text-slate-600">{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
