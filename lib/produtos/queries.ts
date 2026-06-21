import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ProdutoComJoins,
  Marca,
  Memoria,
  Cor,
  Condicao,
} from "@/lib/types";

const PRODUTO_SELECT = `
  *,
  marca:marca_id    ( id, nome ),
  memoria:memoria_id ( id, capacidade, sigla ),
  cor:cor_id        ( id, nome, hex ),
  condicao:condicao_id ( id, nome, badge ),
  variantes:produto_variantes (
    *,
    cor:cor_id ( id, nome, hex ),
    memoria:memoria_id ( id, capacidade, sigla )
  )
`;

export async function listProdutos(): Promise<ProdutoComJoins[]> {
  const sb = await createSupabaseServerClient();
  const { data, error } = await sb
    .from("produtos")
    .select(PRODUTO_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as ProdutoComJoins[];
}

export async function getProduto(id: string): Promise<ProdutoComJoins | null> {
  const sb = await createSupabaseServerClient();
  const { data, error } = await sb
    .from("produtos")
    .select(PRODUTO_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data ?? null) as unknown as ProdutoComJoins | null;
}

export type OpcoesForm = {
  marcas: Marca[];
  memorias: Memoria[];
  cores: Cor[];
  condicoes: Condicao[];
};

export async function loadOpcoesForm(): Promise<OpcoesForm> {
  const sb = await createSupabaseServerClient();
  const [m, mem, c, cond] = await Promise.all([
    sb.from("marcas").select("*").eq("ativo", true).order("nome"),
    sb.from("memorias").select("*").eq("ativo", true).order("capacidade"),
    sb.from("cores").select("*").eq("ativo", true).order("nome"),
    sb.from("condicoes").select("*").eq("ativo", true).order("nome"),
  ]);
  return {
    marcas: (m.data ?? []) as Marca[],
    memorias: (mem.data ?? []) as Memoria[],
    cores: (c.data ?? []) as Cor[],
    condicoes: (cond.data ?? []) as Condicao[],
  };
}

/** Dados públicos pra montar filtros da vitrine (não exige auth). */
export async function loadFiltrosPublicos(): Promise<{
  condicoes: Condicao[];
  memorias: Memoria[];
}> {
  const sb = await createSupabaseServerClient();
  const [cond, mem] = await Promise.all([
    sb.from("condicoes").select("*").eq("ativo", true).order("nome"),
    sb.from("memorias").select("*").eq("ativo", true).order("capacidade"),
  ]);
  return {
    condicoes: (cond.data ?? []) as Condicao[],
    memorias: (mem.data ?? []) as Memoria[],
  };
}

/** Vitrine pública — robusta contra schema ausente. */
export async function listProdutosPublicos(): Promise<ProdutoComJoins[]> {
  const sb = await createSupabaseServerClient();
  const { data, error } = await sb
    .from("produtos")
    .select(PRODUTO_SELECT)
    .eq("ativo", true)
    .order("destaque", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("[listProdutosPublicos] schema indisponível:", error.message);
    return [];
  }
  return (data ?? []) as unknown as ProdutoComJoins[];
}

export async function dashboardStats() {
  const sb = await createSupabaseServerClient();
  const [prod, frete, cores, memorias, cfg] = await Promise.all([
    sb.from("produtos").select("id", { count: "exact", head: true }).eq("ativo", true),
    sb.from("frete_faixas").select("id", { count: "exact", head: true }),
    sb.from("cores").select("id", { count: "exact", head: true }).eq("ativo", true),
    sb.from("memorias").select("id", { count: "exact", head: true }).eq("ativo", true),
    sb.from("config").select("whatsapp").eq("id", 1).maybeSingle(),
  ]);
  return {
    produtosAtivos: prod.count ?? 0,
    faixasCep: frete.count ?? 0,
    variantes: (cores.count ?? 0) * (memorias.count ?? 0),
    whatsapp: (cfg.data?.whatsapp as string | undefined) ?? null,
  };
}

export async function listProdutosRecentes(limit = 5): Promise<ProdutoComJoins[]> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("produtos")
    .select(PRODUTO_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as unknown as ProdutoComJoins[];
}
