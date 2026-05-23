"use client";

import Link from "next/link";
import { X, GitCompare } from "lucide-react";
import { useCompareStore } from "@/store/compareStore";

export default function CompareBar() {
  const { selected, remove, clear } = useCompareStore();
  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-600">
            Compare ({selected.length}/3):
          </span>
          {selected.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-[#ff6b35]"
            >
              {c.name.split(" ")[0]}
              <button type="button" onClick={() => remove(c.id)} aria-label="Remove">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={clear}
            className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Clear
          </button>
          <Link
            href="/compare"
            onClick={(e) => selected.length < 2 && e.preventDefault()}
            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white ${
              selected.length >= 2 ? "bg-[#ff6b35] hover:bg-[#e85a28]" : "bg-slate-300"
            }`}
          >
            <GitCompare className="h-4 w-4" />
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  );
}
