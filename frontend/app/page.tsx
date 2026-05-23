"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, TrendingUp } from "lucide-react";
import CollegeCard from "@/components/colleges/CollegeCard";
import CompareBar from "@/components/colleges/CompareBar";
import { getFeaturedColleges } from "@/services/collegeService";
import type { College } from "@/types/college";
import { CollegeCardSkeleton } from "@/components/ui/Skeleton";

const trending = [
  {
    label: "CSE colleges Hyderabad",
    href: "/colleges?course=CSE&location=Hyderabad",
  },
  {
    label: "Under 1.5L fees",
    href: "/colleges?maxFees=150000",
  },
  {
    label: "IIIT Hyderabad",
    href: "/colleges?search=IIIT",
  },
  {
    label: "BITS Pilani",
    href: "/colleges?search=BITS",
  },
  {
    label: "EAMCET top colleges",
    href: "/colleges?exam=EAMCET",
  },
  {
    label: "High placement colleges",
    href: "/colleges?minPlacement=85",
  },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedColleges()
      .then(setFeatured)
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#fff5f0_0%,_transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#ff6b35]">
              #1 College Discovery Platform
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-[#1e3a5f] sm:text-5xl lg:text-6xl">
              "Find the right college for your bright future"
            </h1>
            <p className="mt-4 text-lg text-slate-600">
            Discover top colleges, compare placements & fees, predict admissions, and make smarter career decisions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/colleges"
                className="inline-flex items-center gap-2 rounded-xl bg-[#ff6b35] px-6 py-3 font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-[#e85a28] hover:shadow-xl"
              >
                <Search className="h-5 w-5" />
                Explore Colleges
              </Link>
              <Link
                href="/predictor"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#1e3a5f] px-6 py-3 font-semibold text-[#1e3a5f] transition hover:bg-[#1e3a5f] hover:text-white"
              >
                Rank Predictor
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex items-center gap-2 text-slate-800">
          <TrendingUp className="h-5 w-5 text-[#ff6b35]" />
          <h2 className="font-semibold">Trending searches</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
        {trending.map((item) => (
          <Link
          key={item.label}
          href={item.href}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:border-[#ff6b35] hover:text-[#ff6b35] hover:shadow-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured colleges</h2>
            <p className="mt-1 text-slate-500">Top-rated institutes students are exploring</p>
          </div>
          <Link
            href="/colleges"
            className="text-sm font-semibold text-[#ff6b35] hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <CollegeCardSkeleton key={i} />
              ))
            : featured.map((college) => (
                <CollegeCard key={college.id} college={college} variant="featured" />
              ))}
        </div>
      </section>
      <CompareBar />
    </>
  );
}
