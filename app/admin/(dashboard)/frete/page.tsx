import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FreteFaixa } from "@/lib/types";
import { FaixasPanel } from "./faixas-panel";
import { MensagemPanel } from "./mensagem-panel";

export const dynamic = "force-dynamic";

export default async function FretePage() {
  const sb = await createSupabaseServerClient();
  const [f, cfg] = await Promise.all([
    sb.from("frete_faixas").select("*").order("cep_inicio"),
    sb.from("config").select("cep_msg").eq("id", 1).maybeSingle(),
  ]);

  const faixas = (f.data ?? []) as FreteFaixa[];
  const cepMsg = (cfg.data?.cep_msg as string | undefined) ??
    "Não encontramos o frete para o seu CEP. Consulte via WhatsApp! 😊";

  return (
    <div className="space-y-6 max-w-7xl">
      <FaixasPanel faixas={faixas} />
      <MensagemPanel cepMsg={cepMsg} />
    </div>
  );
}
