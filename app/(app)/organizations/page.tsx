"use client";
import { useEffect, useState } from "react";
import { PageWrap, Reveal } from "@/components/ui";
import { HeaderSkeleton, SplitSkeleton } from "@/components/skeletons";
import { getOrgsView } from "@/actions/views";

type View = Awaited<ReturnType<typeof getOrgsView>>;

export default function Orgs() {
  const [view, setView] = useState<View | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => { getOrgsView().then(setView); }, []);

  if (!view) {
    return (
      <PageWrap>
        <HeaderSkeleton action={false} />
        <SplitSkeleton />
      </PageWrap>
    );
  }

  const active = view.orgs.find((o) => o.id === view.activeOrgId) ?? view.orgs[0];

  return (
    <PageWrap>
      <p className="mono-meta text-neutral-500">ORGANIZATIONS</p>
      <h1 className="font-display text-4xl font-black md:text-5xl">Organizations</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card-brutal rounded-3xl bg-white p-6">
          <p className="mono-meta">YOUR WORKSPACE</p><p className="text-xl font-black">{active?.name ?? "Workspace"}</p>
          <p className="text-sm text-neutral-500">{view.isDemo ? "Owner · 5 members · 5 engagements" : "Your workspace · scoped sharing per engagement"}</p>
          {view.isDemo && (
            <div className="mt-3 rounded-2xl border border-neutral-200 bg-paper p-3 text-sm"><p className="font-black">Shared engagement</p><p>2026 External Audit ↔ Meridian Audit Partners</p><p className="mono-meta">SCOPES: REQUESTS · EVIDENCE · COMMENTS · ACTIVITY</p></div>
          )}
        </div>
        <div className="card-brutal rounded-3xl bg-ink p-6 text-white">
          <p className="mono-meta text-white/60">INVITE ORGANIZATION (SCOPED)</p>
          <div className="mt-3 space-y-3">
            <input aria-label="Organization name" placeholder="Organization — e.g. Meridian Audit Partners" className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm outline-none placeholder:text-white/40" />
            <input aria-label="Engagement" placeholder="Engagement — 2026 External Audit" className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm outline-none placeholder:text-white/40" />
            <div className="grid grid-cols-2 gap-2 text-[13px] font-bold">
              {["Requests ☑","Evidence ☑","Comments ☑","Activity ☑","Internal Finance ☐","Company Documents ☐"].map((s)=>(<label key={s} className="rounded-xl bg-white/10 px-3 py-2">{s}</label>))}
            </div>
            <button onClick={() => setSent(true)} className="min-h-[44px] w-full rounded-2xl bg-emerald-500 py-2.5 font-black text-ink">{sent ? "Invitation sent ✓" : "Send invitation →"}</button>
            <p className="mono-meta text-white/50">THEY ONLY SEE THIS ENGAGEMENT — NOTHING ELSE.</p>
          </div>
        </div>
      </div>
      {view.isDemo ? (
        <Reveal><div className="card-brutal mt-4 rounded-3xl bg-white p-6"><p className="font-black">Meridian Audit Partners</p><p className="text-sm text-neutral-500">External · 2 members · scopes: requests, evidence, comments, activity</p></div></Reveal>
      ) : view.orgs.map((o, i) => (
        <Reveal key={o.id} delay={i * 0.05}>
          <div className="card-brutal mt-4 rounded-3xl bg-white p-6">
            <p className="font-black">{o.name}</p>
            <p className="text-sm text-neutral-500">{o.id === view.activeOrgId ? "Active workspace" : "Your workspace"} · scopes: requests, evidence, comments, activity</p>
          </div>
        </Reveal>
      ))}
    </PageWrap>
  );
}
