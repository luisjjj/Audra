"use client";
import { motion } from "framer-motion";

export function PageWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay }}>
      {children}
    </motion.div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 border-yellow-600 text-yellow-900",
    submitted: "bg-blue-50 border-black text-black",
    under_review: "bg-orange-100 border-orange-700 text-orange-900",
    changes_requested: "bg-red-100 border-red-700 text-red-900",
    approved: "bg-emerald-100 border-emerald-700 text-emerald-900",
    completed: "bg-emerald-600 border-black text-white",
    overdue: "bg-red-600 border-black text-white",
    active: "bg-emerald-100 border-emerald-700 text-emerald-900",
    draft: "bg-neutral-100 border-black text-black",
    prepared: "bg-blue-50 border-black text-black",
    ready_for_review: "bg-orange-100 border-black text-black",
    accepted: "bg-emerald-600 border-black text-white",
  };
  const cls = map[status] ?? "bg-white border-black text-black";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border-[1.5px] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="card-brutal rounded-3xl bg-white p-10 text-center">
      <p className="font-display text-2xl font-black">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-600">{body}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
