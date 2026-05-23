import { Suspense } from "react";
import CollegesListing from "./CollegesListing";
import { CollegeCardSkeleton } from "@/components/ui/Skeleton";

export const metadata = {
  title: "All Colleges",
  description: "Browse and filter engineering colleges across India",
};

export default function CollegesPage() {
  const featured = [
  {
    id: 1,
    name: "IIIT Hyderabad",
    location: "Hyderabad",
    fees: 350000,
    rating: 4.9,
    placement: 98,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    ],
    logo:
      "https://upload.wikimedia.org/wikipedia/en/8/8d/IIIT_Hyderabad_Logo.png",
    description: "Premier research engineering institute.",
    courses: ["CSE", "ECE", "AI"],
    reviews: [],
  },
  {
    id: 2,
    name: "BITS Pilani Hyderabad",
    location: "Hyderabad",
    fees: 420000,
    rating: 4.8,
    placement: 96,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
    ],
    logo:
      "https://upload.wikimedia.org/wikipedia/en/d/d3/BITS_Pilani-Logo.svg",
    description: "Top private engineering institute.",
    courses: ["CSE", "ECE", "EEE"],
    reviews: [],
  },
];
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
