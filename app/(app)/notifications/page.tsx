import { PageWrap, Reveal, EmptyState } from "@/components/ui";
import { DEMO_NOTIFICATIONS } from "@/lib/demo";
import { getActiveOrgContext, getUserNotifications } from "@/lib/workspaces";

export default async function Notifications() {
  const ctx = await getActiveOrgContext();
  const items = ctx.isDemo || !ctx.activeOrgId
    ? DEMO_NOTIFICATIONS.map((n) => ({ id: n.id, title: n.title, body: n.body, time: `${n.time} ago`, read: false }))
    : await getUserNotifications(ctx.user.id);
  return (
    <PageWrap>
      <p className="mono-meta text-neutral-500">NOTIFICATIONS</p>
      <h1 className="font-display text-4xl font-black">Notifications</h1>
      {items.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="All caught up"
            body="Assignments, uploads, reviews and mentions will land here."
          />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((n, i) => (
            <Reveal key={n.id} delay={i * 0.05}>
              <div className="card-brutal-sm rounded-2xl bg-white p-4"><p className="text-sm font-black">{n.title}</p><p className="text-sm text-neutral-600">{n.body}</p><p className="mono-meta mt-1 text-neutral-400">{n.time.toUpperCase()}</p></div>
            </Reveal>
          ))}
        </div>
      )}
    </PageWrap>
  );
}
