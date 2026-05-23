"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  GitCompare,
  Search,
  Calculator,
  MessageCircle,
  Bookmark,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCompareStore } from "@/store/compareStore";

const links = [
  { href: "/colleges", label: "Colleges", icon: Search },
  { href: "/predictor", label: "Predictor", icon: Calculator },
  { href: "/discussions", label: "Q&A", icon: MessageCircle },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const compareCount = useCompareStore((s) => s.selected.length);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff6b35] text-white shadow-md shadow-orange-200">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div className="hidden sm:block">
            <span className="text-lg font-bold tracking-tight text-slate-900">
              CampusCompass
            </span>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
              College Discovery
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-50 ${
                pathname.startsWith(href)
                  ? "text-[#ff6b35] bg-orange-50"
                  : "text-slate-600"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/compare"
            className="relative flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#ff6b35] hover:text-[#ff6b35]"
          >
            <GitCompare className="h-4 w-4" />
            <span className="hidden sm:inline">Compare</span>
            {compareCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff6b35] px-1 text-[10px] font-bold text-white">
                {compareCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link
                href="/saved"
                className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-50 sm:flex"
                title="Saved"
              >
                <Bookmark className="h-5 w-5" />
              </Link>
              <div className="hidden items-center gap-2 sm:flex">
                <span className="max-w-[120px] truncate text-sm text-slate-600">
                  {user.name || user.email}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#152a45]"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
