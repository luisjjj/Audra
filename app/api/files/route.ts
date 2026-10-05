import { NextResponse } from "next/server";
import { getDownloadUrl, getUploadUrl, isStorageConfigured } from "@/lib/storage";

// POST { key, contentType } -> signed PUT url. GET?key= -> signed GET url (short-lived).
export async function POST(req: Request) {
  try {
    const { key, contentType } = await req.json();
    if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });
    if (!isStorageConfigured()) {
      // Demo fallback: client uploads via data-URL path; never expose creds.
      return NextResponse.json({ demo: true, uploadUrl: null, message: "R2 not configured — demo mode" });
    }
    const url = await getUploadUrl(String(key), String(contentType || "application/octet-stream"));
    return NextResponse.json({ uploadUrl: url });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });
  // TODO: enforce org/engagement permission check against document_permissions before signing.
  if (!isStorageConfigured()) return NextResponse.json({ demo: true });
  const url = await getDownloadUrl(key, 900);
  return NextResponse.json({ downloadUrl: url });
}
