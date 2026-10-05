"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("henkyaa@apex.example");
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="flex flex-col justify-center px-8 py-12 md:px-16 bg-ink text-white">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-display text-xl font-black">AUDRA</p>
          <h1 className="font-display mt-6 text-5xl font-black leading-[0.95] md:text-6xl">WELCOME<br />BACK.</h1>
          <p className="mt-4 text-white/70">Your audit workspace<br />is waiting.</p>
          <div className="mono-meta mt-8 space-y-1 text-white/50">
            <p>AUDIT_ID: ENG-2026 · 78% COMPLETE</p><p>EVENTS: 1,284 · HASH-CHAINED</p><p>ORGS: APEX + MERIDIAN</p>
          </div>
        </motion.div>
      </div>
      <div className="flex flex-col justify-center px-8 md:px-16 bg-paper">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mx-auto w-full max-w-md">
          <div className="card-brutal rounded-3xl bg-white p-8">
            <p className="text-2xl font-black">Log in</p>
            <p className="text-sm text-neutral-500">Demo works instantly — no password needed.</p>
            <label className="mt-6 block text-xs font-black uppercase">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none" />
            <label className="mt-4 block text-xs font-black uppercase">Password</label>
            <input type="password" placeholder="••••••••" className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none" />
            <Link href="/overview" className="card-brutal-sm mt-6 block rounded-2xl bg-emerald-600 py-3 text-center font-black text-white">Continue →</Link>
            <div className="mt-3 flex justify-between text-xs font-bold"><span className="cursor-pointer">Forgot password?</span><Link href="/signup" className="underline">Create workspace</Link></div>
          </div>
          <p className="mono-meta mt-4 text-center text-neutral-500">SERVER-AUTH · ORG-ISOLATED · SIGNED URLS</p>
        </motion.div>
      </div>
    </div>
  );
}
