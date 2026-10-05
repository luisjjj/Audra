"use client";
import { useState } from "react";
import { PageWrap, Reveal } from "@/components/ui";

export default function Orgs() {
  const [sent, setSent] = useState(false);
  return (
    <PageWrap>
      <p className="mono-meta text-neutral-500">COLLABORATE · CROSS-COMPANY</p>
      <h1 className="font-display text-4xl font-black md:text-5xl">Organizations</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card-brutal rounded-3xl bg-white p-6">
          <p className="mono-meta">YOUR WORKSPACE</p><p className="text-xl font-black">Apex Manufacturing Ltd.</p>
          <p className="text-sm text-neutral-500">Owner · 12 members · 5 engagements</p>
          <div className="mt-3 rounded-2xl bg-paper border-[1.5px] border-black p-3 text-sm"><p className="font-black">Shared engagement</p><p>2026 External Audit ↔ Meridian Audit Partners</p><p className="mono-meta">SCOPES: REQUESTS · EVIDENCE · COMMENTS · ACTIVITY</p></div>
        </div>
        <div className="card-brutal rounded-3xl bg-ink p-6 text-white">
          <p className="mono-meta text-white/60">INVITE ORGANIZATION (SCOPED)</p>
          <div className="mt-3 space-y-3">
            <input placeholder="Organization — e.g. Audit Firm Alpha" className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm outline-none" />
            <input placeholder="Engagement — 2026 External Audit" className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm" />
            <div className="grid grid-cols-2 gap-2 text-sm font-bold">
              {["Requests ☑","Evidence ☑","Comments ☑","Activity ☑","Internal Finance ☐","Company Documents ☐"].map((s)=>(<label key={s} className="rounded-xl bg-white/10 px-3 py-2">{s}</label>))}
            </div>
            <button onClick={() => setSent(true)} className="w-full rounded-2xl bg-emerald-500 py-2.5 font-black text-ink">{sent ? "Invitation sent ✓ · trail logged" : "Send invitation →"}</button>
            <p className="mono-meta text-white/50">EXTERNAL ORG GETS ENGAGEMENT ACCESS ONLY.</p>
          </div>
        </div>
      </div>
      <Reveal><div className="card-brutal mt-4 rounded-3xl bg-white p-6"><p className="font-black">Meridian Audit Partners</p><p className="text-sm text-neutral-500">External · 3 members · scopes: requests, evidence, comments, activity</p></div></Reveal>
    </PageWrap>
  );
}
