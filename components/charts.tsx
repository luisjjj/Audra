"use client";
import { motion } from "framer-motion";
export function ProgressRing({ value }: { value: number }) {
  const R = 54, C = 2 * Math.PI * R;
  return (
    <div className="flex items-center justify-center">
      <svg width={140} height={140} viewBox="0 0 140 140">
        <circle cx={70} cy={70} r={R} stroke="rgba(255,255,255,.15)" strokeWidth={12} fill="none" />
        <motion.circle cx={70} cy={70} r={R} stroke="#34D399" strokeWidth={12} fill="none" strokeLinecap="round"
          strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C - (C * value) / 100 }} transition={{ duration: 1.2, ease: "easeOut" }} transform="rotate(-90 70 70)" />
        <text x={70} y={76} textAnchor="middle" fill="white" fontWeight={900} fontSize={24}>{value}%</text>
      </svg>
    </div>
  );
}
export function Bar({ value }: { value: number }) {
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-neutral-200 border border-black/10">
      <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.9 }} className="h-full bg-emerald-600" />
    </div>
  );
}
