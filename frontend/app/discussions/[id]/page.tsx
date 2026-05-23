"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAnswer, getQuestionById } from "@/services/qaService";
import type { Question } from "@/types/college";
import { Skeleton } from "@/components/ui/Skeleton";

export default function DiscussionDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);

  const load = () => {
    getQuestionById(id)
      .then(setQuestion)
      .catch(() => setQuestion(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id) load();
  }, [id]);

  const handleAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    try {
      await createAnswer(id, body);
      setBody("");
      load();
    } catch {
      alert("Failed to post answer");
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="px-4 py-16 text-center">
        <p>Discussion not found</p>
        <Link href="/discussions" className="text-[#ff6b35]">Back</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/discussions" className="inline-flex items-center gap-2 text-sm text-[#ff6b35]">
        <ArrowLeft className="h-4 w-4" />
        All discussions
      </Link>
      <article className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-slate-900">{question.title}</h1>
        <p className="mt-1 text-sm text-slate-400">by {question.author}</p>
        <p className="mt-4 leading-relaxed text-slate-700">{question.body}</p>
      </article>

      <section className="mt-8">
        <h2 className="font-semibold text-slate-900">
          {question.answers?.length ?? 0} Answers
        </h2>
        <div className="mt-4 space-y-4">
          {(question.answers ?? []).map((a) => (
            <div key={a.id} className="rounded-xl border border-slate-100 bg-white p-5">
              <p className="text-sm font-medium text-slate-800">{a.author}</p>
              <p className="mt-2 text-slate-600">{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={handleAnswer} className="mt-8 rounded-xl border bg-white p-5">
        <label className="text-sm font-medium text-slate-700">Your answer</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={4}
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-[#ff6b35]"
        />
        <button
          type="submit"
          disabled={posting}
          className="mt-3 rounded-lg bg-[#ff6b35] px-5 py-2 text-sm font-semibold text-white"
        >
          {posting ? "Posting..." : "Post answer"}
        </button>
      </form>
    </div>
  );
}
