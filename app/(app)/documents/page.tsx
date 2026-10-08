"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PageWrap, Reveal, EmptyState } from "@/components/ui";
import { CardsSkeleton, HeaderSkeleton, PillsSkeleton } from "@/components/skeletons";
import { getDocumentsView } from "@/actions/views";
import { Upload } from "lucide-react";

const FILTERS = ["All", "Invoices", "Bank statements", "Tax", "Payroll", "Contracts", "Other"];

type View = Awaited<ReturnType<typeof getDocumentsView>>;

export default function Documents() {
  const [view, setView] = useState<View | null>(null);
  const [f, setF] = useState("All");
  const [q, setQ] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { getDocumentsView().then(setView); }, []);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const fakeUpload = () => {
    setUploading(true); setProgress(0);
    timer.current = setInterval(() => setProgress((p) => {
      if (p >= 100) { if (timer.current) clearInterval(timer.current); setTimeout(() => setUploading(false), 600); return 100; }
      return Math.min(p + 12, 100);
    }), 160);
  };

  if (!view) {
    return (
      <PageWrap>
        <HeaderSkeleton />
        <PillsSkeleton count={7} />
        <CardsSkeleton count={4} />
      </PageWrap>
    );
  }

  const list = view.items.filter((d) => (f === "All" || d.category === f) && d.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <PageWrap>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="mono-meta text-neutral-500">WORK · EVIDENCE LIBRARY</p><h1 className="font-display text-4xl font-black md:text-5xl">Documents</h1></div>
        {view.isDemo && (
          <button onClick={fakeUpload} className="card-brutal-sm inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-ink px-5 py-2.5 text-sm font-black text-white"><Upload size={16} /> Upload</button>
        )}
      </div>
      {uploading && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="card-brutal-sm mt-4 rounded-2xl bg-white p-4">
          <p className="text-sm font-black">Uploading Q3_Bank_Statement.pdf… {progress}%</p>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-neutral-200"><motion.div animate={{ width: `${progress}%` }} className="h-full bg-emerald-600" /></div>
          <p className="mono-meta mt-1 text-neutral-500">{progress < 100 ? "UPLOADING → PROCESSING → EXTRACT/REVIEW" : "COMPLETED ✓ · v3 CREATED · TRAIL LOGGED"}</p>
        </motion.div>
      )}
      <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search documents" role="searchbox" placeholder="Search documents..." className="mt-4 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none" />
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter documents">{FILTERS.map((x) => (<button key={x} role="tab" aria-selected={f === x} onClick={() => setF(x)} className={`inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold ${f === x ? "border-ink bg-ink text-white" : "border-neutral-200 bg-white text-neutral-600"}`}>{x}</button>))}</div>
      {list.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title={view.items.length === 0 && !view.isDemo ? "No evidence yet" : "Your evidence library is empty."}
            body={view.items.length === 0 && !view.isDemo ? "Documents requested against your engagements will land here, versioned and trailed." : "Upload the first document for this engagement."}
          />
        </div>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {list.map((d, i) => (
            <Reveal key={d.id} delay={i * 0.04}>
              <Link href={`/documents/${d.id}`} className="card-brutal-sm block rounded-2xl bg-white p-4 hover:-translate-y-[1px] transition">
                <p className="font-black">{d.title}</p>
                <p className="mono-meta mt-1 text-neutral-500">{d.code} · v{d.version} · {d.size}</p>
                <p className="mt-1 text-xs text-neutral-500">Uploaded by {d.by} · {d.date}</p>
                <div className="mt-2 flex gap-2 text-[11px] font-bold"><span className={d.reviewed ? "text-emerald-700" : "text-neutral-400"}>{d.reviewed ? "Reviewed ✓" : "Review pending"}</span><span className={d.approved ? "text-emerald-700" : "text-neutral-400"}>{d.approved ? "Approved ✓" : "Not approved"}</span></div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </PageWrap>
  );
}
