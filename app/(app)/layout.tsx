import { Shell } from "@/components/shell";
import { getSession } from "@/lib/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const s: any = await getSession();
  return <Shell userName={s?.user?.name ?? "Henkyaa Japheth"} userRole={s?.role ?? "Admin"} org={s?.org?.name ?? "Apex Manufacturing Ltd."}>{children}</Shell>;
}
