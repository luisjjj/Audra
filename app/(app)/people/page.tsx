import { PageWrap, Reveal, EmptyState } from "@/components/ui";
import { DEMO_PEOPLE } from "@/lib/demo";
import { getActiveOrgContext, getOrgMembers } from "@/lib/workspaces";

export default async function People() {
  const ctx = await getActiveOrgContext();
  const people = ctx.isDemo || !ctx.activeOrgId
    ? DEMO_PEOPLE
    : await getOrgMembers(ctx.activeOrgId, ctx.activeOrg!.name);
  const internal = people.filter((p) => p.type === "INTERNAL");
  const external = people.filter((p) => p.type === "EXTERNAL");

  return (
    <PageWrap>
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="mono-meta text-neutral-500">COLLABORATE · PEOPLE</p><h1 className="font-display text-4xl font-black md:text-5xl">People</h1></div><button className="card-brutal-sm min-h-[44px] rounded-2xl bg-ink px-5 py-2.5 text-sm font-black text-white">Invite →</button></div>
      {people.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No collaborators yet"
            body="Audit work rarely happens alone. Invite your team or an external organization to collaborate."
          />
        </div>
      ) : (
        <>
          <Block title={`INTERNAL · ${internal.length}`} list={internal} />
          {external.length > 0 && <Block title={`EXTERNAL · ${external.length} MEMBER${external.length === 1 ? "" : "S"}`} list={external} />}
          <div className="card-brutal mt-6 rounded-3xl bg-emerald-50 p-5 text-sm"><p className="font-black">Scoped external access</p><p className="text-neutral-600">External members see only engagements they are invited to — never Internal Finance or company-wide documents. Enforced server-side.</p></div>
        </>
      )}
    </PageWrap>
  );
}

function Block({ title, list }: { title: string; list: any[] }) {
  return (
    <div><h2 className="mono-meta mt-6 text-neutral-500">{title}</h2><div className="mt-2 grid gap-3 md:grid-cols-2">
      {list.map((p: any, i: number) => (
        <Reveal key={p.id} delay={i * 0.04}><div className="card-brutal-sm flex items-center justify-between gap-3 rounded-2xl bg-white p-4">
          <div className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-black text-emerald-800">{p.name[0]}</span><div className="min-w-0"><p className="truncate text-sm font-black">{p.name}</p><p className="truncate text-xs text-neutral-500">{p.role} · {p.org}</p><p className="mono-meta truncate text-neutral-400">{p.email}</p></div></div>
          <button className="shrink-0 rounded-lg px-3 py-2 text-xs font-black underline">Manage</button>
        </div></Reveal>
      ))}</div></div>
  );
}
