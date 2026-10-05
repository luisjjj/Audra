import { createHash } from "crypto";

export function hashEvent(prevHash: string, payload: string, timestamp: string): string {
  // Tamper-evident chaining. Internal integrity mechanism — not legal immutability.
  return createHash("sha256").update(`${prevHash}|${payload}|${timestamp}`).digest("hex");
}

export async function buildEventHash(opts: {
  getLastHash: () => Promise<string | null>;
  payload: object;
  timestamp: string;
}) {
  const prev = (await opts.getLastHash()) ?? "GENESIS";
  const hash = hashEvent(prev, JSON.stringify(opts.payload), opts.timestamp);
  return { prevHash: prev, eventHash: hash };
}
