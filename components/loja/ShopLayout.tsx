"use client";

import { useMemo, useState } from "react";
import type { Condicao, Memoria, ProdutoComJoins } from "@/lib/types";
import {
  applyFilters,
  applySort,
  activeCount,
  EMPTY_FILTERS,
  type Filters,
  type SortBy,
} from "@/lib/produtos/filters";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";
import { FilterDrawer } from "./FilterDrawer";
import { ProductsToolbar } from "./ProductsToolbar";
import { Categories, buildCategorias } from "./Categories";

export function ShopLayout({
  produtos,
  condicoes,
  memorias,
}: {
  produtos: ProdutoComJoins[];
  condicoes: Condicao[];
  memorias: Memoria[];
}) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortBy>("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<ProdutoComJoins | null>(null);

  const categorias = useMemo(() => buildCategorias(condicoes), [condicoes]);

  const visiveis = useMemo(
    () => applySort(applyFilters(produtos, filters), sort),
    [produtos, filters, sort],
  );

  const activeFilters = activeCount(filters);

  return (
    <>
      <Categories
        categorias={categorias}
        active={filters.category}
        onSelect={(c) => setFilters(c.apply(filters))}
      />

      <section
        id="produtos"
        className="mx-auto max-w-6xl px-5 sm:px-6 py-10 sm:py-14"
      >
        <ProductsToolbar
          count={visiveis.length}
          sort={sort}
          onSort={setSort}
          onOpenFilter={() => setDrawerOpen(true)}
          activeFilters={activeFilters}
        />

        {visiveis.length === 0 ? (
          <div className="bg-paper border border-cream-dark rounded-xl p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <p className="font-display text-xl sm:text-2xl text-charcoal mb-2">
              Nenhum produto encontrado
            </p>
            <p className="text-muted text-sm mb-5">
              Ajuste os filtros ou explore outras categorias.
            </p>
            <button
              type="button"
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="bg-wine text-cream uppercase tracking-[1.5px] text-[11px] font-semibold px-5 py-2.5 rounded-md hover:bg-wine-dark"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5 grid-cols-[repeat(auto-fill,minmax(220px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
            {visiveis.map((p) => (
              <ProductCard
                key={p.id}
                produto={p}
                onClick={() => setSelected(p)}
              />
            ))}
          </div>
        )}
      </section>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initial={filters}
        onApply={setFilters}
        condicoes={condicoes}
        memorias={memorias}
      />

      <ProductModal
        produto={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
