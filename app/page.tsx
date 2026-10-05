"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ShieldCheck, FileCheck, Users } from "lucide-react";

const rise = (d = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay: d, ease: "easeOut" as const },
});

export default function Landing() {
  const howRef = useRef<HTMLDivElement>(null);
  const clarityRef = useRef<HTMLDivElement>(null);
  const scrollBy = (el: HTMLDivElement | null, dir: number) =>
    el?.scrollBy({ left: dir * 340, behavior: "smooth" });

  return (
    <div className="min-h-screen">
      {/* Floating pill nav */}
      <div className="sticky top-3 z-50 mx-auto max-w-[860px] px-4">
        <div className="pill-nav flex items-center justify-between gap-2 rounded-full py-2 pl-5 pr-2">
          <Link href="/" className="font-display text-xl font-black tracking-tight">
            AUDRA
          </Link>
          <div className="hidden items-center gap-5 text-[13px] font-semibold text-neutral-500 md:flex">
            <Link href="/overview" className="transition hover:text-black">Workspace</Link>
            <Link href="/engagements/eng-2026" className="transition hover:text-black">Timeline</Link>
            <Link href="/activity" className="transition hover:text-black">Audit trail</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden rounded-full px-4 py-2 text-[13px] font-semibold transition hover:bg-black/5 sm:block">
              Log in
            </Link>
            <Link
              href="/overview"
              className="rounded-full bg-ink px-4 py-2 text-[13px] font-bold text-white transition hover:-translate-y-[1px]"
              style={{ boxShadow: "0 0 0 2px #C8F04A, 0 8px 20px rgba(11,122,75,.35)" }}
            >
              Open workspace
            </Link>
          </div>
        </div>
        <p className="mt-2 text-center text-[13px] font-extrabold tracking-tight">
          Every action. Accounted for.
        </p>
      </div>

      <main className="mx-auto max-w-[1200px] overflow-x-clip px-4 pb-20 md:px-6">
        {/* Massive condensed hero */}
        <motion.div {...rise(0)} className="pt-8 text-center md:pt-12">
          <p className="mono-meta inline-block rounded-full bg-white px-3 py-1 shadow-sm">AUDIT · EVIDENCE · TRACEABILITY</p>
          <h1 className="font-ugly mx-auto mt-5 max-w-[1000px] text-[17vw] md:text-[132px]">
            YOUR AUDIT
            <br />
            HAS A MEMORY
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] font-medium text-neutral-600 md:text-lg">
            The collaboration, evidence and audit-trail layer around financial work.
            Everything that happened, stays accounted for.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/overview" className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-bold text-white shadow-[0_16px_32px_-16px_rgba(11,122,75,0.7)] transition hover:-translate-y-[2px]">
              Open workspace <ArrowRight size={18} />
            </Link>
            <Link href="/engagements/eng-2026" className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold shadow-[0_16px_32px_-20px_rgba(11,11,11,0.4)] transition hover:-translate-y-[2px]">
              See audit timeline
            </Link>
          </div>
          <p className="mono-meta mt-4 text-neutral-500">
            Request → Submit → Review → Approve → Record → Audit Trail
          </p>
        </motion.div>

        {/* Product mock with stickers */}
        <motion.div {...rise(0.1)} className="relative mx-auto mt-10 max-w-[560px]">
          <span className="sticker absolute -left-2 -top-4 z-10 -rotate-12 bg-lime text-ink">HASH-CHAINED ✓</span>
          <span className="sticker absolute -right-2 top-16 z-10 rotate-6 bg-white text-ink">78% COMPLETE</span>
          <div className="card-brutal floaty rounded-[28px] bg-ink p-4 text-white md:p-5">
            <div className="rounded-2xl bg-white p-4 text-ink md:p-5">
              <div className="flex items-center justify-between">
                <p className="mono-meta text-neutral-500">2026 EXTERNAL AUDIT · APEX</p>
                <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white">LIVE</span>
              </div>
              <p className="font-ugly mt-2 text-5xl md:text-6xl">
                $2,400<span className="text-xl text-neutral-400">.29 REQ</span>
              </p>
              <p className="mono-meta mt-1 text-neutral-500">23 / 29 REQUESTS COMPLETE · DOC-8F29 v2 APPROVED</p>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-neutral-100">
                <motion.div initial={{ width: 0 }} animate={{ width: "78%" }} transition={{ duration: 1.1, delay: 0.4 }} className="h-full rounded-full bg-emerald-600" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <span className="rounded-xl bg-neutral-100 py-2.5 text-center text-sm font-semibold">Evidence</span>
                <span className="rounded-xl bg-ink py-2.5 text-center text-sm font-bold text-white">Approve ✓</span>
              </div>
              <div className="mt-3 space-y-1.5 border-t border-dashed border-neutral-200 pt-3 text-left">
                <p className="text-[13px]"><b>● 11:43</b> Michael approved <b>v2</b></p>
                <p className="text-[13px] text-neutral-500"><b>● 11:17</b> Sarah uploaded v2 · page 4 fixed</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How work works — snap carousel */}
        <div className="mt-16 md:mt-20">
          <motion.h2 {...rise(0)} className="font-ugly max-w-[700px] text-4xl md:text-6xl">
            How audit work
            <br />
            works on AUDRA
          </motion.h2>
          <div ref={howRef} className="snap-row no-scrollbar -mx-4 mt-6 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
            <HowCard sticker="STEP 01" stickerClass="bg-ink text-white -rotate-6" title="Request" body="Ask Finance for exactly what you need. Owner, due date, required docs — logged to the trail." footer="Scoped requests" caption="Assigned, due, traceable" dark={false} />
            <HowCard sticker="STEP 02" stickerClass="bg-lime text-ink rotate-3" title="Submit & review" body="Evidence lands versioned. Reviewers comment, request changes — never a silent overwrite." footer="v1 → v2 → approved" caption="Versions, comments, reviews" dark={false} solid />
            <HowCard sticker="STEP 03" stickerClass="bg-white text-ink -rotate-3" title="Approve & trail" body="Approvals draw the trail shut. Who did what, when, what changed — hash-chained." footer="Nothing lost" caption="Approvals + append-only log" dark />
          </div>
          <CarouselDots onPrev={() => scrollBy(howRef.current, -1)} onNext={() => scrollBy(howRef.current, 1)} />
        </div>

        {/* Audit clarity */}
        <div className="mt-14 md:mt-16">
          <motion.h2 {...rise(0)} className="font-ugly max-w-[700px] text-4xl md:text-6xl">
            Audit clarity
          </motion.h2>
          <div ref={clarityRef} className="snap-row no-scrollbar -mx-4 mt-6 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
            <div className="w-[300px] shrink-0 md:w-[340px]">
              <div className="card-brutal rounded-[24px] bg-white p-6 transition hover:-translate-y-1">
                <FileCheck size={40} strokeWidth={1.25} />
                <p className="mt-16 text-xl font-extrabold leading-tight">Versioned evidence, review states</p>
                <p className="mt-2 text-[13px] text-neutral-500">Bank statements, invoices, payroll — every version kept, reviewed, approved.</p>
              </div>
              <p className="mt-3 text-[15px] font-extrabold">Where is my evidence?</p>
            </div>
            <div className="w-[300px] shrink-0 md:w-[340px]">
              <div className="card-brutal rounded-[24px] bg-emerald-600 p-6 text-white transition hover:-translate-y-1">
                <Users size={40} strokeWidth={1.25} />
                <p className="mt-16 text-xl font-extrabold leading-tight">Share one engagement, not the workspace</p>
                <p className="mt-2 text-[13px] text-white/80">Meridian sees 2026 External Audit only. Internal finance stays private.</p>
              </div>
              <p className="mt-3 text-[15px] font-extrabold">Who can see what?</p>
            </div>
            <div className="w-[300px] shrink-0 md:w-[340px]">
              <div className="card-brutal rounded-[24px] bg-white p-6 transition hover:-translate-y-1">
                <ShieldCheck size={40} strokeWidth={1.25} />
                <p className="mt-16 text-xl font-extrabold leading-tight">Is it safe? Let&apos;s talk trail.</p>
                <p className="mt-2 text-[13px] text-neutral-500">Append-only events with hash chaining. Permission changes logged.</p>
              </div>
              <p className="mt-3 text-[15px] font-extrabold">Can we prove it?</p>
            </div>
          </div>
          <CarouselDots onPrev={() => scrollBy(clarityRef.current, -1)} onNext={() => scrollBy(clarityRef.current, 1)} />
        </div>

        {/* Timeline teaser */}
        <div className="card-brutal mt-10 rounded-[28px] bg-ink p-6 text-white md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="mono-meta text-white/60">WOW MOMENT — ENGAGEMENT TIMELINE</p>
            <Link href="/engagements/eng-2026" className="inline-flex items-center gap-1 text-[13px] font-bold text-emerald-300">
              Open live <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="mt-5">
            {[
              ["09:12", "Sarah uploaded evidence"],
              ["10:04", "Michael reviewed"],
              ["10:32", "Changes requested"],
              ["11:17", "Sarah uploaded v2"],
              ["11:43", "Michael approved"],
              ["12:01", "Progress 74% → 78%"],
            ].map(([t, e], i) => (
              <motion.div key={t} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex gap-4">
                <span className="mono-meta w-12 shrink-0 pt-1 text-white/60">{t}</span>
                <div className="flex flex-col items-center">
                  <span className={`h-3 w-3 rounded-full ${i === 5 ? "pulse-dot bg-emerald-400" : "bg-white"}`} />
                  {i < 5 && <span className="w-[2px] flex-1 bg-white/20" style={{ minHeight: 20 }} />}
                </div>
                <p className="pb-4 text-sm font-bold">{e}</p>
              </motion.div>
            ))}
          </div>
          <p className="mono-meta text-white/50">CLICK ANY EVENT → OPENS THE EXACT OBJECT.</p>
        </div>

        <p className="mx-auto mt-10 max-w-[700px] text-center text-[15px] font-bold">
          Used by finance teams, internal auditors and external firms to request, submit and prove audit work.
        </p>
        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-6">
          <span className="font-display text-lg font-black">AUDRA</span>
          <span className="mono-meta text-neutral-500">EVERY ACTION. ACCOUNTED FOR. · © 2026</span>
        </footer>
      </main>
    </div>
  );
}

