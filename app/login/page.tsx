"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await authClient.signIn.email({ email: email.trim(), password });
      if (res.error) throw new Error(res.error.message || "Could not sign you in.");
      router.push("/overview");
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="flex flex-col justify-center px-8 py-12 md:px-16 bg-ink text-white">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-display text-xl font-black">AUDRA</p>
          <h1 className="font-display mt-6 text-5xl font-black leading-[0.95] md:text-6xl">WELCOME<br />BACK.</h1>
          <p className="mt-4 text-white/70">Your audit workspace<br />is waiting.</p>
          <div className="mono-meta mt-8 space-y-1 text-white/50">
            <p>AUDIT_ID: ENG-2026 · 78% COMPLETE</p><p>EVENTS: HASH-CHAINED</p><p>ORGS: APEX + MERIDIAN</p>
          </div>
        </motion.div>
      </div>
      <div className="flex flex-col justify-center px-8 md:px-16 bg-paper">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mx-auto w-full max-w-md">
          <form onSubmit={onSubmit} className="card-brutal rounded-3xl bg-white p-8">
            <p className="text-2xl font-black">Log in</p>
            <p className="text-sm text-neutral-500">Use the account you signed up with.</p>
            <label htmlFor="login-email" className="mt-6 block text-xs font-black uppercase">Email</label>
            <input id="login-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none" />
            <label htmlFor="login-password" className="mt-4 block text-xs font-black uppercase">Password</label>
            <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none" />
            {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}
            <button type="submit" disabled={busy} className="card-brutal-sm mt-6 block min-h-[44px] w-full rounded-2xl bg-emerald-600 py-3 text-center font-black text-white disabled:opacity-60">{busy ? "Signing in…" : "Continue →"}</button>
            <div className="mt-3 flex items-center justify-between text-xs font-bold"><button type="button" className="underline-offset-2 hover:underline">Forgot password?</button><Link href="/signup" className="font-bold text-emerald-700 underline">Create workspace</Link></div>
          </form>
          <p className="mt-4 text-center text-sm text-neutral-500">Just exploring? <Link href="/overview" className="font-semibold text-ink underline underline-offset-4">Open the demo</Link></p>
          <p className="mono-meta mt-2 text-center text-neutral-500">SERVER-AUTH · ORG-ISOLATED · SIGNED URLS</p>
        </motion.div>
      </div>
    </div>
  );
}
