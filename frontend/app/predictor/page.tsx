"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calculator,
  CheckCircle2,
  Shield,
  BarChart3,
  BookOpen,
} from "lucide-react";
import {
  getCategories,
  getExams,
  predictColleges,
} from "@/services/predictorService";
import type { CategoryOption, ExamOption, PredictorResponse } from "@/types/predictor";
import PredictorForm from "@/components/predictor/PredictorForm";
import PredictorResults from "@/components/predictor/PredictorResults";
import { Skeleton } from "@/components/ui/Skeleton";

const FALLBACK_EXAMS: ExamOption[] = [
  { id: "EAMCET", label: "EAMCET", popular: true },
  { id: "JEE Main", label: "JEE Main", popular: true },
  { id: "BITSAT", label: "BITSAT", popular: true },
  { id: "SRMJEEE", label: "SRMJEEE", popular: true },
];

const FALLBACK_CATEGORIES: CategoryOption[] = [
  { id: "GENERAL", label: "General", description: "Open category" },
  { id: "OBC", label: "OBC-NCL", description: "Relaxed cutoff" },
  { id: "SC", label: "SC", description: "Relaxed cutoff" },
  { id: "ST", label: "ST", description: "Relaxed cutoff" },
  { id: "EWS", label: "EWS", description: "Relaxed cutoff" },
];

export default function PredictorPage() {
  const [exams, setExams] = useState<ExamOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [exam, setExam] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [rank, setRank] = useState("");
  const [result, setResult] = useState<PredictorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getExams(), getCategories()])
      .then(([examList, catList]) => {
        setExams(examList.length ? examList : FALLBACK_EXAMS);
        setCategories(catList.length ? catList : FALLBACK_CATEGORIES);
        const popular = examList.find((e) => e.popular) ?? examList[0];
        if (popular) setExam(popular.id);
      })
      .catch(() => {
        setExams(FALLBACK_EXAMS);
        setCategories(FALLBACK_CATEGORIES);
        setExam("EAMCET");
      });
  }, []);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = Number(rank);
    if (!exam || !category || !Number.isFinite(r) || r <= 0) return;

    setLoading(true);
    setSubmitted(true);
    setError(null);
    try {
      const res = await predictColleges(exam, r, category);
      setResult(res);
    } catch {
      setError("Prediction failed. Please check that the backend is running.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#243f66] to-[#1a3352] px-4 py-12 text-white lg:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,107,53,0.15)_0%,_transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-200 backdrop-blur">
              <Calculator className="h-3.5 w-3.5" />
              Rank &amp; college predictor
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Predict your best-fit engineering colleges
            </h1>
            <p className="mt-4 text-lg text-blue-100/90">
              Enter exam, category, and rank to see admission probability, placements,
              and fees — powered by rule-based cutoff data.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: CheckCircle2, text: "Category-wise cutoffs" },
              { icon: BarChart3, text: "Admission probability %" },
              { icon: BookOpen, text: "Fees & placement stats" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 backdrop-blur ring-1 ring-white/10"
              >
                <item.icon className="h-5 w-5 text-[#ff6b35]" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative mx-auto max-w-4xl px-4 pb-16 lg:px-8">
        <div className="-mt-10">
          {(exams.length > 0 && categories.length > 0) ? (
            <PredictorForm
              exams={exams}
              categories={categories}
              exam={exam}
              category={category}
              rank={rank}
              loading={loading}
              onExamChange={setExam}
              onCategoryChange={setCategory}
              onRankChange={setRank}
              onSubmit={handlePredict}
            />
          ) : (
            <div className="rounded-2xl border bg-white p-8 shadow-lg">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="mt-4 h-12 w-full" />
              <Skeleton className="mt-4 h-12 w-full" />
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4 text-center text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-emerald-500" />
            Rule-based engine
          </span>
          <span>·</span>
          <span>Not affiliated with any counselling authority</span>
        </div>

        {error && (
          <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            {error}
          </p>
        )}

        {submitted && loading && (
          <div className="mt-10 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {submitted && !loading && result && result.total > 0 && (
          <PredictorResults data={result} />
        )}

        {submitted && !loading && result && result.total === 0 && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-medium text-slate-800">{result.message}</p>
            <Link
              href="/colleges"
              className="mt-4 inline-block font-semibold text-[#ff6b35] hover:underline"
            >
              Explore all colleges →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