function HowCard({ sticker, stickerClass, title, body, footer, caption, dark, solid }: any) {
  return (
    <div className="w-[300px] shrink-0 md:w-[340px]">
      <div className={`card-brutal relative overflow-hidden rounded-[24px] p-6 transition hover:-translate-y-1 ${dark ? "bg-ink text-white" : solid ? "bg-emerald-500 text-white" : "bg-white"}`}>
        <span className={`sticker absolute right-4 top-4 ${stickerClass}`}>{sticker}</span>
        <div className={`mt-8 rounded-2xl p-4 ${dark ? "bg-white/10" : solid ? "bg-black/10" : "bg-black/[0.04]"}`}>
          <p className="font-ugly text-3xl">{title}</p>
          <p className={`mt-1 text-[13px] font-medium ${dark || solid ? "text-white/85" : "text-neutral-500"}`}>{body}</p>
          <p className={`mono-meta mt-3 ${dark || solid ? "text-white/70" : "text-neutral-500"}`}>{footer}</p>
        </div>
      </div>
      <p className="mt-3 text-[15px] font-extrabold">{title} <span className="font-medium text-neutral-500">· {caption}</span></p>
    </div>
  );
}

function CarouselDots({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <button onClick={onPrev} aria-label="Scroll left" className="h-11 min-w-[44px] rounded-full bg-neutral-200/70 px-3 text-sm font-bold transition hover:bg-neutral-300">←</button>
      <button onClick={onNext} aria-label="Scroll right" className="h-11 min-w-[44px] rounded-full bg-neutral-200/70 px-3 text-sm font-bold transition hover:bg-neutral-300">→</button>
      <span className="mono-meta ml-1 text-neutral-400">SCROLL →</span>
    </div>
  );
}
