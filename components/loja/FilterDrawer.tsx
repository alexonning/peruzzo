"use client";

import { useEffect, useState } from "react";
import type { Condicao, Memoria } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { Filters } from "@/lib/produtos/filters";

export function FilterDrawer({
  open,
  onClose,
  initial,
  onApply,
  condicoes,
  memorias,
}: {
  open: boolean;
  onClose: () => void;
  initial: Filters;
  onApply: (f: Filters) => void;
  condicoes: Condicao[];
  memorias: Memoria[];
}) {
  const [draft, setDraft] = useState<Filters>(initial);

  useEffect(() => {
    if (open) setDraft(initial);
  }, [open, initial]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function toggle<T extends string>(arr: T[], v: T): T[] {
    return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
  }

  function clear() {
    setDraft({
      ...draft,
      condicoes: [],
      freteGratis: false,
      memorias: [],
      precoMin: null,
      precoMax: null,
      category: "all",
    });
  }

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />
      <aside
        role="dialog"
        aria-label="Filtros"
        aria-hidden={!open}
        className={cn(
          "fixed z-50 bg-paper shadow-2xl flex flex-col",
          // mobile: bottom sheet
          "inset-x-0 bottom-0 max-h-[90dvh] rounded-t-2xl",
          // desktop: right drawer
          "sm:top-0 sm:right-0 sm:bottom-0 sm:left-auto sm:w-[380px] sm:max-h-none sm:rounded-none sm:rounded-l-2xl",
          "transition-transform duration-300 ease-out",
          open
            ? "translate-y-0 sm:translate-y-0 sm:translate-x-0"
            : "translate-y-full sm:translate-y-0 sm:translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-wine text-cream rounded-t-2xl sm:rounded-t-none sm:rounded-tl-2xl">
          <h3 className="font-display text-lg font-semibold">Filtros</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar filtros"
            className="bg-cream/15 hover:bg-cream/25 rounded-full w-9 h-9 grid place-items-center text-cream"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Condição */}
          {condicoes.length > 0 && (
            <Group title="Condição">
              {condicoes.map((c) => (
                <Check
                  key={c.id}
                  checked={draft.condicoes.includes(c.id)}
                  onChange={() =>
                    setDraft({
                      ...draft,
                      condicoes: toggle(draft.condicoes, c.id),
                    })
                  }
                  label={c.nome}
                />
              ))}
            </Group>
          )}

          {/* Frete */}
          <Group title="Frete">
            <Check
              checked={draft.freteGratis}
              onChange={() =>
                setDraft({ ...draft, freteGratis: !draft.freteGratis })
              }
              label="🚚 Frete grátis"
            />
          </Group>

          {/* Preço */}
          <Group title="Faixa de preço">
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                placeholder="Mín R$"
                value={draft.precoMin ?? ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    precoMin: e.target.value === "" ? null : Number(e.target.value),
                  })
                }
                className="flex-1 px-3 py-2 border border-cream-dark rounded-md text-sm focus:outline-none focus:border-wine bg-paper"
              />
              <span className="text-muted text-sm">—</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="Máx R$"
                value={draft.precoMax ?? ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    precoMax: e.target.value === "" ? null : Number(e.target.value),
                  })
                }
                className="flex-1 px-3 py-2 border border-cream-dark rounded-md text-sm focus:outline-none focus:border-wine bg-paper"
              />
            </div>
          </Group>

          {/* Armazenamento */}
          {memorias.length > 0 && (
            <Group title="Armazenamento">
              {memorias.map((m) => (
                <Check
                  key={m.id}
                  checked={draft.memorias.includes(m.id)}
                  onChange={() =>
                    setDraft({
                      ...draft,
                      memorias: toggle(draft.memorias, m.id),
                    })
                  }
                  label={m.capacidade}
                />
              ))}
            </Group>
          )}
        </div>

        <div className="border-t border-cream-dark p-4 flex gap-3">
          <button
            type="button"
            onClick={clear}
            className="flex-1 border border-cream-dark text-charcoal py-2.5 rounded-md text-[12px] font-semibold tracking-[1.5px] uppercase hover:bg-cream transition-colors"
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="flex-1 bg-wine text-cream py-2.5 rounded-md text-[12px] font-semibold tracking-[1.5px] uppercase hover:bg-wine-dark transition-colors"
          >
            Aplicar
          </button>
        </div>
      </aside>
    </>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] tracking-[2px] uppercase text-wine font-semibold mb-2.5">
        {title}
      </p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Check({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-charcoal cursor-pointer py-1 hover:text-wine">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-wine w-4 h-4"
      />
      {label}
    </label>
  );
}
