"use client";

import { useTransition } from "react";
import type { Marca } from "@/lib/types";
import { addMarca } from "@/lib/variantes/actions";
import { PanelCard, RemoveBtn, ToggleAtivo, btnPrimaryCls, inputCls } from "./_shared";

export function MarcasPanel({ marcas }: { marcas: Marca[] }) {
  const [pending, start] = useTransition();

  return (
    <PanelCard
      title="Marcas"
      form={
        <form
          action={(fd) => start(() => addMarca(fd))}
          className="flex flex-wrap items-end gap-2"
        >
          <input
            name="nome"
            required
            placeholder="Nome (ex: Apple)"
            className={`${inputCls} flex-1 min-w-[180px]`}
          />
          <button type="submit" disabled={pending} className={btnPrimaryCls}>
            + Marca
          </button>
        </form>
      }
    >
      {marcas.length === 0 ? (
        <p className="p-6 text-center text-muted text-sm">Nenhuma marca cadastrada.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-cream text-[10px] tracking-[2px] uppercase text-muted">
            <tr>
              <th className="text-left px-4 py-2.5">Nome</th>
              <th className="text-left px-4 py-2.5">Ativo</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {marcas.map((m) => (
              <tr key={m.id} className="border-t border-cream-dark">
                <td className="px-4 py-2.5 font-medium">{m.nome}</td>
                <td className="px-4 py-2.5">
                  <ToggleAtivo tabela="marcas" id={m.id} ativo={m.ativo} />
                </td>
                <td className="px-4 py-2.5 text-right">
                  <RemoveBtn tabela="marcas" id={m.id} label={m.nome} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PanelCard>
  );
}
