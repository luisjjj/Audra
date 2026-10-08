import Link from "next/link";
import { notFound } from "next/navigation";
import { PageWrap } from "@/components/ui";
import { DEMO_DOCS } from "@/lib/demo";
import { Download, MessageSquare, Share2, History } from "lucide-react";
import { getActiveOrgContext, getDocById } from "@/lib/workspaces";

export default async function DocDetail({ params }: { params: { id: string } }) {
  const ctx = await getActiveOrgContext();
  const real = !ctx.isDemo && !!ctx.activeOrgId;

  let view: {
    code: string; title: string; by: string; date: string; version: number;
    reviewed: boolean; approved: boolean; category: string; engagement: string; size: string;
    versions: { version: number; fileName: string; by: string; date: string; note: string | null }[];
    comments: { id: string; author: string; body: string; date: string }[];
  } | null = null;

  if (!real) {
    const d = DEMO_DOCS.find((x) => x.id === params.id) ?? DEMO_DOCS[0];
    view = {
      ...d,
      versions: Array.from({ length: d.version }, (_, k) => d.version - k).map((v) => ({
        version: v,
        fileName: `${d.code.toLowerCase()}-v${v}.pdf`,
        by: d.by,
        date: v === d.version ? d.date : "Earlier version",
        note: null,
      })),
      comments: d.id === "doc-1" ? [{
        id: "c-1",
        author: "Michael Adeyemi",
        body: "Can we get the complete statement? Page 4 appears to be missing.",
        date: d.date,
      }] : [],
    };
  } else {
    const data = await getDocById(ctx.activeOrgId!, params.id);
    if (!data) notFound();
    view = { ...data.doc, versions: data.versions, comments: data.comments };
  }

  const d = view!;
  return (
    <PageWrap>
      <Link href="/documents" className="mono-meta underline">← EVIDENCE LIBRARY</Link>
      <h1 className="font-display mt-2 text-3xl font-black md:text-4xl">{d.title}</h1>
      <p className="mono-meta mt-1 text-neutral-500">{d.code} · v{d.version} · {d.engagement.toUpperCase()}</p>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="card-brutal rounded-3xl bg-white p-6">
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-paper p-10 text-center">
            <p className="font-display text-4xl font-black text-neutral-300">PDF</p>
            <p className="mono-meta mt-2">PRIVATE PREVIEW</p>
            <p className="mt-2 text-sm font-bold">{d.title} · {d.size}</p>
          </div>
          <div className="mt-4 rounded-2xl bg-neutral-50 border p-4 text-sm">
            {d.comments.length === 0 ? (
              <p className="text-neutral-500">No comments yet — reviews and questions will appear here.</p>
            ) : d.comments.map((c) => (
              <div key={c.id} className="mb-3 last:mb-0">
                <p className="font-black flex items-center gap-2"><MessageSquare size={15} /> {c.author}</p>
                <p className="mt-1 text-neutral-700">{c.body}</p>
                <p className="mono-meta mt-1 text-neutral-400">{c.date.toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="card-brutal rounded-3xl bg-white p-5">
            <p className="mono-meta text-neutral-500">METADATA</p>
            <div className="mt-2 space-y-1.5 text-sm">
              <p><b>Uploaded by</b> {d.by}</p><p><b>Uploaded</b> {d.date}</p>
              <p><b>Version</b> {d.version}</p><p><b>Status</b> {d.approved ? "Approved ✓" : d.reviewed ? "Under review" : "Not reviewed"}</p>
              <p className="mono-meta">VERSION {d.version} · ALL CHANGES KEPT</p>
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
              {d.versions.map((v) => (
                <div key={v.version} className={`rounded-xl p-3 ${v.version === d.version ? "bg-white/10" : "bg-white/5"}`}>
                  <p className={v.version === d.version ? "font-black" : "font-bold"}>v{v.version}{v.version === d.version ? " · current ✓" : ""}</p>
                  <p className="mono-meta text-white/60">{v.by} · {v.date}{v.note ? ` · ${v.note}` : ""}</p>
                </div>
              ))}
            </div>
            <p className="mono-meta mt-3 text-white/50">PREVIOUS VERSIONS ARE ALWAYS KEPT.</p>
          </div>
        </div>
      </div>
    </PageWrap>
  );
}
