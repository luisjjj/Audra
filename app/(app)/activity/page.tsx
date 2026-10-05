"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { PageWrap } from "@/components/ui";
import { DEMO_ACTIVITY } from "@/lib/demo";

export default function Activity() {
  const [filter, setFilter] = useState("All");
  const list = DEMO_ACTIVITY.filter(() => true);
  return (
    <PageWrap>
      <p className="mono-meta text-neutral-500">SYSTEM · APPEND-ONLY · HASH-CHAINED</p>
      <h1 className="font-display text-4xl font-black md:text-6xl">AUDIT TRAIL.</h1>
      <p className="text-sm text-neutral-500">Internal integrity mechanism — tamper-evident, not legal immutability. Normal users cannot edit or delete events.</p>
      <div className="mt-4 flex gap-2">{["All", "Uploads", "Approvals", "Requests"].map((x) => (<button key={x} onClick={() => setFilter(x)} className={`rounded-full border-[1.5px] px-4 py-1 text-xs font-black ${filter === x ? "bg-ink text-white border-black" : "bg-white border-black/20"}`}>{x}</button>))}</div>
      <div className="mt-6">
        <p className="mono-meta text-neutral-500">TODAY</p>
        <div className="mt-2 space-y-0">
          {list.map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex gap-4">
              <div className="flex flex-col items-center"><span className={`mt-1 h-3 w-3 rounded-full border-[1.5px] border-black ${i === 0 ? "bg-emerald-500 pulse-dot" : "bg-white"}`} />{i < list.length - 1 && <span className="w-[2px] flex-1 bg-black/15" style={{ minHeight: 28 }} />}</div>
              <div className="card-brutal-sm mb-3 flex-1 rounded-2xl bg-white p-4 hover:-translate-y-[1px] transition">
                <p className="mono-meta text-neutral-400">{e.time} · {e.ago.toUpperCase()}</p>
                <p className="mt-1 text-sm"><b>{e.actor}</b> <span className="text-neutral-500">· {e.org}</span></p>
                <p className="mt-0.5 inline-block rounded bg-ink px-2 py-0.5 font-mono text-[11px] font-black text-white">{e.action}</p>
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
