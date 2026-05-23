"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(name, email, password);
      router.push("/saved");
    } catch {
      setError("Registration failed. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
        <p className="mt-1 text-sm text-slate-500">Join CampusCompass today</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            required
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-[#ff6b35]"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-[#ff6b35]"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 chars)"
            minLength={6}
            required
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-[#ff6b35]"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#1e3a5f] py-2.5 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          Have an account?{" "}
          <Link href="/login" className="font-medium text-[#ff6b35]">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
