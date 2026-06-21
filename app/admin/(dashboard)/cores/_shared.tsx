"use client";

import { useTransition } from "react";
import { removerItem, toggleAtivo } from "@/lib/variantes/actions";

type Tabela = "marcas" | "memorias" | "cores" | "condicoes";

export function ToggleAtivo({
  tabela,
  id,
  ativo,
}: {
  tabela: Tabela;
  id: string;
  ativo: boolean;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => toggleAtivo(tabela, id, !ativo))}
      className={`inline-flex items-center gap-2 text-[11px] font-semibold tracking-[1px] uppercase ${
        ativo ? "text-success" : "text-muted"
      }`}
    >
      <span
        className={`w-[28px] h-[16px] rounded-full relative transition-colors ${
          ativo ? "bg-success" : "bg-cream-dark"
        }`}
      >
        <span
          className={`absolute top-[2px] w-[12px] h-[12px] rounded-full bg-white transition-all ${
            ativo ? "left-[14px]" : "left-[2px]"
          }`}
        />
      </span>
      {ativo ? "Sim" : "Não"}
    </button>
  );
}

export function RemoveBtn({
  tabela,
  id,
  label,
}: {
  tabela: Tabela;
  id: string;
  label: string;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Remover "${label}"?`)) return;
        start(() => removerItem(tabela, id));
      }}
      className="text-danger text-xs font-semibold hover:underline disabled:opacity-50"
    >
      {pending ? "..." : "Remover"}
    </button>
  );
}

export function PanelCard({
  title,
  subtitle,
  actionLabel,
  children,
  form,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  form?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-paper border border-cream-dark rounded-xl overflow-hidden flex flex-col">
      <div className="flex items-start justify-between px-6 py-4 border-b border-cream-dark gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-charcoal">{title}</h2>
          {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {form && (
        <div className="px-6 py-3 bg-cream/40 border-b border-cream-dark">{form}</div>
      )}
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export const inputCls =
  "px-2.5 py-1.5 border border-cream-dark rounded-md text-sm bg-paper focus:outline-none focus:border-wine";
export const btnPrimaryCls =
  "bg-wine text-cream px-3.5 py-1.5 rounded-md text-[11px] font-semibold tracking-[1.5px] uppercase hover:bg-wine-dark transition-colors disabled:opacity-50";
