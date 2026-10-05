import { PageWrap, Reveal } from "@/components/ui";
import { DEMO_NOTIFICATIONS } from "@/lib/demo";

export default function Notifications() {
  return (
    <PageWrap>
      <p className="mono-meta text-neutral-500">SYSTEM · NOTIFICATION CENTER</p>
      <h1 className="font-display text-4xl font-black">Notifications</h1>
      <div className="mt-4 space-y-3">
        {DEMO_NOTIFICATIONS.map((n, i) => (
          <Reveal key={n.id} delay={i * 0.05}>
            <div className="card-brutal-sm rounded-2xl bg-white p-4"><p className="text-sm font-black">{n.title}</p><p className="text-sm text-neutral-600">{n.body}</p><p className="mono-meta mt-1 text-neutral-400">{n.time} AGO</p></div>
          </Reveal>
        ))}
      </div>
    </PageWrap>
  );
}
