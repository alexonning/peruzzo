"use client";

import { useState } from "react";
import type { Cor, Memoria } from "@/lib/types";
import { CurrencyInput } from "@/components/ui/currency-input";

export type VarianteDraft = {
  id?: string;
  clientId: string;
  cor_id: string | null;
  memoria_id: string | null;
  preco: number | null;
  preco_de: number | null;
  preco_vista: number;
  preco_cartao: number | null;
  parcelas_sem_juros: number;
  parcelas_com_juros: number;
  frete_gratis: boolean;
  estoque: number;
};

const inputCls =
  "w-full px-2.5 py-2 border border-cream-dark rounded-md text-sm bg-paper focus:outline-none focus:border-wine";
const labelCls =
  "block text-[10px] tracking-[1.5px] uppercase text-muted font-semibold mb-1";

export function VariantesEditor({
  variantes,
  onChange,
  cores,
  memorias,
}: {
  variantes: VarianteDraft[];
  onChange: (v: VarianteDraft[]) => void;
  cores: Cor[];
  memorias: Memoria[];
}) {
  const [corId, setCorId] = useState<string>(cores[0]?.id ?? "");
  const [memId, setMemId] = useState<string>(memorias[0]?.id ?? "");

  function add() {
    if (!corId || !memId) {
      alert("Selecione cor e memória.");
      return;
    }
    const jaExiste = variantes.some(
      (v) => v.cor_id === corId && v.memoria_id === memId,
    );
    if (jaExiste) {
      alert("Essa combinação cor+memória já está cadastrada.");
      return;
    }
    onChange([
      ...variantes,
      {
        clientId:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2),
        cor_id: corId,
        memoria_id: memId,
        preco: null,
        preco_de: null,
        preco_vista: 0,
        preco_cartao: null,
        parcelas_sem_juros: 1,
        parcelas_com_juros: 12,
        frete_gratis: false,
        estoque: 1,
      },
    ]);
  }

  function patch(clientId: string, p: Partial<VarianteDraft>) {
    onChange(
      variantes.map((v) => (v.clientId === clientId ? { ...v, ...p } : v)),
    );
  }

  function remove(clientId: string) {
    if (!confirm("Remover essa variante?")) return;
    onChange(variantes.filter((v) => v.clientId !== clientId));
  }

  const corById = new Map(cores.map((c) => [c.id, c]));
  const memById = new Map(memorias.map((m) => [m.id, m]));

  return (
    <div className="space-y-4">
      {/* Adicionar variante */}
      <div className="border border-cream-dark rounded-md bg-cream/40 p-4">
        <p className={labelCls}>Adicionar combinação</p>
        <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
          <div className="sm:col-span-5">
            <label className={labelCls}>Cor</label>
            <select
              value={corId}
              onChange={(e) => setCorId(e.target.value)}
              className={inputCls}
            >
              {cores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-5">
            <label className={labelCls}>Memória</label>
            <select
              value={memId}
              onChange={(e) => setMemId(e.target.value)}
              className={inputCls}
            >
              {memorias.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.capacidade}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={add}
            className="sm:col-span-2 bg-wine text-cream rounded-md text-[11px] font-semibold tracking-[1px] uppercase py-2.5 hover:bg-wine-dark"
          >
            + Adicionar
          </button>
        </div>
        {(cores.length === 0 || memorias.length === 0) && (
          <p className="text-[12px] text-muted mt-2">
            Cadastre cores e memórias em{" "}
            <a
              href="/admin/cores"
              className="text-wine underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cores &amp; Variantes
            </a>{" "}
            antes de adicionar.
          </p>
        )}
      </div>

      {/* Lista de variantes */}
      {variantes.length === 0 ? (
        <p className="text-center text-muted text-sm py-8 border border-dashed border-cream-dark rounded-md">
          Nenhuma variante cadastrada. Cada combinação cor + memória tem o
          próprio preço, parcelas e frete.
        </p>
      ) : (
        <div className="space-y-3">
          {variantes.map((v) => {
            const cor = v.cor_id ? corById.get(v.cor_id) : null;
            const mem = v.memoria_id ? memById.get(v.memoria_id) : null;
            return (
              <div
                key={v.clientId}
                className="border border-cream-dark rounded-md bg-paper p-4 space-y-3"
              >
                {/* Cabeçalho */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    {cor && (
                      <span className="flex items-center gap-1.5 text-sm">
                        <span
                          className="w-4 h-4 rounded-full border border-cream-dark"
                          style={{ background: cor.hex }}
                        />
                        <span className="font-medium">{cor.nome}</span>
                      </span>
                    )}
                    {mem && (
                      <span className="text-sm text-muted">
                        · {mem.capacidade}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(v.clientId)}
                    className="text-danger text-xs font-semibold hover:underline"
                  >
                    Remover variante
                  </button>
                </div>

                {/* Preços — 4 colunas em md+, 2 em sm, 1 em mobile */}
                <div>
                  <p className="text-[10px] tracking-[1.5px] uppercase text-wine font-semibold mb-2">
                    Preços
                  </p>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                    <div>
                      <label className={labelCls}>Preço &quot;de&quot; (riscado)</label>
                      <CurrencyInput
                        defaultValue={v.preco_de ?? 0}
                        onValueChange={(n) =>
                          patch(v.clientId, { preco_de: n || null })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Preço base (por)</label>
                      <CurrencyInput
                        defaultValue={v.preco ?? 0}
                        onValueChange={(n) =>
                          patch(v.clientId, { preco: n || null })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelCls}>À vista (Pix)</label>
                      <CurrencyInput
                        defaultValue={v.preco_vista}
                        onValueChange={(n) =>
                          patch(v.clientId, { preco_vista: n })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelCls}>No cartão</label>
                      <CurrencyInput
                        defaultValue={v.preco_cartao ?? 0}
                        onValueChange={(n) =>
                          patch(v.clientId, { preco_cartao: n || null })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Parcelas + estoque + frete grátis */}
                <div>
                  <p className="text-[10px] tracking-[1.5px] uppercase text-wine font-semibold mb-2">
                    Parcelamento e estoque
                  </p>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                    <div>
                      <label className={labelCls}>Parcelas s/ juros (até)</label>
                      <input
                        type="number"
                        min={1}
                        max={24}
                        step={1}
                        value={v.parcelas_sem_juros}
                        onChange={(e) =>
                          patch(v.clientId, {
                            parcelas_sem_juros: Math.max(1, Number(e.target.value || 1)),
                          })
                        }
                        className={`${inputCls} text-right tabular-nums`}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Parcelas c/ juros (até)</label>
                      <input
                        type="number"
                        min={0}
                        max={24}
                        step={1}
                        value={v.parcelas_com_juros}
                        onChange={(e) =>
                          patch(v.clientId, {
                            parcelas_com_juros: Math.max(0, Number(e.target.value || 0)),
                          })
                        }
                        className={`${inputCls} text-right tabular-nums`}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Estoque</label>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={v.estoque}
                        onChange={(e) =>
                          patch(v.clientId, {
                            estoque: Math.max(0, Number(e.target.value || 0)),
                          })
                        }
                        className={`${inputCls} text-right tabular-nums`}
                      />
                    </div>
                    <label className="flex items-end gap-2 text-sm pb-2 pt-5">
                      <input
                        type="checkbox"
                        checked={v.frete_gratis}
                        onChange={(e) =>
                          patch(v.clientId, { frete_gratis: e.target.checked })
                        }
                        className="accent-wine w-4 h-4"
                      />
                      Frete grátis
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
