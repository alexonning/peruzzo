"use client";

import { useTransition } from "react";
import type { Memoria } from "@/lib/types";
import { addMemoria } from "@/lib/variantes/actions";
import { PanelCard, RemoveBtn, ToggleAtivo, btnPrimaryCls, inputCls } from "./_shared";

export function MemoriasPanel({ memorias }: { memorias: Memoria[] }) {
  const [pending, start] = useTransition();

  return (
    <PanelCard
      title="Memórias"
      subtitle="Capacidades de armazenamento"
      form={
        <form
          action={(fd) => start(() => addMemoria(fd))}
          className="flex flex-wrap items-end gap-2"
        >
          <input
            name="capacidade"
            required
            placeholder="Capacidade (ex: 128 GB)"
            className={`${inputCls} flex-1 min-w-[150px]`}
          />
          <input
            name="sigla"
            required
            placeholder="Sigla (ex: 128gb)"
            className={`${inputCls} w-[120px]`}
          />
          <button type="submit" disabled={pending} className={btnPrimaryCls}>
            + Memória
          </button>
        </form>
      }
    >
      {memorias.length === 0 ? (
        <p className="p-6 text-center text-muted text-sm">Nenhuma memória cadastrada.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-cream text-[10px] tracking-[2px] uppercase text-muted">
            <tr>
              <th className="text-left px-4 py-2.5">Capacidade</th>
              <th className="text-left px-4 py-2.5">Sigla</th>
              <th className="text-left px-4 py-2.5">Ativo</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {memorias.map((m) => (
              <tr key={m.id} className="border-t border-cream-dark">
                <td className="px-4 py-2.5 font-medium">{m.capacidade}</td>
                <td className="px-4 py-2.5 text-muted font-mono text-xs">{m.sigla}</td>
                <td className="px-4 py-2.5">
                  <ToggleAtivo tabela="memorias" id={m.id} ativo={m.ativo} />
                </td>
                <td className="px-4 py-2.5 text-right">
                  <RemoveBtn tabela="memorias" id={m.id} label={m.capacidade} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PanelCard>
  );
}
