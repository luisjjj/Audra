"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ShieldCheck, FileCheck, Users } from "lucide-react";

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: d, ease: "easeOut" as const },
});

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Quiet top bar */}
      <header className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight">
          Audra
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-500 md:flex">
          <Link href="/overview" className="transition hover:text-black">Workspace</Link>
          <Link href="/engagements/eng-2026" className="transition hover:text-black">Timeline</Link>
          <Link href="/activity" className="transition hover:text-black">Audit trail</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-black/5 hover:text-black">
            Log in
          </Link>
          <Link href="/overview" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-charcoal">
            Open workspace
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-6 pb-20">
        {/* Hero */}
        <motion.div {...fade(0)} className="mx-auto max-w-[760px] pt-10 text-center md:pt-16">
          <p className="sticker">Audit · Evidence · Traceability</p>
          <h1 className="font-display mt-5 text-5xl font-extrabold md:text-7xl">
            Your audit has a memory.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-neutral-600 md:text-lg">
            Audra is the collaboration, evidence and audit-trail layer around financial
            work. Everything that happened, stays accounted for.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/overview" className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
              Open workspace <ArrowRight size={16} />
            </Link>
            <Link href="/engagements/eng-2026" className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold transition hover:border-neutral-400 hover:bg-neutral-50">
              See the audit timeline
            </Link>
          </div>
          <p className="mono-meta mt-6 text-neutral-400">
            Request → Submit → Review → Approve → Record → Audit Trail
          </p>
        </motion.div>

        {/* Product snapshot — clean engagement card */}
        <motion.div {...fade(0.1)} className="mx-auto mt-12 max-w-[600px]">
          <div className="card-brutal rounded-2xl bg-white p-6 md:p-7">
            <div className="flex items-center justify-between">
              <p className="mono-meta uppercase text-neutral-400">2026 External Audit · Apex</p>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Live
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="font-display text-5xl font-extrabold">78%</p>
                <p className="mt-1 text-sm text-neutral-500">Engagement complete · 23 of 29 requests</p>
              </div>
              <p className="mono-meta text-right text-neutral-400">DOC-8F29 v2<br />Approved</p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-100">
              <motion.div initial={{ width: 0 }} animate={{ width: "78%" }} transition={{ duration: 1, delay: 0.4, ease: "easeOut" }} className="h-full rounded-full bg-emerald-600" />
            </div>
            <div className="mt-5 space-y-2 border-t border-neutral-100 pt-4 text-sm">
              <div className="flex justify-between"><span><span className="font-semibold">Michael Adeyemi</span> approved version 2</span><span className="mono-meta text-neutral-400">11:43</span></div>
              <div className="flex justify-between text-neutral-500"><span><span className="font-semibold">Sarah Okafor</span> uploaded version 2 · page 4 added</span><span className="mono-meta text-neutral-400">11:17</span></div>
              <div className="flex justify-between text-neutral-500"><span>Changes requested · missing page 4</span><span className="mono-meta text-neutral-400">10:32</span></div>
            </div>
          </div>
        </motion.div>

        {/* How it works */}
        <div className="mt-20">
          <motion.div {...fade(0)}>
            <p className="mono-meta uppercase text-neutral-400">How it works</p>
            <h2 className="font-display mt-2 max-w-[640px] text-3xl font-extrabold md:text-4xl">
              Request, submit, approve — with a trail under every step.
            </h2>
          </motion.div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { n: "01", icon: FileCheck, t: "Request", d: "Ask Finance for exactly what you need — owner, due date, required documents. Every request is logged." },
              { n: "02", icon: Users, t: "Submit and review", d: "Evidence lands versioned. Reviewers comment and request changes. Nothing is silently overwritten." },
              { n: "03", icon: ShieldCheck, t: "Approve and record", d: "Approvals close the loop. Who did what, when, what changed — hash-chained into the trail." },
            ].map((c, i) => (
              <motion.div key={c.n} {...fade(0.08 + i * 0.07)} className="card-brutal rounded-2xl bg-white p-6">
                <div className="flex items-center justify-between">
                  <c.icon size={20} className="text-emerald-700" strokeWidth={1.75} />
                  <span className="mono-meta text-neutral-300">{c.n}</span>
                </div>
                <p className="mt-8 text-lg font-bold">{c.t}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{c.d}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Assurances */}
        <div className="mt-16">
          <motion.div {...fade(0)}>
            <p className="mono-meta uppercase text-neutral-400">Why teams trust it</p>
            <h2 className="font-display mt-2 max-w-[640px] text-3xl font-extrabold md:text-4xl">
              Audit clarity, without the noise.
            </h2>
          </motion.div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { t: "Versioned evidence", d: "Bank statements, invoices, payroll — every version kept, reviewed and approved. Previous versions are never lost." },
              { t: "Scoped sharing", d: "Invite an external firm to one engagement, not your whole workspace. Internal finance stays private. Enforced server-side." },
              { t: "Tamper-evident trail", d: "Append-only events with hash chaining. Permission changes and document access are recorded." },
            ].map((c, i) => (
              <motion.div key={c.t} {...fade(0.08 + i * 0.07)} className="rounded-2xl border border-neutral-200 bg-white/60 p-6">
                <p className="text-[15px] font-bold">{c.t}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{c.d}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline teaser */}
        <div className="card-brutal mt-16 rounded-2xl bg-ink p-6 text-white md:p-10">
          <div className="flex items-center justify-between">
            <p className="mono-meta uppercase text-white/50">Engagement timeline</p>
            <Link href="/engagements/eng-2026" className="inline-flex items-center gap-1 text-[13px] font-semibold text-emerald-300 transition hover:text-emerald-200">
              Open live timeline <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="mt-6">
            {[
              ["09:12", "Sarah Okafor uploaded evidence"],
              ["10:04", "Michael Adeyemi reviewed"],
              ["10:32", "Changes requested — missing page 4"],
              ["11:17", "Sarah Okafor uploaded version 2"],
              ["11:43", "Michael Adeyemi approved version 2"],
              ["12:01", "Engagement progress 78% → 82%"],
            ].map(([t, e], i) => (
              <motion.div key={t} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.3 }} className="flex gap-4">
                <span className="mono-meta w-12 shrink-0 pt-1 text-white/45">{t}</span>
                <div className="flex flex-col items-center">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${i === 5 ? "bg-emerald-400" : "bg-white/70"}`} />
                  {i < 5 && <span className="w-px flex-1 bg-white/15" style={{ minHeight: 18 }} />}
                </div>
                <p className="pb-4 text-sm font-medium text-white/90">{e}</p>
              </motion.div>
            ))}
          </div>
          <p className="mono-meta text-white/40">Each event opens the exact document, version and approval.</p>
        </div>

        <footer className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-6">
          <span className="font-display text-base font-extrabold">Audra</span>
          <span className="mono-meta text-neutral-400">Every action. Accounted for. · © 2026</span>
        </footer>
      </main>
    </div>
  );
}
