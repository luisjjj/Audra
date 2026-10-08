"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DEMO_ENGAGEMENTS, DEMO_REQUESTS, DEMO_DOCS, DEMO_ACTIVITY } from "@/lib/demo";
import { StatusPill, PageWrap, EmptyState } from "@/components/ui";
import { HeaderSkeleton, PillsSkeleton, TimelineSkeleton } from "@/components/skeletons";
import { Bar } from "@/components/charts";
import { getEngagementView } from "@/actions/views";

const TABS = ["Overview", "Requests", "Evidence", "Tasks", "People", "Activity"];

type View = Awaited<ReturnType<typeof getEngagementView>>;

export default function EngagementDetail({ params }: { params: { id: string } }) {
  const [view, setView] = useState<View | null>(null);

  useEffect(() => { getEngagementView(params.id).then(setView); }, [params.id]);

  if (!view) {
    return (
      <PageWrap>
        <HeaderSkeleton action={false} />
        <PillsSkeleton count={6} />
        <TimelineSkeleton count={4} />
      </PageWrap>
    );
  }
  if (view.isDemo) {
    return <DemoDetail eng={view.eng ?? DEMO_ENGAGEMENTS[0]} />;
  }
  const eng = view.eng;
  if (!eng) {
    return (
      <PageWrap>
        <EmptyState
          title="Engagement not found"
          body="It may have been removed, or it belongs to a different workspace."
          action={<Link href="/engagements" className="min-h-[44px] inline-flex items-center rounded-2xl bg-ink px-5 py-2.5 text-sm font-black text-white">Back to engagements</Link>}
        />
      </PageWrap>
    );
  }
  return <RealDetail view={{ ...view, eng }} />;
}

function Tabs({ tab, setTab }: { tab: string; setTab: (t: string) => void }) {
  return (
    <div className="mt-5 flex gap-2 overflow-x-auto border-b border-neutral-200 pb-2">
      {TABS.map((t) => (
        <button key={t} onClick={() => setTab(t)} className={`inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition ${tab === t ? "border-ink bg-ink text-white" : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"}`}>{t}</button>
      ))}
    </div>
  );
}

