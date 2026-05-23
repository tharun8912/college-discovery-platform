"use client";

import { ClipboardList, GraduationCap, Hash, Users } from "lucide-react";
import type { CategoryOption, ExamOption } from "@/types/predictor";

interface PredictorFormProps {
  exams: ExamOption[];
  categories: CategoryOption[];
  exam: string;
  category: string;
  rank: string;
  loading: boolean;
  onExamChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onRankChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function PredictorForm({
  exams,
  categories,
  exam,
  category,
  rank,
  loading,
  onExamChange,
  onCategoryChange,
  onRankChange,
  onSubmit,
}: PredictorFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 lg:p-8"
    >
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          { step: 1, title: "Exam", desc: "Select your entrance test" },
          { step: 2, title: "Category", desc: "Reservation category" },
          { step: 3, title: "Rank", desc: "Enter your official rank" },
        ].map((s) => (
          <div
            key={s.step}
            className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1e3a5f] text-sm font-bold text-white">
              {s.step}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">{s.title}</p>
              <p className="text-xs text-slate-500">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <ClipboardList className="h-4 w-4 text-[#ff6b35]" />
            Exam type
          </span>
          <select
            value={exam}
            onChange={(e) => onExamChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#ff6b35] focus:ring-2 focus:ring-orange-100"
            required
          >
            {exams.map((e) => (
              <option key={e.id} value={e.id}>
                {e.label}
                {e.popular ? " ★" : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Users className="h-4 w-4 text-[#ff6b35]" />
            Category
          </span>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#ff6b35] focus:ring-2 focus:ring-orange-100"
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          {categories.find((c) => c.id === category)?.description && (
            <p className="mt-1.5 text-xs text-slate-500">
              {categories.find((c) => c.id === category)?.description}
            </p>
          )}
        </label>

        <label className="block">
          <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Hash className="h-4 w-4 text-[#ff6b35]" />
            Your rank
          </span>
          <input
            type="number"
            min={1}
            value={rank}
            onChange={(e) => onRankChange(e.target.value)}
            placeholder="e.g. 12,000"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#ff6b35] focus:ring-2 focus:ring-orange-100"
            required
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#e85a28] py-3.5 text-base font-bold text-white shadow-lg shadow-orange-200/60 transition hover:shadow-xl disabled:opacity-60 lg:w-auto lg:px-12"
      >
        <GraduationCap className="h-5 w-5" />
        {loading ? "Analysing your rank…" : "Predict my colleges"}
      </button>
    </form>
  );
}
