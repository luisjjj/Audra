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
    pending: "bg-amber-50 text-amber-800",
    submitted: "bg-sky-50 text-sky-800",
    under_review: "bg-orange-50 text-orange-800",
    changes_requested: "bg-red-50 text-red-700",
    approved: "bg-emerald-50 text-emerald-800",
    completed: "bg-emerald-700 text-white",
    overdue: "bg-red-600 text-white",
    active: "bg-emerald-50 text-emerald-800",
    draft: "bg-neutral-100 text-neutral-700",
    prepared: "bg-sky-50 text-sky-800",
    ready_for_review: "bg-orange-50 text-orange-800",
    accepted: "bg-emerald-700 text-white",
  };
  const cls = map[status] ?? "bg-neutral-100 text-neutral-700";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-black/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${cls}`}>
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
