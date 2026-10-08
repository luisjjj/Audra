"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createEngagement } from "@/actions/audra";

export function NewEngagementButton({ label = "+ New engagement", className = "" }: { label?: string; className?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.title.trim().length < 3) { setError("Give the engagement a title."); return; }
    setBusy(true);
    try {
      await createEngagement({ title: form.title.trim(), description: form.description.trim() || undefined, dueDate: form.dueDate || undefined }, "owner");
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Could not create the engagement.");
      setBusy(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className={className || "card-brutal-sm inline-flex min-h-[44px] items-center rounded-2xl bg-ink px-5 py-2.5 text-sm font-black text-white"}>{label}</button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 md:items-center" onClick={() => setOpen(false)}>
            <motion.div role="dialog" aria-modal="true" aria-label="New engagement" initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }} transition={{ type: "spring", damping: 26 }} onClick={(e) => e.stopPropagation()} className="card-brutal w-full max-w-lg rounded-3xl bg-white p-6">
              <p className="text-xl font-black">New engagement</p>
              <p className="text-sm text-neutral-500">Created inside your active workspace.</p>
              <form onSubmit={onSubmit} className="mt-4 space-y-3">
                <div><label htmlFor="eng-title" className="text-xs font-black uppercase">Title</label><input id="eng-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="2027 External Audit" className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm" /></div>
                <div><label htmlFor="eng-desc" className="text-xs font-black uppercase">Description</label><textarea id="eng-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Scope, period, notes…" rows={3} className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm" /></div>
                <div><label htmlFor="eng-due" className="text-xs font-black uppercase">Due date</label><input id="eng-due" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm" /></div>
                {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}
                <button type="submit" disabled={busy} className="min-h-[44px] w-full rounded-2xl bg-ink py-3 font-black text-white disabled:opacity-60">{busy ? "Creating…" : "Create engagement →"}</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
