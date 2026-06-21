import type { ProdutoComJoins } from "@/lib/types";
import { displayPrice, temFreteGratis } from "./pricing";

export type SortBy = "featured" | "price-asc" | "price-desc" | "name";

export type Filters = {
  search: string;
  condicoes: string[]; // condicao_id list (active)
  freteGratis: boolean;
  memorias: string[]; // memoria_id list
  precoMin: number | null;
  precoMax: number | null;
  category: string; // "all" | "lacrado-id" | "frete" | "preco-low" | "preco-mid"
};

export const EMPTY_FILTERS: Filters = {
  search: "",
  condicoes: [],
  freteGratis: false,
  memorias: [],
  precoMin: null,
  precoMax: null,
  category: "all",
};

export function activeCount(f: Filters): number {
  let n = 0;
  if (f.search) n++;
  if (f.condicoes.length) n++;
  if (f.freteGratis) n++;
  if (f.memorias.length) n++;
  if (f.precoMin != null) n++;
  if (f.precoMax != null) n++;
  return n;
}

function memoriaIdsDoProduto(p: ProdutoComJoins): string[] {
  const set = new Set<string>();
  (p.variantes ?? []).forEach((v) => {
    if (v.memoria_id) set.add(v.memoria_id);
  });
  if (p.memoria_id) set.add(p.memoria_id);
  return [...set];
}

export function applyFilters(
  produtos: ProdutoComJoins[],
  f: Filters,
): ProdutoComJoins[] {
  const q = f.search.trim().toLowerCase();
  return produtos.filter((p) => {
    // busca em nome + descricao
    if (q) {
      const haystack = `${p.nome} ${p.descricao ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    // condições
    if (f.condicoes.length > 0) {
      if (!p.condicao_id || !f.condicoes.includes(p.condicao_id)) return false;
    }
    // frete grátis
    if (f.freteGratis && !temFreteGratis(p)) return false;
    // memórias
    if (f.memorias.length > 0) {
      const ids = memoriaIdsDoProduto(p);
      if (!ids.some((id) => f.memorias.includes(id))) return false;
    }
    // preço
    const preco = displayPrice(p);
    if (f.precoMin != null && preco < f.precoMin) return false;
    if (f.precoMax != null && preco > f.precoMax) return false;
    return true;
  });
}

export function applySort(
  produtos: ProdutoComJoins[],
  by: SortBy,
): ProdutoComJoins[] {
  const arr = [...produtos];
  switch (by) {
    case "price-asc":
      return arr.sort((a, b) => displayPrice(a) - displayPrice(b));
    case "price-desc":
      return arr.sort((a, b) => displayPrice(b) - displayPrice(a));
    case "name":
      return arr.sort((a, b) =>
        a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }),
      );
    case "featured":
    default:
      return arr.sort((a, b) => {
        if (a.destaque && !b.destaque) return -1;
        if (!a.destaque && b.destaque) return 1;
        return 0;
      });
  }
}
