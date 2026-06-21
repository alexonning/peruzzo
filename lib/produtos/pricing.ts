import type { ProdutoComJoins, ProdutoVarianteComJoins } from "@/lib/types";

/** Pega a variante ativa de menor preço à vista — fonte de verdade pra exibição. */
export function pickDisplayVariant(
  produto: ProdutoComJoins,
): ProdutoVarianteComJoins | null {
  const ativas = (produto.variantes ?? []).filter((v) => v.ativo);
  if (ativas.length === 0) return null;
  return ativas.reduce((min, v) =>
    Number(v.preco_vista) < Number(min.preco_vista) ? v : min,
  );
}

/**
 * Preço de exibição.
 * - Se há variantes ativas → preço à vista da mais barata
 * - Senão → produtos.preco (legado / fallback)
 */
export function displayPrice(produto: ProdutoComJoins): number {
  const v = pickDisplayVariant(produto);
  if (v) return Number(v.preco_vista);
  return Number(produto.preco ?? 0);
}

/** Preço "de" (riscado) — só se existe e é maior que o preco_vista atual. */
export function displayPrecoDe(produto: ProdutoComJoins): number | null {
  const v = pickDisplayVariant(produto);
  const candidate = v?.preco_de ?? produto.preco_de;
  if (candidate == null) return null;
  const c = Number(candidate);
  if (!isFinite(c)) return null;
  if (c <= displayPrice(produto)) return null;
  return c;
}

/** Parcelas de exibição para card/modal. */
export function installments(
  variante: ProdutoVarianteComJoins | null,
): { n: number; value: number } | null {
  if (!variante) return null;
  const n = variante.parcelas_sem_juros ?? 1;
  if (n <= 1) return null;
  const total = Number(
    variante.preco_cartao ?? variante.preco ?? variante.preco_vista,
  );
  if (!total) return null;
  return { n, value: total / n };
}

export function temFreteGratis(produto: ProdutoComJoins): boolean {
  return (produto.variantes ?? []).some((v) => v.frete_gratis && v.ativo);
}

/**
 * Tabela completa de parcelas para o modal.
 *
 * Regra (definida pelo usuário):
 *  - 1x: preco_vista (à vista no Pix)
 *  - 2x: preco_vista / 2 (ainda considerado à vista)
 *  - 3x até parcelas_sem_juros: preco_cartao / N (sem juros)
 *  - parcelas_sem_juros+1 até parcelas_com_juros: parcelas com juros
 *
 * Taxa de juros: 1,99% a.m. (padrão Mercado Livre para cartão).
 * Fórmula PMT = PV * i / (1 - (1+i)^-n).
 */
export type Parcela = {
  n: number;
  value: number;
  total: number;
  juros: boolean;
};

const TAXA_MENSAL = 0.0199;

export function installmentsList(
  variante: ProdutoVarianteComJoins | null,
): Parcela[] {
  if (!variante) return [];
  const semJuros = Math.max(1, variante.parcelas_sem_juros ?? 1);
  const comJuros = Math.max(0, variante.parcelas_com_juros ?? 0);
  const vista = Number(variante.preco_vista) || 0;
  const cartao = Number(
    variante.preco_cartao ?? variante.preco ?? variante.preco_vista ?? 0,
  );

  const list: Parcela[] = [];

  // 1x e 2x usam preco_vista
  list.push({ n: 1, value: vista, total: vista, juros: false });
  if (semJuros >= 2 && vista > 0) {
    list.push({ n: 2, value: vista / 2, total: vista, juros: false });
  }

  // 3x até semJuros usam preco_cartao
  for (let n = 3; n <= semJuros; n++) {
    if (cartao > 0) {
      list.push({ n, value: cartao / n, total: cartao, juros: false });
    }
  }

  // Com juros
  for (let n = semJuros + 1; n <= comJuros; n++) {
    if (cartao > 0) {
      const pmt = (cartao * TAXA_MENSAL) / (1 - Math.pow(1 + TAXA_MENSAL, -n));
      list.push({ n, value: pmt, total: pmt * n, juros: true });
    }
  }

  return list;
}
