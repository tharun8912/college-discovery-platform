"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Plus } from "lucide-react";
import { createQuestion, getQuestions } from "@/services/qaService";
import type { Question } from "@/types/college";
import { useAuth } from "@/lib/auth-context";
import { Skeleton } from "@/components/ui/Skeleton";

export default function DiscussionsPage() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);

  const load = () => {
    getQuestions()
      .then(setQuestions)
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    try {
      await createQuestion({ title, body });
      setTitle("");
      setBody("");
      setShowForm(false);
      load();
    } catch {
      alert("Failed to post question");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Q&A Forum</h1>
          <p className="mt-1 text-slate-500">Ask seniors and get admission advice</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#ff6b35] px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Ask question
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Question title"
            required
            className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-[#ff6b35]"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Describe your question..."
            required
            rows={4}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-[#ff6b35]"
          />
          <button
            type="submit"
            disabled={posting}
            className="mt-3 rounded-lg bg-[#1e3a5f] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {posting ? "Posting..." : "Post question"}
          </button>
          {!user && (
            <p className="mt-2 text-xs text-slate-500">
              Posting as guest. <Link href="/login" className="text-[#ff6b35]">Login</Link> to link your account.
            </p>
          )}
        </form>
      )}

      <div className="mt-8 space-y-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          : questions.map((q) => (
              <Link
                key={q.id}
                href={`/discussions/${q.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-5 transition hover:border-[#ff6b35] hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-[#ff6b35]" />
                  <div>
                    <h2 className="font-semibold text-slate-900">{q.title}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{q.body}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      {q.author} · {q._count?.answers ?? q.answers?.length ?? 0} answers
                    </p>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
