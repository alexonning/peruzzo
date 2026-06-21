"use client";

import { useTransition } from "react";
import type { Condicao } from "@/lib/types";
import { addCondicao } from "@/lib/variantes/actions";
import { PanelCard, RemoveBtn, ToggleAtivo, btnPrimaryCls, inputCls } from "./_shared";

const BADGES = [
  { value: "badge-green", label: "Verde", color: "bg-success/15 text-success" },
  { value: "badge-blue", label: "Azul", color: "bg-info/15 text-info" },
  { value: "badge-orange", label: "Laranja", color: "bg-gold/15 text-gold" },
  { value: "badge-red", label: "Vermelho", color: "bg-danger/15 text-danger" },
];

export function CondicoesPanel({ condicoes }: { condicoes: Condicao[] }) {
  const [pending, start] = useTransition();

  return (
    <PanelCard
      title="Condições"
      form={
        <form
          action={(fd) => start(() => addCondicao(fd))}
          className="flex flex-wrap items-end gap-2"
        >
          <input
            name="nome"
            required
            placeholder="Nome (ex: Lacrado)"
            className={`${inputCls} flex-1 min-w-[150px]`}
          />
          <select name="badge" defaultValue="badge-blue" className={`${inputCls} w-[120px]`}>
            {BADGES.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
          <button type="submit" disabled={pending} className={btnPrimaryCls}>
            + Condição
          </button>
        </form>
      }
    >
      {condicoes.length === 0 ? (
        <p className="p-6 text-center text-muted text-sm">Nenhuma condição cadastrada.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-cream text-[10px] tracking-[2px] uppercase text-muted">
            <tr>
              <th className="text-left px-4 py-2.5">Nome</th>
              <th className="text-left px-4 py-2.5">Badge</th>
              <th className="text-left px-4 py-2.5">Ativo</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {condicoes.map((c) => {
              const badge = BADGES.find((b) => b.value === c.badge) ?? BADGES[1];
              return (
                <tr key={c.id} className="border-t border-cream-dark">
                  <td className="px-4 py-2.5 font-medium">{c.nome}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${badge.color}`}>
                      {c.nome}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <ToggleAtivo tabela="condicoes" id={c.id} ativo={c.ativo} />
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <RemoveBtn tabela="condicoes" id={c.id} label={c.nome} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </PanelCard>
  );
}
