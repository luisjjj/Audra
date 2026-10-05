import Link from "next/link";
import { PageWrap } from "@/components/ui";
import { DEMO_DOCS } from "@/lib/demo";
import { Download, MessageSquare, Share2, History } from "lucide-react";

export default function DocDetail({ params }: { params: { id: string } }) {
  const d = DEMO_DOCS.find((x) => x.id === params.id) ?? DEMO_DOCS[0];
  return (
    <PageWrap>
      <Link href="/documents" className="mono-meta underline">← EVIDENCE LIBRARY</Link>
      <h1 className="font-display mt-2 text-3xl font-black md:text-4xl">{d.title}</h1>
      <p className="mono-meta mt-1 text-neutral-500">{d.code} · v{d.version} · {d.engagement.toUpperCase()}</p>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="card-brutal rounded-3xl bg-white p-6">
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-paper p-10 text-center">
            <p className="font-display text-4xl font-black text-neutral-300">PDF</p>
            <p className="mono-meta mt-2">SECURE PREVIEW · SIGNED URL · NO PUBLIC LINKS</p>
            <p className="mt-2 text-sm font-bold">{d.title} · {d.size}</p>
          </div>
          <div className="mt-4 rounded-2xl bg-neutral-50 border p-4 text-sm">
            <p className="font-black flex items-center gap-2"><MessageSquare size={15} /> Michael Adams</p>
            <p className="mt-1 text-neutral-700">Can we get the complete statement? Page 4 appears to be missing.</p>
            <button className="mt-2 text-xs font-black underline">Reply</button>
            <div className="ml-4 mt-3 border-l-2 border-neutral-200 pl-3"><p className="text-xs font-black">Sarah Okafor <span className="mono-meta font-normal">· v2 uploaded with page 4</span></p></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card-brutal rounded-3xl bg-white p-5">
            <p className="mono-meta text-neutral-500">METADATA</p>
            <div className="mt-2 space-y-1.5 text-sm">
              <p><b>Uploaded by</b> {d.by}</p><p><b>Uploaded</b> 14 Sept 2026, 10:42 AM</p>
              <p><b>Version</b> {d.version}</p><p><b>Status</b> {d.approved ? "Approved ✓" : "Under review"}</p>
              <p className="mono-meta">SHA 9f2c…a1 · PREV 41bd…07 · CHAINED</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-black">
              <button className="rounded-xl border border-neutral-200 bg-white py-2 inline-flex items-center justify-center gap-1"><Download size={14} /> Download</button>
              <button className="rounded-xl border border-neutral-200 bg-white py-2">Replace</button>
              <button className="rounded-xl border border-neutral-200 bg-white py-2">Review</button>
              <button className="rounded-xl border border-neutral-200 bg-white py-2 inline-flex items-center justify-center gap-1"><Share2 size={14} /> Share</button>
            </div>
          </div>
          <div className="card-brutal rounded-3xl bg-ink p-5 text-white">
            <p className="mono-meta text-white/60 flex items-center gap-2"><History size={12} /> VERSION HISTORY</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="rounded-xl bg-white/10 p-3"><p className="font-black">v2 · current ✓</p><p className="mono-meta text-white/60">{d.by} · 14 Sept 10:42</p></div>
              <div className="rounded-xl bg-white/5 p-3"><p className="font-bold">v1</p><p className="mono-meta text-white/60">{d.by} · 12 Sept 09:18</p></div>
            </div>
            <p className="mono-meta mt-3 text-white/50">NEVER SILENTLY OVERWRITTEN.</p>
          </div>
        </div>
      </div>
    </PageWrap>
  );
}
