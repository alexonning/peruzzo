"use client";

import { cn } from "@/lib/utils";
import type { Condicao } from "@/lib/types";
import type { Filters } from "@/lib/produtos/filters";

export type Categoria = {
  id: string;
  label: string;
  apply: (current: Filters) => Filters;
};

export function buildCategorias(condicoes: Condicao[]): Categoria[] {
  const reset = (f: Filters): Filters => ({
    ...f,
    condicoes: [],
    freteGratis: false,
    precoMin: null,
    precoMax: null,
  });
  return [
    {
      id: "all",
      label: "📱 Todos os modelos",
      apply: (f) => ({ ...reset(f), category: "all" }),
    },
    ...condicoes.map((c) => ({
      id: `cond-${c.id}`,
      label: c.nome === "Lacrado" ? `✨ ${c.nome}s` : `🔄 ${c.nome}s`,
      apply: (f: Filters) => ({
        ...reset(f),
        condicoes: [c.id],
        category: `cond-${c.id}`,
      }),
    })),
    {
      id: "frete",
      label: "🚚 Frete Grátis",
      apply: (f) => ({ ...reset(f), freteGratis: true, category: "frete" }),
    },
    {
      id: "preco-low",
      label: "💰 Até R$ 2.500",
      apply: (f) => ({
        ...reset(f),
        precoMin: 0,
        precoMax: 2500,
        category: "preco-low",
      }),
    },
    {
      id: "preco-mid",
      label: "💎 R$ 2.500 – R$ 5.000",
      apply: (f) => ({
        ...reset(f),
        precoMin: 2500,
        precoMax: 5000,
        category: "preco-mid",
      }),
    },
  ];
}

export function Categories({
  categorias,
  active,
  onSelect,
}: {
  categorias: Categoria[];
  active: string;
  onSelect: (cat: Categoria) => void;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-6 pt-14 sm:pt-20">
      <p className="text-wine text-[10px] sm:text-[11px] tracking-[4px] sm:tracking-[5px] uppercase mb-3 text-center sm:text-left">
        Categorias
      </p>
      <h2 className="font-display text-charcoal text-3xl sm:text-4xl md:text-5xl font-bold text-center sm:text-left">
        Encontre o seu iPhone ideal
      </h2>

      <div className="mt-6 sm:mt-8 flex flex-wrap gap-2.5 sm:gap-3">
        {categorias.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c)}
            className={cn(
              "px-4 sm:px-5 py-2.5 rounded-full text-[12px] sm:text-[13px] font-semibold border transition-all",
              active === c.id
                ? "bg-wine text-cream border-wine shadow-[0_4px_14px_rgba(107,26,26,0.25)]"
                : "bg-paper text-charcoal border-cream-dark hover:border-wine hover:text-wine",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
    </section>
  );
}
