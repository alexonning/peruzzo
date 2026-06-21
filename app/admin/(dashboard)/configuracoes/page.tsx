import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Config } from "@/lib/types";
import { ConfigForm } from "./config-form";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("config").select("*").eq("id", 1).maybeSingle();
  const cfg = (data as Config | null) ?? null;
  return <ConfigForm cfg={cfg} />;
}
