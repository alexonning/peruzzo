"use client";

import type { SortBy } from "@/lib/produtos/filters";

export function ProductsToolbar({
  count,
  sort,
  onSort,
  onOpenFilter,
  activeFilters,
}: {
  count: number;
  sort: SortBy;
  onSort: (s: SortBy) => void;
  onOpenFilter: () => void;
  activeFilters: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenFilter}
          className="flex items-center gap-2 bg-paper border border-cream-dark px-4 py-2.5 rounded-md text-[12px] font-semibold tracking-[1.5px] uppercase text-charcoal hover:border-wine hover:text-wine transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          Filtros
          {activeFilters > 0 && (
            <span className="ml-1 bg-wine text-cream text-[10px] rounded-full w-5 h-5 grid place-items-center font-bold tabular-nums">
              {activeFilters}
            </span>
          )}
        </button>

        <p className="text-sm text-muted">
          <strong className="text-charcoal tabular-nums">{count}</strong>{" "}
          {count === 1 ? "produto encontrado" : "produtos encontrados"}
        </p>
      </div>

      <select
        value={sort}
        onChange={(e) => onSort(e.target.value as SortBy)}
        className="bg-paper border border-cream-dark px-3.5 py-2.5 rounded-md text-sm text-charcoal focus:outline-none focus:border-wine cursor-pointer"
        aria-label="Ordenar produtos"
      >
        <option value="featured">Mais Relevantes</option>
        <option value="price-asc">Menor Preço</option>
        <option value="price-desc">Maior Preço</option>
        <option value="name">Nome A-Z</option>
      </select>
    </div>
  );
}
