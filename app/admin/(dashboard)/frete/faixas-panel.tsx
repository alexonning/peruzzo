"use client";

import { useTransition } from "react";
import type { FreteFaixa } from "@/lib/types";
import { addFaixa, removeFaixa, updateFaixa } from "@/lib/frete/actions";
import { CurrencyInput } from "@/components/ui/currency-input";

const inputCls =
  "w-full px-2.5 py-2 border border-cream-dark rounded-md text-sm bg-paper focus:outline-none focus:border-wine";

/*
  Grid: 12 cols no desktop, 2 no tablet, 1 no mobile.
  Distribuição: CEP 3 · Descrição 4 · Tipo 2 · Valor 2 · Ações 1
  (ações 1 col porque vira só 2 ícones; sobra espaço pro Valor.)
*/
/* col-span ajustados: Valor ganha + espaço (era 2, agora 3) sem apertar Descrição (4). */
const COLS = {
  cep: "md:col-span-2",
  desc: "md:col-span-3",
  tipo: "md:col-span-2",
  valor: "md:col-span-3",
  acoes: "md:col-span-2",
};

export function FaixasPanel({ faixas }: { faixas: FreteFaixa[] }) {
  const [pending, start] = useTransition();

  return (
    <div className="bg-paper border border-cream-dark rounded-xl overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-cream-dark">
        <h2 className="font-display text-lg font-semibold text-charcoal">
          Fretes por CEP
        </h2>
        <p className="text-xs text-muted mt-0.5">Regiões cobertas</p>
      </div>

      <div className="px-4 sm:px-6 pt-4 pb-2">
        <div className="bg-cream/60 border border-cream-dark rounded-md px-3.5 py-2.5 text-[12px] text-charcoal mb-4">
          <strong>Como funciona:</strong> Cada linha cobre um CEP inicial. CEPs
          não encontrados redirecionam ao WhatsApp.
        </div>

        {/* Nova faixa */}
        <form
          action={(fd) => start(() => addFaixa(fd))}
          className="grid gap-2 mb-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-12 md:items-end"
        >
          <input
            name="cep_inicio"
            required
            placeholder="CEP (00000-000)"
            className={`${inputCls} ${COLS.cep}`}
          />
          <input
            name="descricao"
            placeholder="Descrição da região"
            className={`${inputCls} ${COLS.desc}`}
          />
          <select name="tipo" defaultValue="consulta" className={`${inputCls} ${COLS.tipo}`}>
            <option value="gratis">Grátis</option>
            <option value="fixo">Fixo</option>
            <option value="consulta">Consulta</option>
          </select>
          <CurrencyInput
            name="valor"
            defaultValue={0}
            className={COLS.valor}
            placeholder="0,00"
          />
          <button
            type="submit"
            disabled={pending}
            className={`sm:col-span-2 ${COLS.acoes} bg-wine text-cream rounded-md text-[11px] font-semibold tracking-[1px] uppercase py-2 hover:bg-wine-dark disabled:opacity-50 whitespace-nowrap`}
            aria-label="Adicionar"
            title="Adicionar"
          >
            <span className="md:hidden">+ Adicionar</span>
            <span className="hidden md:inline">+</span>
          </button>
        </form>

        {/* Header desktop only */}
        <div className="hidden md:grid grid-cols-12 gap-2 text-[10px] tracking-[2px] uppercase text-muted font-semibold border-b border-cream-dark pb-2 mb-2 px-1">
          <div className={COLS.cep}>CEP</div>
          <div className={COLS.desc}>Descrição</div>
          <div className={COLS.tipo}>Tipo</div>
          <div className={COLS.valor}>Valor</div>
          <div className={`${COLS.acoes} text-right`}>Ações</div>
        </div>

        {faixas.length === 0 ? (
          <p className="py-8 text-center text-muted text-sm">Nenhuma faixa cadastrada.</p>
        ) : (
          <ul className="pb-2 space-y-3 md:space-y-1.5">
            {faixas.map((f) => (
              <FaixaRow key={f.id} faixa={f} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function FaixaRow({ faixa }: { faixa: FreteFaixa }) {
  const [pending, start] = useTransition();

  return (
    <li className="border border-cream-dark rounded-md p-3 md:p-0 md:border-0">
      <form
        action={(fd) => start(() => updateFaixa(faixa.id, fd))}
        className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-12 md:items-center"
      >
        <label className="md:hidden text-[10px] tracking-[2px] uppercase text-muted font-semibold">CEP</label>
        <input
          name="cep_inicio"
          defaultValue={faixa.cep_inicio}
          required
          className={`${inputCls} ${COLS.cep}`}
        />
        <label className="md:hidden text-[10px] tracking-[2px] uppercase text-muted font-semibold mt-1">Descrição</label>
        <input
          name="descricao"
          defaultValue={faixa.descricao ?? ""}
          placeholder="Descrição"
          className={`${inputCls} ${COLS.desc}`}
        />
        <label className="md:hidden text-[10px] tracking-[2px] uppercase text-muted font-semibold mt-1">Tipo</label>
        <select name="tipo" defaultValue={faixa.tipo} className={`${inputCls} ${COLS.tipo}`}>
          <option value="gratis">Grátis</option>
          <option value="fixo">Fixo</option>
          <option value="consulta">Consulta</option>
        </select>
        <label className="md:hidden text-[10px] tracking-[2px] uppercase text-muted font-semibold mt-1">Valor</label>
        <CurrencyInput
          name="valor"
          defaultValue={faixa.valor}
          className={COLS.valor}
        />

        {/* Ações: texto cheio no mobile, ícones compactos no desktop */}
        <div
          className={`flex gap-1.5 sm:col-span-2 ${COLS.acoes} md:justify-end mt-1 md:mt-0`}
        >
          <button
            type="submit"
            disabled={pending}
            aria-label="Salvar alterações"
            title="Salvar"
            className="flex-1 md:flex-none flex items-center justify-center bg-success/10 text-success font-semibold py-2 md:py-1.5 px-3 md:px-2 rounded-md hover:bg-success/20 disabled:opacity-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 md:w-[15px] md:h-[15px]"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="ml-1.5 text-[11px] tracking-[1px] uppercase md:hidden">
              Salvar
            </span>
          </button>
          <button
            type="button"
            disabled={pending}
            aria-label="Remover faixa"
            title="Remover"
            onClick={() => {
              if (confirm(`Remover faixa "${faixa.cep_inicio}"?`)) {
                start(() => removeFaixa(faixa.id));
              }
            }}
            className="flex-1 md:flex-none flex items-center justify-center bg-danger/10 text-danger font-semibold py-2 md:py-1.5 px-3 md:px-2 rounded-md hover:bg-danger/20 disabled:opacity-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 md:w-[15px] md:h-[15px]"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
            <span className="ml-1.5 text-[11px] tracking-[1px] uppercase md:hidden">
              Remover
            </span>
          </button>
        </div>
      </form>
    </li>
  );
}
