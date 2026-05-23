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
  Trophy,
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
    ...(college.images?.campus || []),
    ...(college.images?.building || []),
    college.banner || college.image,
    ...(college.campusImages ?? []),
  ].filter(Boolean) as string[];

  const inCompare = isSelected(college.id);
  const avgReview =
    college.reviews && college.reviews.length > 0
      ? college.reviews.reduce((s, r) => s + r.rating, 0) / college.reviews.length
      : college.careers360Rating || college.rating;

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <div className="relative h-64 sm:h-80 lg:h-96">
        <CollegeImage
          src={gallery[0] || college.banner || college.image}
          alt={college.name}
          priority
          sizes="100vw"
          variant="banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-7xl px-4 pb-8 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl">
              <CollegeImage src={college.logo} alt="Logo" variant="logo" sizes="128px" />
            </div>
            <div className="text-white flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                {college.nirfRank != null && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-1 text-sm font-bold text-amber-300 backdrop-blur-md">
                    <Trophy className="h-4 w-4" />
                    #{college.nirfRank} NIRF
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-sm font-bold text-emerald-300 backdrop-blur-md">
                  <Star className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                  {avgReview.toFixed(1)} Rating
                </span>
                {college.ownershipType && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
                    {college.ownershipType}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{college.name}</h1>
              <p className="mt-2 text-lg text-slate-300 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#ff6b35]" />
                {college.location}{college.state ? `, ${college.state}` : ''}
                {college.establishedYear && <span className="ml-2 pl-2 border-l border-slate-500 hidden sm:inline">Estd. {college.establishedYear}</span>}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-6">
          <Link
            href="/colleges"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#ff6b35] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to colleges
          </Link>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => toggle(college)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all ${
                inCompare
                  ? "bg-[#ff6b35] text-white hover:bg-[#e85a28]"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-[#ff6b35] hover:text-[#ff6b35]"
              }`}
            >
              {inCompare ? "Added to compare" : "Add to compare"}
            </button>
            {(college.officialWebsite || college.website) && (
              <a
                href={college.officialWebsite || college.website!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#152a45]"
              >
                Website
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <IndianRupee className="h-6 w-6 text-[#ff6b35] mb-3" />
                <p className="text-sm text-slate-500 font-medium mb-1">Annual Fees</p>
                <p className="text-xl font-bold text-slate-900">₹{(college.fees / 100000).toFixed(1)} L</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <TrendingUp className="h-6 w-6 text-emerald-500 mb-3" />
                <p className="text-sm text-slate-500 font-medium mb-1">Avg Package</p>
                <p className="text-xl font-bold text-slate-900">{college.avgPackage ? `₹${(college.avgPackage / 100000).toFixed(1)} L` : 'N/A'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <Trophy className="h-6 w-6 text-amber-500 mb-3" />
                <p className="text-sm text-slate-500 font-medium mb-1">Highest Package</p>
                <p className="text-xl font-bold text-slate-900">{college.highestPackage ? `₹${(college.highestPackage / 100000).toFixed(1)} L` : 'N/A'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <BookOpen className="h-6 w-6 text-blue-500 mb-3" />
                <p className="text-sm text-slate-500 font-medium mb-1">Placement Rate</p>
                <p className="text-xl font-bold text-slate-900">{college.placementPercentage || college.placement || 'N/A'}%</p>
              </div>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">About {college.shortName || college.name}</h2>
              <div className="prose max-w-none text-slate-600">
                <p className="text-lg leading-relaxed mb-4">{college.detailedOverview || college.description || "No overview available."}</p>
              </div>
            </section>

            <div className="grid sm:grid-cols-2 gap-8">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Admission Process</h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {college.admissionProcess || "Admission process details will be updated soon."}
                </p>
                {college.examsAccepted && college.examsAccepted.length > 0 && (
                  <div className="mt-4">
                    <span className="block text-sm font-semibold text-slate-900 mb-2">Exams Accepted:</span>
                    <div className="flex flex-wrap gap-2">
                      {college.examsAccepted.map((exam) => (
                         <span key={exam} className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-medium text-[#ff6b35] border border-orange-100">{exam}</span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Eligibility Criteria</h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {college.eligibility || "Eligibility criteria details will be updated soon."}
                </p>
              </section>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Courses Offered</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {(college.courses ?? []).map((c) => (
                  <div key={c} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-slate-100">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-slate-700">{c}</span>
                  </div>
                ))}
              </div>
            </section>

            {gallery.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Campus Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gallery.map((src, i) => (
                    <div key={i} className="group relative aspect-video overflow-hidden rounded-xl bg-slate-100">
                      <CollegeImage src={src} alt={`Campus ${i + 1}`} sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                    </div>
                  ))}
                </div>
              </section>
            )}
            
          </div>

          <div className="space-y-8">
            {/* Sidebar content */}
            {college.facilities && college.facilities.length > 0 && (
               <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                 <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Facilities</h3>
                 <ul className="space-y-3">
                   {college.facilities.map(facility => (
                     <li key={facility} className="flex items-center gap-3 text-sm text-slate-600">
                       <div className="h-1.5 w-1.5 rounded-full bg-[#ff6b35]" />
                       {facility}
                     </li>
                   ))}
                 </ul>
               </section>
            )}

            {college.recruiters && college.recruiters.length > 0 && (
               <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                 <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Top Recruiters</h3>
                 <div className="flex flex-wrap gap-2">
                   {college.recruiters.map(r => (
                     <span key={r} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">{r}</span>
                   ))}
                 </div>
               </section>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Student Reviews</h3>
              <div className="mb-6 text-center">
                <p className="text-4xl font-extrabold text-slate-900">{avgReview.toFixed(1)}</p>
                <div className="flex justify-center my-2 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                     <Star key={i} className={`h-5 w-5 ${i < Math.round(avgReview) ? 'fill-current' : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-sm text-slate-500">Based on {college.reviews?.length ?? 0} reviews</p>
              </div>
              <div className="space-y-4">
                {(college.reviews ?? []).length === 0 ? (
                  <p className="text-center text-sm text-slate-500">No reviews yet.</p>
                ) : (
                  college.reviews!.slice(0, 3).map((r) => (
                    <div key={r.id} className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900 text-sm">{r.author}</span>
                        <span className="flex items-center gap-1 text-amber-600 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                          <Star className="h-3 w-3 fill-amber-400" />
                          {r.rating}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-3">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
