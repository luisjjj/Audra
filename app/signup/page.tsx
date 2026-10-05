"use client";
import Link from "next/link";
export default function Signup() {
  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <p className="font-display text-3xl font-black">AUDRA</p>
      <h1 className="font-display mt-4 text-5xl font-black">LET'S SET UP<br/>YOUR WORKSPACE.</h1>
      <div className="card-brutal mt-8 rounded-3xl bg-white p-8 space-y-4">
        <div><label htmlFor="ws-name" className="text-xs font-black uppercase">Company name</label><input id="ws-name" placeholder="Apex Manufacturing Ltd." className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm" /></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div><label htmlFor="ws-industry" className="text-xs font-black uppercase">Industry</label><input id="ws-industry" placeholder="Manufacturing" className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm" /></div>
          <div><label htmlFor="ws-size" className="text-xs font-black uppercase">Company size</label><input id="ws-size" placeholder="51–200" className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm" /></div>
        </div>
        <Link href="/overview" className="card-brutal-sm block rounded-2xl bg-ink py-3 text-center font-black text-white">Create workspace →</Link>
        <Link href="/overview" className="block text-center text-sm font-bold underline">Skip invite for now → open demo</Link>
      </div>
    </div>
  );
}