function DemoDetail({ eng }: { eng: (typeof DEMO_ENGAGEMENTS)[number] }) {
  const [tab, setTab] = useState("Overview");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <PageWrap>
      <p className="mono-meta text-neutral-500">ENGAGEMENT · {eng.id.toUpperCase()}</p>
      <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
        <div><h1 className="font-display text-4xl font-black md:text-5xl">{eng.title}</h1><p className="text-sm text-neutral-500">{eng.org} · {eng.period}</p><p className="mt-1 max-w-xl text-sm text-neutral-600">{eng.desc}</p></div>
        <div className="flex gap-2"><Link href="/people" className="card-brutal-sm inline-flex min-h-[44px] items-center rounded-2xl bg-white px-4 py-2 text-sm font-black">Invite</Link><Link href="/settings" className="card-brutal-sm inline-flex min-h-[44px] items-center rounded-2xl bg-ink px-4 py-2 text-sm font-black text-white">Settings</Link></div>
      </div>

      <Tabs tab={tab} setTab={setTab} />

      {tab === "Overview" && (
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="card-brutal rounded-3xl bg-white p-6 lg:col-span-2">
            <p className="mono-meta text-neutral-500">COMPLETION</p>
            <p className="font-display text-5xl font-black">{eng.progress}%</p>
            <div className="mt-3"><Bar value={eng.progress} /></div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[["Open requests","6"],["Awaiting review","4"],["Overdue","2"],["Participants","8"]].map(([k,v])=>(
                <div key={k} className="rounded-2xl border border-neutral-200 bg-paper p-3"><p className="mono-meta text-neutral-500">{k.toUpperCase()}</p><p className="text-2xl font-black">{v}</p></div>
              ))}
            </div>
          </div>
          <div className="card-brutal rounded-3xl bg-ink p-6 text-white">
            <p className="mono-meta text-white/60">UPCOMING DEADLINES</p>
            <div className="mt-3 space-y-2 text-sm font-bold">
              <p>REQ-026 · Bank rec · <span className="text-red-400">overdue 2d</span></p>
              <p>REQ-024 · Supplier invoices · 22 Sept</p>
              <p>VAT Q3 filing · 21 Oct</p>
            </div>
          </div>

          {/* WOW: Audit Timeline */}
          <div className="card-brutal rounded-3xl bg-white p-6 md:p-8 lg:col-span-3">
            <div className="flex items-center justify-between"><p className="font-display text-2xl font-black">Timeline</p><span className="mono-meta rounded-full bg-black/5 px-2 py-0.5 text-neutral-500">SELECT AN EVENT</span></div>
            <div className="mt-6">
              {[
                { t: "09:12", title: "Sarah uploaded evidence", sub: "Supplier Invoices — Q3 Pack · DOC-91A0", doc: "doc-2" },
                { t: "10:04", title: "Michael reviewed", sub: "Q2 Bank Statement.pdf · viewed + annotated", doc: "doc-1" },
                { t: "10:32", title: "Changes requested", sub: "Missing page 4 · reason recorded", doc: "doc-1" },
                { t: "11:17", title: "Sarah uploaded v2", sub: "Bank Statement — September 2026 · v2 · hash 9f2c…a1", doc: "doc-1" },
                { t: "11:43", title: "Michael approved", sub: "Version 2 · prev → new recorded", doc: "doc-1" },
                { t: "12:01", title: "Engagement progress 74% → 78%", sub: "REQ-025 completed · auto-recalculated", doc: null },
              ].map((e, i) => (
                <motion.button key={e.t} disabled={!e.doc} aria-disabled={!e.doc} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  onClick={() => e.doc && setSelected(e.doc)}
                  className="group flex w-full gap-4 text-left disabled:cursor-default">
                  <span className="mono-meta w-12 shrink-0 pt-1.5">{e.t}</span>
                  <span className="flex flex-col items-center"><span className={`h-2.5 w-2.5 rounded-full ring-1 ring-black/10 ${i===5?"bg-emerald-500":"bg-white group-hover:bg-emerald-300"} transition`} />{i<5 && <span className="w-px flex-1 bg-neutral-200" style={{ minHeight: 30 }} />}</span>
                  <span className="rounded-2xl border border-transparent px-3 pb-4 transition group-hover:border-neutral-200 group-hover:bg-white">
                    <span className="block text-sm font-semibold">● {e.title}</span>
                    <span className="mono-meta text-neutral-500">{e.sub}</span>
                  </span>
                </motion.button>
              ))}
            </div>
            <p className="mono-meta mt-2 text-neutral-500">EVERY EVENT IS RECORDED.</p>
          </div>
        </div>
      )}

      {tab === "Requests" && (
        <div className="mt-6 space-y-3">
          {DEMO_REQUESTS.map((r) => (
            <div key={r.id} className="card-brutal-sm rounded-2xl bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-black">{r.title}</p><StatusPill status={r.status} /></div>
              <p className="mono-meta mt-1 text-neutral-500">{r.code} · FROM {r.from.toUpperCase()} · ASSIGNED {r.assignee.toUpperCase()}</p>
            </div>
          ))}
        </div>
      )}
      {tab === "Evidence" && (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {DEMO_DOCS.map((d) => (
            <Link key={d.id} href={`/documents/${d.id}`} className="card-brutal-sm rounded-2xl bg-white p-4 hover:-translate-y-[1px] transition">
              <p className="font-black">{d.title}</p><p className="mono-meta text-neutral-500">{d.code} · v{d.version} · {d.by.toUpperCase()}</p>
              <div className="mt-2 flex gap-2"><StatusPill status={d.approved ? "approved" : d.reviewed ? "under_review" : "pending"} /></div>
            </Link>
          ))}
        </div>
      )}
      {(tab === "Tasks" || tab === "People" || tab === "Activity") && (
        <div className="mt-6 space-y-2">
          {DEMO_ACTIVITY.map((e) => (
            <div key={e.id} className="card-brutal-sm rounded-2xl bg-white p-3 text-sm"><b>{e.actor}</b> <span className="mono-meta rounded bg-neutral-100 px-1">{e.action}</span> {e.target}<span className="mono-meta ml-2 text-neutral-400">{e.time}</span></div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 md:items-center" onClick={() => setSelected(null)}>
            <motion.div role="dialog" aria-modal="true" aria-label="Event detail" initial={{ y: 60, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ type: "spring", damping: 26 }} onClick={(e) => e.stopPropagation()} className="card-brutal max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6">
              {(() => { const d = DEMO_DOCS.find((x) => x.id === selected)!; const vers = Array.from({ length: d.version }, (_, k) => d.version - k); return (
                <div><p className="mono-meta text-neutral-500">{d.code} · EVENT DETAILS</p>
                <p className="mt-1 text-xl font-black">{d.title}</p>
                <p className="text-sm text-neutral-600">Uploaded by {d.by} · Version {d.version} · {d.size}</p>
                <div className="mt-3 rounded-2xl border border-neutral-200 bg-paper p-3 text-sm"><p className="font-black">Version history</p>{vers.map((v) => (<p key={v} className="mono-meta">v{v} · {d.by} · {v === d.version ? `${d.date} ✓ current` : "earlier version"}</p>))}</div>
                <div className={`mt-3 rounded-2xl border p-3 text-sm ${d.approved ? "border-emerald-600 bg-emerald-50" : d.reviewed ? "border-amber-400 bg-amber-50" : "bg-neutral-100 border-neutral-200"}`}><p className={`font-black ${d.approved ? "text-emerald-800" : d.reviewed ? "text-amber-800" : "text-neutral-600"}`}>{d.approved ? "Approved ✓" : d.reviewed ? "Under review" : "Awaiting review"}</p><p className="text-xs text-neutral-600">{d.code} · {d.category} · full history included</p></div>
                <div className="mt-4 flex gap-2"><Link href={`/documents/${d.id}`} className="min-h-[44px] flex-1 items-center justify-center rounded-2xl bg-ink py-2.5 text-center text-sm font-black text-white inline-flex">Open document →</Link><button onClick={() => setSelected(null)} className="rounded-2xl border border-neutral-200 px-4 text-sm font-bold">Close</button></div></div> ); })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrap>
  );
}

function RealDetail({ view }: { view: Extract<View, { isDemo: false }> & { eng: NonNullable<Extract<View, { isDemo: false }>["eng"]> } }) {
  const [tab, setTab] = useState("Overview");
  const eng = view.eng;
  const open = view.requests.filter((r) => !["approved", "completed"].includes(r.status));
  const review = view.requests.filter((r) => ["submitted", "under_review"].includes(r.status));
  const overdue = view.requests.filter((r) => r.status === "overdue");

  return (
    <PageWrap>
      <p className="mono-meta text-neutral-500">ENGAGEMENT · {eng.code}</p>
      <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
        <div><h1 className="font-display text-4xl font-black md:text-5xl">{eng.title}</h1><p className="text-sm text-neutral-500">{eng.org} · {eng.period}</p>{eng.desc && <p className="mt-1 max-w-xl text-sm text-neutral-600">{eng.desc}</p>}</div>
        <div className="flex gap-2"><Link href="/people" className="card-brutal-sm inline-flex min-h-[44px] items-center rounded-2xl bg-white px-4 py-2 text-sm font-black">Invite</Link><Link href="/settings" className="card-brutal-sm inline-flex min-h-[44px] items-center rounded-2xl bg-ink px-4 py-2 text-sm font-black text-white">Settings</Link></div>
      </div>

      <Tabs tab={tab} setTab={setTab} />

      {tab === "Overview" && (
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="card-brutal rounded-3xl bg-white p-6 lg:col-span-2">
            <p className="mono-meta text-neutral-500">COMPLETION</p>
            <p className="font-display text-5xl font-black">{eng.progress}%</p>
            <div className="mt-3"><Bar value={eng.progress} /></div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[["Open requests",String(open.length)],["Awaiting review",String(review.length)],["Overdue",String(overdue.length)],["Participants",String(view.members.length)]].map(([k,v])=>(
                <div key={k} className="rounded-2xl border border-neutral-200 bg-paper p-3"><p className="mono-meta text-neutral-500">{k.toUpperCase()}</p><p className="text-2xl font-black">{v}</p></div>
              ))}
            </div>
          </div>
          <div className="card-brutal rounded-3xl bg-ink p-6 text-white">
            <p className="mono-meta text-white/60">UPCOMING DEADLINES</p>
            <div className="mt-3 space-y-2 text-sm font-bold">
              {overdue.length === 0 && open.length === 0 && <p className="text-white/60">No open requests yet.</p>}
              {overdue.slice(0, 2).map((r) => (<p key={r.id}>{r.code} · {r.title.slice(0, 24)} · <span className="text-red-400">overdue</span></p>))}
              {open.filter((r) => r.status !== "overdue").slice(0, 2).map((r) => (<p key={r.id}>{r.code} · {r.title.slice(0, 24)} · {r.due}</p>))}
            </div>
          </div>

          <div className="card-brutal rounded-3xl bg-white p-6 md:p-8 lg:col-span-3">
            <p className="font-display text-2xl font-black">Engagement timeline</p>
            {view.trail.length === 0 ? (
              <p className="mt-3 text-sm text-neutral-500">Events in this engagement will appear here as the work happens.</p>
            ) : (
              <div className="mt-6">
                {view.trail.map((e, i) => {
                  const row = (
                    <>
                      <span className="mono-meta w-12 shrink-0 pt-1.5">{e.time.slice(0, 5)}</span>
                      <span className="flex flex-col items-center"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-1 ring-black/10" />{i < view.trail.length - 1 && <span className="w-px flex-1 bg-neutral-200" style={{ minHeight: 30 }} />}</span>
                      <span className="rounded-2xl px-3 pb-4">
                        <span className="block text-sm font-semibold">● {e.actor} {e.action.toLowerCase()}</span>
                        <span className="mono-meta text-neutral-500">{e.target}</span>
                      </span>
                    </>
                  );
                  return e.resourceType === "document" && e.resourceId ? (
                    <Link key={e.id} href={`/documents/${e.resourceId}`} className="group flex w-full gap-4 text-left">
                      <motion.span initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex w-full gap-4">{row}</motion.span>
                    </Link>
                  ) : (
                    <div key={e.id} className="flex w-full gap-4">{row}</div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "Requests" && (
        <div className="mt-6 space-y-3">
          {view.requests.length === 0 && <div className="card-brutal-sm rounded-2xl bg-white p-4 text-sm text-neutral-600">No requests in this engagement yet.</div>}
          {view.requests.map((r) => (
            <div key={r.id} className="card-brutal-sm rounded-2xl bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-black">{r.title}</p><StatusPill status={r.status} /></div>
              <p className="mono-meta mt-1 text-neutral-500">{r.code} · FROM {r.from.toUpperCase()} · ASSIGNED {r.assignee.toUpperCase()}</p>
            </div>
          ))}
        </div>
      )}
      {tab === "Evidence" && (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {view.docs.length === 0 && <div className="card-brutal-sm rounded-2xl bg-white p-4 text-sm text-neutral-600 md:col-span-2">No evidence linked yet.</div>}
          {view.docs.map((d) => (
            <Link key={d.id} href={`/documents/${d.id}`} className="card-brutal-sm rounded-2xl bg-white p-4 hover:-translate-y-[1px] transition">
              <p className="font-black">{d.title}</p><p className="mono-meta text-neutral-500">{d.code} · v{d.version} · {d.by.toUpperCase()}</p>
              <div className="mt-2 flex gap-2"><StatusPill status={d.approved ? "approved" : d.reviewed ? "under_review" : "pending"} /></div>
            </Link>
          ))}
        </div>
      )}
      {tab === "Tasks" && (
        <div className="mt-6"><div className="card-brutal-sm rounded-2xl bg-white p-4 text-sm text-neutral-600">No tasks in this engagement yet.</div></div>
      )}
      {tab === "People" && (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {view.members.map((m: any) => (
            <div key={m.id} className="card-brutal-sm flex items-center gap-3 rounded-2xl bg-white p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-black text-emerald-800">{m.name[0]}</span>
              <div className="min-w-0"><p className="truncate text-sm font-black">{m.name}</p><p className="truncate text-xs text-neutral-500">{m.role} · {m.org}</p></div>
            </div>
          ))}
        </div>
      )}
      {tab === "Activity" && (
        <div className="mt-6 space-y-2">
          {view.trail.length === 0 && <div className="card-brutal-sm rounded-2xl bg-white p-4 text-sm text-neutral-600">No events yet — everything here is recorded.</div>}
          {view.trail.map((e) => (
            <div key={e.id} className="card-brutal-sm rounded-2xl bg-white p-3 text-sm"><b>{e.actor}</b> <span className="mono-meta rounded bg-neutral-100 px-1">{e.action}</span> {e.target}<span className="mono-meta ml-2 text-neutral-400">{e.time}</span></div>
          ))}
        </div>
      )}
    </PageWrap>
  );
}
