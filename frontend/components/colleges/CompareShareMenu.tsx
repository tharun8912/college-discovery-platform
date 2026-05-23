"use client";

import { useState } from "react";
import { Copy, Download, Share2, Check, Link2 } from "lucide-react";
import type { College } from "@/types/college";
import {
  buildComparisonCsv,
  buildComparisonExport,
  buildShareUrl,
} from "@/lib/compareUtils";

interface CompareShareMenuProps {
  colleges: College[];
}

export default function CompareShareMenu({ colleges }: CompareShareMenuProps) {
  const [copied, setCopied] = useState<"link" | "text" | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);

  const ids = colleges.map((c) => c.id);
  const shareUrl =
    typeof window !== "undefined"
      ? buildShareUrl(ids, window.location.origin)
      : `/compare?ids=${ids.join(",")}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied("link");
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setShareError("Could not copy link");
    }
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(buildComparisonExport(colleges));
      setCopied("text");
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setShareError("Could not copy comparison");
    }
  };

  const downloadCsv = () => {
    const blob = new Blob([buildComparisonCsv(colleges)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `college-comparison-${ids.join("-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const nativeShare = async () => {
    setShareError(null);
    const text = buildComparisonExport(colleges);
    if (navigator.share) {
      try {
        await navigator.share({
          title: "College comparison — CampusCompass",
          text,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setShareError("Share cancelled or unavailable");
        }
      }
    } else {
      await copyLink();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#ff6b35] hover:text-[#ff6b35]"
        >
          {copied === "link" ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
          {copied === "link" ? "Link copied" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={copyText}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#ff6b35] hover:text-[#ff6b35]"
        >
          {copied === "text" ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied === "text" ? "Copied" : "Copy summary"}
        </button>
        <button
          type="button"
          onClick={downloadCsv}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#ff6b35] hover:text-[#ff6b35]"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
        <button
          type="button"
          onClick={nativeShare}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#2a4d73]"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>
      {shareError && (
        <p className="text-xs text-red-600">{shareError}</p>
      )}
      <p className="hidden max-w-xl truncate text-xs text-slate-400 sm:block" title={shareUrl}>
        Share link: {shareUrl}
      </p>
    </div>
  );
}
