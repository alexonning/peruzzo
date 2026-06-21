import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Marca, Memoria, Cor, Condicao } from "@/lib/types";
import { CoresPanel } from "./cores-panel";
import { MemoriasPanel } from "./memorias-panel";
import { MarcasPanel } from "./marcas-panel";
import { CondicoesPanel } from "./condicoes-panel";

export const dynamic = "force-dynamic";

export default async function CoresVariantesPage() {
  const sb = await createSupabaseServerClient();
  const [c, m, mc, cd] = await Promise.all([
    sb.from("cores").select("*").order("nome"),
    sb.from("memorias").select("*").order("capacidade"),
    sb.from("marcas").select("*").order("nome"),
    sb.from("condicoes").select("*").order("nome"),
  ]);

  const cores = (c.data ?? []) as Cor[];
  const memorias = (m.data ?? []) as Memoria[];
  const marcas = (mc.data ?? []) as Marca[];
  const condicoes = (cd.data ?? []) as Condicao[];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <CoresPanel cores={cores} />
      <MemoriasPanel memorias={memorias} />
      <MarcasPanel marcas={marcas} />
      <CondicoesPanel condicoes={condicoes} />
    </div>
  );
}
