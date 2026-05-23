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
  setFeatured([
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
    {
      id: 3,
      name: "CBIT",
      location: "Hyderabad",
      fees: 140000,
      rating: 4.5,
      placement: 92,
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80",
      ],
      logo:
        "https://www.cbit.ac.in/wp-content/uploads/2019/01/cbit-logo.png",
      description: "Top autonomous engineering college.",
      courses: ["CSE", "IT", "ECE"],
      reviews: [],
    },
  ]);

  setLoading(false);
}, []);