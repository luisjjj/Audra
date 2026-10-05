"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { PageWrap } from "@/components/ui";
import { DEMO_ACTIVITY } from "@/lib/demo";

export default function Activity() {
  const [filter, setFilter] = useState("All");
  const list = DEMO_ACTIVITY.filter((e) => {
    if (filter === "All") return true;
    if (filter === "Uploads") return e.action.includes("UPLOAD") || e.action.includes("VERSION");
    if (filter === "Approvals") return e.action === "APPROVED";
    return e.action.includes("REQUEST") || e.action === "COMPLETED";
  });
  return (
    <PageWrap>
      <p className="mono-meta text-neutral-500">SYSTEM · APPEND-ONLY · HASH-CHAINED</p>
      <h1 className="font-display text-4xl font-black md:text-6xl">AUDIT TRAIL.</h1>
      <p className="text-sm text-neutral-500">Internal integrity mechanism — tamper-evident, not legal immutability. Normal users cannot edit or delete events.</p>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">{["All", "Uploads", "Approvals", "Requests"].map((x) => (<button key={x} aria-pressed={filter === x} onClick={() => setFilter(x)} className={`min-h-[44px] whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold ${filter === x ? "bg-ink text-white border-ink" : "bg-white border-neutral-200 text-neutral-600"}`}>{x}</button>))}</div>
      <div className="mt-6">
        <p className="mono-meta text-neutral-500">TODAY</p>
        <div className="mt-2 space-y-0">
          {list.map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex gap-4">
              <div className="flex flex-col items-center"><span className={`mt-1 h-2.5 w-2.5 rounded-full ring-1 ring-black/10 ${i === 0 ? "bg-emerald-500" : "bg-white"}`} />{i < list.length - 1 && <span className="w-px flex-1 bg-neutral-200" style={{ minHeight: 28 }} />}</div>
              <div className="card-brutal-sm mb-3 flex-1 rounded-2xl bg-white p-4 hover:-translate-y-[1px] transition">
                <p className="mono-meta text-neutral-400">{e.time} · {e.ago.toUpperCase()}</p>
                <p className="mt-1 text-sm"><b>{e.actor}</b> <span className="text-neutral-500">· {e.org}</span></p>
                <p className="mt-0.5 inline-block rounded bg-ink px-2 py-0.5 mono-meta font-bold text-white">{e.action}</p>
                <p className="mt-1 text-sm font-bold">{e.target}</p>
                <p className="mono-meta mt-1 text-neutral-500">{e.meta} · {e.engagement.toUpperCase()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrap>
  );
}
