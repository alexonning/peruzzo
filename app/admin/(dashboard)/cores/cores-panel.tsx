"use client";

import { useTransition } from "react";
import type { Cor } from "@/lib/types";
import { addCor } from "@/lib/variantes/actions";
import { PanelCard, RemoveBtn, ToggleAtivo, btnPrimaryCls, inputCls } from "./_shared";

export function CoresPanel({ cores }: { cores: Cor[] }) {
  const [pending, start] = useTransition();

  return (
    <PanelCard
      title="Cores"
      subtitle="Paleta dos iPhones"
      form={
        <form
          action={(fd) => start(() => addCor(fd))}
          className="flex flex-wrap items-end gap-2"
        >
          <input
            name="nome"
            required
            placeholder="Nome (ex: Titânio Preto)"
            className={`${inputCls} flex-1 min-w-[180px]`}
          />
          <input
            name="hex"
            type="color"
            defaultValue="#1a1a1a"
            className="w-12 h-9 border border-cream-dark rounded-md cursor-pointer"
          />
          <button type="submit" disabled={pending} className={btnPrimaryCls}>
            + Cor
          </button>
        </form>
      }
    >
      {cores.length === 0 ? (
        <p className="p-6 text-center text-muted text-sm">Nenhuma cor cadastrada.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-cream text-[10px] tracking-[2px] uppercase text-muted">
            <tr>
              <th className="text-left px-4 py-2.5 w-12">●</th>
              <th className="text-left px-4 py-2.5">Nome</th>
              <th className="text-left px-4 py-2.5">Hex</th>
              <th className="text-left px-4 py-2.5">Ativo</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {cores.map((c) => (
              <tr key={c.id} className="border-t border-cream-dark">
                <td className="px-4 py-2.5">
                  <span
                    className="inline-block w-5 h-5 rounded-full border border-cream-dark"
                    style={{ background: c.hex }}
                  />
                </td>
                <td className="px-4 py-2.5">{c.nome}</td>
                <td className="px-4 py-2.5 text-muted font-mono text-xs">{c.hex}</td>
                <td className="px-4 py-2.5">
                  <ToggleAtivo tabela="cores" id={c.id} ativo={c.ativo} />
                </td>
                <td className="px-4 py-2.5 text-right">
                  <RemoveBtn tabela="cores" id={c.id} label={c.nome} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PanelCard>
  );
}
