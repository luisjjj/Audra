"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageWrap } from "@/components/ui";
import { PillsSkeleton, Skeleton, TimelineSkeleton } from "@/components/skeletons";
import { getActivityView } from "@/actions/views";

type View = Awaited<ReturnType<typeof getActivityView>>;
const FILTERS = ["All", "Uploads", "Approvals", "Requests"];

export default function Activity() {
  const [view, setView] = useState<View | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => { getActivityView().then(setView); }, []);

  if (!view) {
    return (
      <PageWrap>
        <Skeleton className="h-3 w-56" />
        <Skeleton className="mt-3 h-12 w-72 max-w-full" />
        <Skeleton className="mt-2 h-4 w-96 max-w-full" />
        <PillsSkeleton count={4} />
        <TimelineSkeleton count={5} />
      </PageWrap>
    );
  }

  const list = view.items.filter((e) => {
    if (filter === "All") return true;
    if (filter === "Uploads") return e.action.includes("UPLOAD") || e.action.includes("VERSION");
    if (filter === "Approvals") return e.action.includes("APPROV");
    return e.action.includes("REQUEST") || e.action === "COMPLETED";
  });

  return (
    <PageWrap>
      <p className="mono-meta text-neutral-500">ACTIVITY</p>
      <h1 className="font-display text-4xl font-black md:text-6xl">Activity</h1>
      <p className="text-sm text-neutral-500">A complete record of everything happening across your workspace. Nothing can be edited or deleted.</p>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">{FILTERS.map((x) => (<button key={x} aria-pressed={filter === x} onClick={() => setFilter(x)} className={`inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold ${filter === x ? "bg-ink text-white border-ink" : "bg-white border-neutral-200 text-neutral-600"}`}>{x}</button>))}</div>
      {list.length === 0 ? (
        <div className="card-brutal mt-6 rounded-3xl bg-white p-10 text-center">
          <p className="text-xl font-black">{view.isDemo ? "Nothing under this filter." : "Your history starts here."}</p>
          <p className="mt-1 text-sm text-neutral-500">{view.isDemo ? "Try a different filter." : "Every action in this workspace is recorded and kept."}</p>
        </div>
      ) : (
        <div className="mt-6">
          <p className="mono-meta text-neutral-500">TODAY</p>
          <div className="mt-2 space-y-0">
            {list.map((e, i) => (
              <motion.div key={e.id} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex gap-4">
                <div className="flex flex-col items-center"><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/10 ${i === 0 ? "bg-emerald-500" : "bg-white"}`} />{i < list.length - 1 && <span className="w-px flex-1 bg-neutral-200" style={{ minHeight: 28 }} />}</div>
                <div className="card-brutal-sm mb-3 min-w-0 flex-1 rounded-2xl bg-white p-4 hover:-translate-y-[1px] transition">
                  <p className="mono-meta text-neutral-400">{e.time} · {e.ago.toUpperCase()}</p>
                  <p className="mt-1 text-sm"><b>{e.actor}</b> <span className="text-neutral-500">· {e.org}</span></p>
                  <p className="mono-meta mt-0.5 inline-block rounded bg-ink px-2 py-0.5 font-bold text-white">{e.action}</p>
                  <p className="mt-1 text-sm font-bold">{e.target}</p>
                  <p className="mono-meta mt-1 text-neutral-500">{e.meta} · {e.engagement.toUpperCase()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </PageWrap>
  );
}
