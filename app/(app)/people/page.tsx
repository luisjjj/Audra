import { PageWrap, Reveal } from "@/components/ui";
import { DEMO_PEOPLE } from "@/lib/demo";

export default function People() {
  const internal = DEMO_PEOPLE.filter((p) => p.type === "INTERNAL");
  const external = DEMO_PEOPLE.filter((p) => p.type === "EXTERNAL");
  const Block = ({ title, list }: any) => (
    <div><h2 className="mono-meta mt-6 text-neutral-500">{title}</h2><div className="mt-2 grid gap-3 md:grid-cols-2">
      {list.map((p: any, i: number) => (
        <Reveal key={p.id} delay={i * 0.04}><div className="card-brutal-sm flex items-center justify-between rounded-2xl bg-white p-4">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-black bg-emerald-100 font-black">{p.name[0]}</span><div><p className="text-sm font-black">{p.name}</p><p className="text-xs text-neutral-500">{p.role} · {p.org}</p><p className="mono-meta text-neutral-400">{p.email}</p></div></div>
          <button className="text-xs font-black underline">Manage</button>
        </div></Reveal>
      ))}</div></div>
  );
  return (
    <PageWrap>
      <div className="flex flex-wrap items-end justify-between"><div><p className="mono-meta text-neutral-500">COLLABORATE · PEOPLE</p><h1 className="font-display text-4xl font-black md:text-5xl">People</h1></div><button className="card-brutal-sm rounded-2xl bg-ink px-5 py-2.5 text-sm font-black text-white">Invite →</button></div>
      <Block title="INTERNAL" list={internal} />
      <Block title="EXTERNAL — MERIDIAN AUDIT PARTNERS · 3 MEMBERS" list={external} />
      <div className="card-brutal mt-6 rounded-3xl bg-emerald-50 p-5 text-sm"><p className="font-black">Scoped external access</p><p className="text-neutral-600">External members see only engagements they are invited to — never Internal Finance or company-wide documents. Enforced server-side.</p></div>
    </PageWrap>
  );
}
