"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { PageWrap, Reveal, StatusPill, EmptyState } from "@/components/ui";
import { HeaderSkeleton, PillsSkeleton, RowsSkeleton } from "@/components/skeletons";
import { getRequestsView } from "@/actions/views";
import { createRequest } from "@/actions/audra";

const FILTERS = ["All", "Pending", "Submitted", "Review", "Complete"];

const PARAM_TO_FILTER: Record<string, string> = {
  overdue: "Pending",
  pending: "Pending",
  submitted: "Submitted",
  review: "Review",
  under_review: "Review",
  complete: "Complete",
  approved: "Complete",
  completed: "Complete",
  all: "All",
};

type View = Awaited<ReturnType<typeof getRequestsView>>;

function RequestsInner() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = PARAM_TO_FILTER[params.get("status") ?? ""] ?? "All";
  const [view, setView] = useState<View | null>(null);
  const [f, setF] = useState(initial);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "", dueDate: "", priority: "medium", engagementId: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { getRequestsView().then(setView); }, []);
  useEffect(() => {
    if (!showNew) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowNew(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showNew]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.title.trim().length < 3) { setError("Give the request a title."); return; }
    if (!view?.isDemo && !form.engagementId) { setError("Choose the engagement this request belongs to."); return; }
    setBusy(true);
    try {
      await createRequest({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        category: form.category.trim() || undefined,
        dueDate: form.dueDate || undefined,
        priority: form.priority as "low" | "medium" | "high" | "urgent",
        engagementId: view?.isDemo ? undefined : form.engagementId,
      }, "accountant");
      setShowNew(false);
      setForm({ title: "", description: "", category: "", dueDate: "", priority: "medium", engagementId: "" });
      const v = await getRequestsView();
      setView(v);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Could not create the request.");
    } finally {
      setBusy(false);
    }
  }

  if (!view) {
    return (
      <PageWrap>
        <HeaderSkeleton />
        <PillsSkeleton />
        <RowsSkeleton count={4} />
      </PageWrap>
    );
  }

  const list = view.items.filter((r) => {
    if (f === "All") return true;
    if (f === "Pending") return ["pending", "overdue"].includes(r.status);
    if (f === "Submitted") return r.status === "submitted";
    if (f === "Review") return ["under_review", "changes_requested"].includes(r.status);
    return ["approved", "completed"].includes(r.status);
  });

  return (
    <PageWrap>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="mono-meta text-neutral-500">WORK · REQUESTS</p><h1 className="font-display text-4xl font-black md:text-5xl">Requests</h1></div>
        <button onClick={() => setShowNew(true)} className="card-brutal-sm inline-flex min-h-[44px] items-center rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-black text-white">+ New request</button>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter requests">
        {FILTERS.map((x) => (
          <button key={x} role="tab" aria-selected={f === x} onClick={() => setF(x)} className={`inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold ${f === x ? "border-ink bg-ink text-white" : "border-neutral-200 bg-white text-neutral-600"}`}>{x}</button>
        ))}
      </div>
      {list.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title={view.items.length === 0 ? "No requests yet" : "Nothing under this filter"}
            body={view.items.length === 0 ? "Request your first piece of evidence from the team." : "Try a different filter."}
            action={view.items.length === 0 ? <button onClick={() => setShowNew(true)} className="min-h-[44px] rounded-2xl bg-ink px-5 py-2.5 text-sm font-black text-white">New request</button> : undefined}
          />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {list.map((r, i) => (
              <motion.div key={r.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ delay: i * 0.04 }}>
                <div className="card-brutal-sm rounded-2xl bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-black">{r.title}</p><StatusPill status={r.status} /></div>
                  <p className="mono-meta mt-1 text-neutral-500">{r.code} · FROM {r.from.toUpperCase()} · {r.engagement.toUpperCase()}</p>
                  <p className="mt-1 text-sm text-neutral-600">{r.desc}</p>
                  <div className="mt-2 text-sm"><span>Assigned to <b>{r.assignee}</b> · <span className={r.status === "overdue" ? "font-black text-red-600" : ""}>{r.due}</span> · <span className="mono-meta">{r.priority.toUpperCase()}</span></span></div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 md:items-center" onClick={() => setShowNew(false)}>
            <motion.div role="dialog" aria-modal="true" aria-label="New request" initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }} transition={{ type: "spring", damping: 26 }} onClick={(e) => e.stopPropagation()} className="card-brutal w-full max-w-lg rounded-3xl bg-white p-6">
              <p className="text-xl font-black">New request</p>
              <form onSubmit={onCreate} className="mt-4 space-y-3">
                {!view.isDemo && (
                  <div>
                    <label htmlFor="req-eng" className="text-xs font-black uppercase">Engagement</label>
                    {view.engagements.length === 0 ? (
                      <p className="mt-1 text-sm text-neutral-500">Create an engagement first, then request evidence against it.</p>
                    ) : (
                      <select id="req-eng" value={form.engagementId} onChange={(e) => setForm({ ...form, engagementId: e.target.value })} className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm">
                        <option value="">Choose engagement…</option>
                        {view.engagements.map((e) => (<option key={e.id} value={e.id}>{e.title}</option>))}
                      </select>
                    )}
                  </div>
                )}
                <div><label htmlFor="req-title" className="text-xs font-black uppercase">Title</label><input id="req-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title — e.g. Bank statements Jan–Sep" className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm" /></div>
                <div><label htmlFor="req-desc" className="text-xs font-black uppercase">Description</label><textarea id="req-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm" /></div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div><label htmlFor="req-cat" className="text-xs font-black uppercase">Category</label><input id="req-cat" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm" /></div>
                  <div><label htmlFor="req-due" className="text-xs font-black uppercase">Due date</label><input id="req-due" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm" /></div>
                  <div><label htmlFor="req-priority" className="text-xs font-black uppercase">Priority</label>
                    <select id="req-priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm">
                      <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}
                <button type="submit" disabled={busy} className="min-h-[44px] w-full rounded-2xl bg-emerald-600 py-3 font-black text-white disabled:opacity-60">{busy ? "Creating…" : "Create request → trail logged"}</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrap>
  );
}

export default function Requests() {
  return (
    <Suspense>
      <RequestsInner />
    </Suspense>
  );
}
