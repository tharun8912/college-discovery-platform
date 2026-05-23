"use client";

import Image from "next/image";
import { useState } from "react";
import { GraduationCap } from "lucide-react";

interface CollegeImageProps {
  src?: string | null;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  variant?: "logo" | "banner" | "card";
  quality?: number;
}

export default function CollegeImage({
  src,
  alt,
  fill = true,
  className,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority,
  variant = "card",
  quality = 85,
}: CollegeImageProps) {
  const [error, setError] = useState(false);
  const initials = alt
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const isLogo = variant === "logo";
  const imageClass =
    className ??
    (isLogo ? "object-contain p-2" : "object-cover");

  if (!src || error) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-orange-50 to-slate-100 ${
          fill ? "absolute inset-0" : "h-full w-full"
        }`}
        role="img"
        aria-label={alt}
      >
        {isLogo ? (
          <span className="text-xl font-bold text-[#ff6b35]">{initials}</span>
        ) : (
          <GraduationCap className="h-12 w-12 text-orange-200" />
        )}
      </div>
    );
  }

  const isSvg = src.toLowerCase().endsWith(".svg");

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={imageClass}
      sizes={sizes}
      priority={priority}
      quality={quality}
      unoptimized={isSvg}
      onError={() => setError(true)}
    />
  );
}
