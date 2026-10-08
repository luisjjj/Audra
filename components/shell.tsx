"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Briefcase, Inbox, Files, Landmark, Users, Building2, Activity, Settings, Bell, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { section: "Overview", items: [{ href: "/overview", label: "Overview", icon: LayoutDashboard }] },
  { section: "Work", items: [
    { href: "/engagements", label: "Engagements", icon: Briefcase },
    { href: "/requests", label: "Requests", icon: Inbox },
    { href: "/documents", label: "Documents", icon: Files },
    { href: "/filings", label: "Filings", icon: Landmark },
  ]},
  { section: "Collaborate", items: [
    { href: "/people", label: "People", icon: Users },
    { href: "/organizations", label: "Organizations", icon: Building2 },
  ]},
  { section: "System", items: [
    { href: "/activity", label: "Activity", icon: Activity },
    { href: "/settings", label: "Settings", icon: Settings },
  ]},
];

export function Shell({ children, userName = "Henkyaa Japheth", userRole = "Admin", orgs = [{ id: "org-apex", name: "Apex Manufacturing Ltd." }], activeOrgId = "org-apex", activeOrgName }: {
  children: React.ReactNode;
  userName?: string;
  userRole?: string;
  orgs?: { id: string; name: string }[];
  activeOrgId?: string | null;
  activeOrgName?: string;
}) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [wsOpen, setWsOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const activeName = activeOrgName ?? orgs.find((o) => o.id === activeOrgId)?.name ?? orgs[0]?.name ?? "Workspace";

  async function chooseOrg(id: string) {
    if (id === activeOrgId || switching) { setWsOpen(false); return; }
    setSwitching(true);
    try {
      const { switchWorkspace } = await import("@/actions/audra");
      await switchWorkspace(id);
      router.refresh();
    } catch {
      // stays on current workspace
    } finally {
      setSwitching(false);
      setWsOpen(false);
    }
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <div className="relative">
          <button onClick={() => setWsOpen(!wsOpen)} aria-expanded={wsOpen} aria-haspopup="listbox" className="card-brutal-sm flex w-full items-center justify-between gap-2 rounded-xl bg-white px-3 py-2.5 text-left transition hover:bg-neutral-50">
            <span className="min-w-0"><span className="block text-[11px] font-medium uppercase tracking-wider text-neutral-500">Workspace</span><span className="block truncate text-sm font-semibold">{activeName}</span></span>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Live</span>
          </button>
          <AnimatePresence>
            {wsOpen && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="card-brutal absolute z-50 mt-2 w-full rounded-xl bg-white p-1.5">
                {orgs.map((o) => (
                  <button key={o.id} onClick={() => chooseOrg(o.id)} className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-neutral-100">
                    <span className="truncate">{o.name}</span>
                    {o.id === activeOrgId && <span className="mono-meta shrink-0 text-emerald-700">ACTIVE</span>}
                  </button>
                ))}
                <Link href="/signup" className="block rounded-lg px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">+ Create workspace</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Link href="/overview" className="mt-4 block rounded-xl bg-ink px-4 py-3 text-white">
          <span className="font-display text-2xl font-black tracking-tight">AUDRA</span>
          <span className="mono-meta mt-1 block text-white/55">Every action. Accounted for.</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 pb-4">
        {NAV.map((g) => (
          <div key={g.section} className="mt-5">
            <p className="mono-meta px-2 uppercase text-neutral-400">{g.section}</p>
            <div className="mt-1 space-y-0.5">
              {g.items.map((it) => {
                const active = path === it.href || path?.startsWith(it.href + "/");
                return (
                  <Link key={it.href} href={it.href} className={`flex min-h-[44px] items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${active ? "bg-ink font-semibold text-white" : "font-medium text-neutral-600 hover:bg-white hover:text-black"}`}>
                    <it.icon size={17} strokeWidth={active ? 2.25 : 1.75} />
                    {it.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-4">
        <div className="card-brutal-sm rounded-xl bg-white p-3">
          <p className="text-sm font-semibold">{userName}</p>
          <p className="mono-meta mt-0.5 truncate text-neutral-500">{userRole} · {activeName}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-[272px] shrink-0 border-r border-neutral-200 bg-paper lg:block">{sidebar}</aside>
      <AnimatePresence>{open && (
        <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ duration: 0.22 }} className="fixed inset-y-0 left-0 z-50 w-[272px] border-r border-neutral-200 bg-paper lg:hidden">
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-3 top-3 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-neutral-300"><X size={16} /></button>
          {sidebar}
        </motion.div>
      )}</AnimatePresence>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-neutral-200 bg-paper/90 backdrop-blur">
          <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-4 py-3 md:px-8">
            <button onClick={() => setOpen(true)} aria-label="Open menu" className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-neutral-200 bg-white lg:hidden"><Menu size={18} /></button>
            <div className="hidden flex-1 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 md:flex">
              <Search size={16} className="text-neutral-400" /><input aria-label="Search documents, requests, filings" placeholder="Search documents, requests, filings…" className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400" />
              <kbd className="mono-meta rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-neutral-400">⌘K</kbd>
            </div>
            <Link href="/notifications" aria-label="Notifications, unread" className="relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-neutral-200 bg-white transition hover:bg-neutral-50"><Bell size={18} /><span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-paper" /></Link>
            <Link href="/people" className="hidden min-h-[44px] items-center rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-charcoal sm:inline-flex">Invite</Link>
          </div>
        </header>
        <main className="mx-auto max-w-[1200px] px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
