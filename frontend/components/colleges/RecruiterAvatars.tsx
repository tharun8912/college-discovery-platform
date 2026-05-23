"use client";

import Image from "next/image";
import { useState } from "react";
import { recruiterInitials, recruiterLogoUrl } from "@/lib/recruiters";

interface RecruiterAvatarsProps {
  recruiters: string[];
  max?: number;
  size?: "sm" | "md";
}

export default function RecruiterAvatars({
  recruiters,
  max = 5,
  size = "sm",
}: RecruiterAvatarsProps) {
  const shown = recruiters.slice(0, max);
  const dim = size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs";

  if (shown.length === 0) return null;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {shown.map((name) => (
          <RecruiterAvatar key={name} name={name} className={dim} />
        ))}
      </div>
      {recruiters.length > max && (
        <span className="ml-2 text-xs font-medium text-slate-500">
          +{recruiters.length - max}
        </span>
      )}
    </div>
  );
}

function RecruiterAvatar({ name, className }: { name: string; className: string }) {
  const [failed, setFailed] = useState(false);
  const logoUrl = recruiterLogoUrl(name);

  return (
    <div
      title={name}
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-100 font-semibold text-slate-600 shadow-sm ${className}`}
    >
      {logoUrl && !failed ? (
        <Image
          src={logoUrl}
          alt={name}
          fill
          className="object-contain p-0.5"
          sizes="28px"
          unoptimized
          onError={() => setFailed(true)}
        />
      ) : (
        <span>{recruiterInitials(name)}</span>
      )}
    </div>
  );
}
