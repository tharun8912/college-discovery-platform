import { Suspense } from "react";
import CollegesListing from "./CollegesListing";
import { CollegeCardSkeleton } from "@/components/ui/Skeleton";

export const metadata = {
  title: "All Colleges",
  description: "Browse and filter engineering colleges across India",
};

export default function CollegesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CollegeCardSkeleton key={i} />
          ))}
        </div>
      }
    >
      <CollegesListing />
    </Suspense>
  );
}
