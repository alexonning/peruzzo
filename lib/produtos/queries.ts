import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProdutoComJoins, Marca, Memoria, Cor, Condicao } from "@/lib/types";

const PRODUTO_SELECT = `
  *,
  marca:marca_id    ( id, nome ),
  memoria:memoria_id ( id, capacidade, sigla ),
  cor:cor_id        ( id, nome, hex ),
  condicao:condicao_id ( id, nome, badge )
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
  return (data ?? null) as ProdutoComJoins | null;
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
  const [prod, frete] = await Promise.all([
    sb.from("produtos").select("id", { count: "exact", head: true }).eq("ativo", true),
    sb.from("frete_faixas").select("id", { count: "exact", head: true }),
  ]);
  return {
    produtosAtivos: prod.count ?? 0,
    faixasCep: frete.count ?? 0,
  };
}
