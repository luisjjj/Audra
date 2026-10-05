"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, Inbox, Files, Landmark, Users, Building2, Activity, Settings, Bell, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { section: "OVERVIEW", items: [{ href: "/overview", label: "Overview", icon: LayoutDashboard }] },
  { section: "WORK", items: [
    { href: "/engagements", label: "Engagements", icon: Briefcase },
    { href: "/requests", label: "Requests", icon: Inbox },
    { href: "/documents", label: "Documents", icon: Files },
    { href: "/filings", label: "Filings", icon: Landmark },
  ]},
  { section: "COLLABORATE", items: [
    { href: "/people", label: "People", icon: Users },
    { href: "/organizations", label: "Organizations", icon: Building2 },
  ]},
  { section: "SYSTEM", items: [
    { href: "/activity", label: "Activity", icon: Activity },
    { href: "/settings", label: "Settings", icon: Settings },
  ]},
];

export function Shell({ children, userName = "Henkyaa Japheth", userRole = "Admin", org = "Apex Manufacturing Ltd." }: any) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [wsOpen, setWsOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <div className="relative">
          <button onClick={() => setWsOpen(!wsOpen)} className="card-brutal-sm flex w-full items-center justify-between rounded-2xl bg-white px-3 py-2.5 text-left hover:-translate-y-[1px] transition">
            <span><span className="block text-[11px] font-bold uppercase tracking-widest text-neutral-500">Workspace</span><span className="block text-sm font-black">{org} ⌄</span></span>
            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white">LIVE</span>
          </button>
          <AnimatePresence>
            {wsOpen && (
              <motion.div initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6 }} className="card-brutal absolute z-50 mt-2 w-full rounded-2xl bg-white p-2">
                {[org, "Meridian Audit Partners", "XYZ Consulting"].map((o) => (
                  <button key={o} className="w-full rounded-xl px-3 py-2 text-left text-sm font-bold hover:bg-paper">{o}</button>
                ))}
                <Link href="/settings" className="block rounded-xl px-3 py-2 text-sm font-black text-emerald-700 hover:bg-emerald-50">+ Create workspace</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Link href="/overview" className="mt-4 block rounded-2xl bg-ink px-4 py-3 text-white">
          <span className="font-display text-2xl font-black tracking-tight">AUDRA</span>
          <span className="mono-meta mt-1 block text-white/60">Every action. Accounted for.</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 pb-4">
        {NAV.map((g) => (
          <div key={g.section} className="mt-4">
            <p className="mono-meta px-2 text-neutral-500">{g.section}</p>
            <div className="mt-1 space-y-1">
              {g.items.map((it) => {
                const active = path === it.href || path?.startsWith(it.href + "/");
                return (
                  <Link key={it.href} href={it.href} className={`group flex items-center gap-2.5 rounded-xl border-[1.5px] px-3 py-2 text-sm font-bold transition ${active ? "border-black bg-ink text-white shadow-[2px_2px_0_0_#0B7A4B]" : "border-transparent hover:border-black hover:bg-white"}`}>
                    <it.icon size={17} className={active ? "text-emerald-300" : "group-hover:translate-x-[1px] transition"} />
                    {it.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-4">
        <div className="card-brutal-sm rounded-2xl bg-white p-3">
          <p className="text-sm font-black">{userName}</p>
          <p className="mono-meta text-neutral-500">{userRole} · {org}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-[280px] shrink-0 border-r-[1.5px] border-black bg-paper lg:block">{sidebar}</aside>
      <AnimatePresence>{open && (
        <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="fixed inset-y-0 left-0 z-50 w-[280px] bg-paper border-r-[1.5px] border-black lg:hidden">
          <button onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded-full border border-black p-1"><X size={16} /></button>
          {sidebar}
        </motion.div>
      )}</AnimatePresence>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b-[1.5px] border-black bg-paper/90 backdrop-blur">
          <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-4 py-3 md:px-8">
            <button onClick={() => setOpen(true)} className="rounded-xl border-[1.5px] border-black bg-white p-2 lg:hidden"><Menu size={18} /></button>
            <div className="hidden flex-1 items-center gap-2 rounded-2xl border-[1.5px] border-black bg-white px-3 py-2 md:flex">
              <Search size={16} /><input placeholder="Search documents, requests, filings…  ( / )" className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400" />
              <kbd className="mono-meta rounded border border-black px-1">⌘K</kbd>
            </div>
            <Link href="/activity" className="relative rounded-xl border-[1.5px] border-black bg-white p-2 hover:-translate-y-[1px] transition"><Bell size={18} /><span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border border-black bg-red-500" /></Link>
            <Link href="/settings" className="hidden rounded-xl border-[1.5px] border-black bg-ink px-4 py-2 text-sm font-black text-white hover:-translate-y-[1px] transition sm:block">Invite</Link>
          </div>
        </header>
        <main className="mx-auto max-w-[1200px] px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
