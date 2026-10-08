"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { createWorkspace } from "@/actions/audra";

export default function Signup() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "", industry: "", size: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (form.company.trim().length < 2) { setError("Give your workspace a company name."); return; }
    setBusy(true);
    try {
      if (!session?.user) {
        const res = await authClient.signUp.email({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });
        if (res.error) throw new Error(res.error.message || "Could not create your account.");
      }
      const ws = await createWorkspace({ name: form.company.trim(), industry: form.industry.trim() || undefined, size: form.size.trim() || undefined });
      if (!ws?.ok) throw new Error("Account created, but the workspace could not be set up.");
      router.push("/overview");
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <p className="font-display text-3xl font-black">AUDRA</p>
      <h1 className="font-display mt-4 text-5xl font-black">LET&apos;S SET UP<br />YOUR WORKSPACE.</h1>
      <p className="mt-3 text-sm text-neutral-500">Your account and workspace are created together — no invite needed.</p>
      <form onSubmit={onSubmit} className="card-brutal mt-8 rounded-3xl bg-white p-8 space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div><label htmlFor="su-name" className="text-xs font-black uppercase">Full name</label><input id="su-name" value={form.name} onChange={set("name")} placeholder="Henkyaa Japheth" autoComplete="name" className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm" /></div>
          <div><label htmlFor="su-email" className="text-xs font-black uppercase">Work email</label><input id="su-email" type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" autoComplete="email" className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm" /></div>
        </div>
        <div><label htmlFor="su-password" className="text-xs font-black uppercase">Password</label><input id="su-password" type="password" value={form.password} onChange={set("password")} placeholder="Minimum 8 characters" autoComplete="new-password" className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm" /></div>
        <div><label htmlFor="ws-name" className="text-xs font-black uppercase">Company name</label><input id="ws-name" value={form.company} onChange={set("company")} placeholder="Apex Manufacturing Ltd." autoComplete="organization" className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm" /></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div><label htmlFor="ws-industry" className="text-xs font-black uppercase">Industry</label><input id="ws-industry" value={form.industry} onChange={set("industry")} placeholder="Manufacturing" className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm" /></div>
          <div><label htmlFor="ws-size" className="text-xs font-black uppercase">Company size</label><input id="ws-size" value={form.size} onChange={set("size")} placeholder="51–200" className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm" /></div>
        </div>
        {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}
        <button type="submit" disabled={busy} className="card-brutal-sm block min-h-[44px] w-full rounded-2xl bg-emerald-600 py-3 text-center font-black text-white disabled:opacity-60">{busy ? "Setting up…" : "Create workspace →"}</button>
        <Link href="/overview" className="block text-center text-sm font-bold text-neutral-500">Just looking around? Explore a sample workspace</Link>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-500">Already have an account? <Link href="/login" className="font-semibold text-ink underline underline-offset-4">Log in</Link></p>
    </div>
  );
}
