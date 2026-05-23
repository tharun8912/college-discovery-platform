import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ff6b35] text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="font-bold text-slate-900">CampusCompass</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            India&apos;s trusted college discovery platform. Search, compare, and
            decide with confidence.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/colleges" className="hover:text-[#ff6b35]">All Colleges</Link></li>
            <li><Link href="/compare" className="hover:text-[#ff6b35]">Compare</Link></li>
            <li><Link href="/predictor" className="hover:text-[#ff6b35]">Rank Predictor</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">Community</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/discussions" className="hover:text-[#ff6b35]">Q&A Forum</Link></li>
            <li><Link href="/saved" className="hover:text-[#ff6b35]">Saved Items</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">Account</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/login" className="hover:text-[#ff6b35]">Login</Link></li>
            <li><Link href="/signup" className="hover:text-[#ff6b35]">Sign up</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} CampusCompass. All rights reserved.
      </div>
    </footer>
  );
}
