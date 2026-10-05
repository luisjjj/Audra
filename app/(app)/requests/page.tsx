"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageWrap, Reveal, StatusPill } from "@/components/ui";
import { DEMO_REQUESTS } from "@/lib/demo";

const FILTERS = ["All", "Pending", "Submitted", "Review", "Complete"];

export default function Requests() {
  const [f, setF] = useState("All");
  const [showNew, setShowNew] = useState(false);
  const list = DEMO_REQUESTS.filter((r) => {
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
        <button onClick={() => setShowNew(true)} className="card-brutal-sm rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-black text-white">+ New request</button>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto">
        {FILTERS.map((x) => (
          <button key={x} onClick={() => setF(x)} className={`whitespace-nowrap rounded-full border-[1.5px] px-4 py-1.5 text-sm font-black ${f === x ? "border-black bg-ink text-white" : "border-black/20 bg-white"}`}>{x}</button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {list.map((r, i) => (
            <motion.div key={r.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ delay: i * 0.04 }}>
              <div className="card-brutal-sm group rounded-2xl bg-white p-4 hover:-translate-y-[1px] transition">
                <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-black">{r.title}</p><StatusPill status={r.status} /></div>
                <p className="mono-meta mt-1 text-neutral-500">{r.code} · FROM {r.from.toUpperCase()} · {r.engagement.toUpperCase()}</p>
                <p className="mt-1 text-sm text-neutral-600">{r.desc}</p>
                <div className="mt-2 flex items-center justify-between text-sm"><span>Assigned to <b>{r.assignee}</b> · <span className={r.status === "overdue" ? "font-black text-red-600" : ""}>{r.due}</span> · <span className="mono-meta">{r.priority.toUpperCase()}</span></span><span className="font-black">→</span></div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 md:items-center" onClick={() => setShowNew(false)}>
            <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }} transition={{ type: "spring", damping: 26 }} onClick={(e) => e.stopPropagation()} className="card-brutal w-full max-w-lg rounded-3xl bg-white p-6">
              <p className="text-xl font-black">New request</p>
              <div className="mt-4 space-y-3">
                <input placeholder="Title — e.g. Bank statements Jan–Sep" className="w-full rounded-xl border-[1.5px] border-black px-3 py-2.5 text-sm" />
                <textarea placeholder="Description" className="w-full rounded-xl border-[1.5px] border-black px-3 py-2.5 text-sm" rows={3} />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Category" className="rounded-xl border-[1.5px] border-black px-3 py-2.5 text-sm" />
                  <input type="date" className="rounded-xl border-[1.5px] border-black px-3 py-2.5 text-sm" />
                  <input placeholder="Assigned to" className="rounded-xl border-[1.5px] border-black px-3 py-2.5 text-sm" />
                  <input placeholder="Priority" className="rounded-xl border-[1.5px] border-black px-3 py-2.5 text-sm" />
                </div>
                <input placeholder="Required documents" className="w-full rounded-xl border-[1.5px] border-black px-3 py-2.5 text-sm" />
                <button onClick={() => setShowNew(false)} className="w-full rounded-2xl bg-emerald-600 py-3 font-black text-white">Create request → trail logged</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrap>
  );
}
