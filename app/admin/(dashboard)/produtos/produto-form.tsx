"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { OpcoesForm } from "@/lib/produtos/queries";
import type { ProdutoComJoins, ProdutoVariante } from "@/lib/types";
import { createProduto, updateProduto } from "@/lib/produtos/actions";
import { PhotoUploader } from "./photo-uploader";
import { VariantesEditor, type VarianteDraft } from "./variantes-editor";
import { cn } from "@/lib/utils";

type Props = {
  opcoes: OpcoesForm;
  produto?: ProdutoComJoins;
};

const TABS = [
  { id: "info", label: "① Informações" },
  { id: "fotos", label: "② Fotos" },
  { id: "variantes", label: "③ Variantes & Preços" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const inputCls =
  "w-full px-3 py-2.5 border border-cream-dark rounded-md text-sm bg-paper focus:outline-none focus:border-wine";
const labelCls =
  "block text-[11px] tracking-[1.5px] uppercase text-wine font-semibold mb-1.5";

function variantesFromProduto(v?: ProdutoVariante[]): VarianteDraft[] {
  if (!v) return [];
  return v.map((x) => ({
    id: x.id,
    clientId:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2),
    cor_id: x.cor_id,
    memoria_id: x.memoria_id,
    preco: x.preco != null ? Number(x.preco) : null,
    preco_de: x.preco_de != null ? Number(x.preco_de) : null,
    preco_vista: Number(x.preco_vista),
    preco_cartao: x.preco_cartao != null ? Number(x.preco_cartao) : null,
    parcelas_sem_juros: x.parcelas_sem_juros,
    parcelas_com_juros: x.parcelas_com_juros,
    frete_gratis: x.frete_gratis,
    estoque: x.estoque,
  }));
}

export function ProdutoForm({ opcoes, produto }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>("info");
  const [imagens, setImagens] = useState<string[]>(produto?.imagens ?? []);
  const [variantes, setVariantes] = useState<VarianteDraft[]>(
    variantesFromProduto(produto?.variantes),
  );

  const isEdit = !!produto;

  // soma total de estoque das variantes (fallback pro campo do produto)
  const estoqueTotal = variantes.reduce((s, v) => s + (v.estoque || 0), 0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);

    if (imagens.length > 8) {
      setErr("Máximo 8 fotos por produto.");
      setTab("fotos");
      return;
    }

    const fd = new FormData(e.currentTarget);
    imagens.forEach((url) => fd.append("imagens", url));
    fd.set(
      "__variantes",
      JSON.stringify(
        variantes.map((v) => ({
          id: v.id,
          cor_id: v.cor_id,
          memoria_id: v.memoria_id,
          preco: v.preco,
          preco_de: v.preco_de,
          preco_vista: v.preco_vista,
          preco_cartao: v.preco_cartao,
          parcelas_sem_juros: v.parcelas_sem_juros,
          parcelas_com_juros: v.parcelas_com_juros,
          frete_gratis: v.frete_gratis,
          estoque: v.estoque,
        })),
      ),
    );
    // estoque do produto = soma das variantes (ou o que tiver no input)
    if (variantes.length > 0) fd.set("estoque", String(estoqueTotal));

    start(async () => {
      const result = isEdit
        ? await updateProduto(produto!.id, fd)
        : await createProduto(fd);
      if (result && !result.ok) setErr(result.error ?? "Erro ao salvar");
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-paper border border-cream-dark rounded-xl overflow-hidden max-w-7xl"
    >
      {/* Tabs */}
      <div className="flex border-b border-cream-dark bg-cream/40 overflow-x-auto">
        {TABS.map((t) => {
          const active = tab === t.id;
          // Badge com contagem na aba de variantes
          let suffix = "";
          if (t.id === "fotos" && imagens.length > 0) suffix = ` (${imagens.length})`;
          if (t.id === "variantes" && variantes.length > 0)
            suffix = ` (${variantes.length})`;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "px-4 sm:px-6 py-3 text-[12px] font-semibold tracking-[1px] uppercase whitespace-nowrap border-b-[3px] transition-colors",
                active
                  ? "text-wine border-wine bg-paper"
                  : "text-muted border-transparent hover:text-charcoal",
              )}
            >
              {t.label}
              {suffix}
            </button>
          );
        })}
      </div>

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ─── INFORMAÇÕES ─── */}
        <div className={cn(tab === "info" ? "block space-y-5" : "hidden")}>
          <div className="grid gap-4 sm:grid-cols-12">
            <div className="sm:col-span-7">
              <label className={labelCls}>Nome do produto</label>
              <input
                name="nome"
                required
                defaultValue={produto?.nome ?? ""}
                placeholder="iPhone 16 Pro Max"
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-5">
              <label className={labelCls}>Marca</label>
              <select
                name="marca_id"
                defaultValue={produto?.marca_id ?? ""}
                className={inputCls}
              >
                <option value="">—</option>
                {opcoes.marcas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-12">
            <div className="sm:col-span-8">
              <label className={labelCls}>Condição</label>
              <select
                name="condicao_id"
                defaultValue={produto?.condicao_id ?? ""}
                className={inputCls}
              >
                <option value="">—</option>
                {opcoes.condicoes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-4">
              <label className={labelCls}>Estoque base</label>
              <input
                type="number"
                step={1}
                min={0}
                name="estoque"
                defaultValue={produto?.estoque ?? 1}
                disabled={variantes.length > 0}
                className={cn(
                  inputCls,
                  "text-right tabular-nums",
                  variantes.length > 0 && "opacity-50 cursor-not-allowed",
                )}
              />
              <p className="text-[11px] text-muted mt-1">
                {variantes.length > 0
                  ? `Soma das variantes: ${estoqueTotal}`
                  : "Usado quando não há variantes"}
              </p>
            </div>
          </div>

          <div>
            <label className={labelCls}>Descrição</label>
            <textarea
              name="descricao"
              rows={4}
              defaultValue={produto?.descricao ?? ""}
              className={`${inputCls} resize-y`}
              placeholder="Detalhes, garantia, observações..."
            />
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="ativo"
                defaultChecked={produto?.ativo ?? true}
                className="accent-wine"
              />
              Ativo na vitrine
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="destaque"
                defaultChecked={produto?.destaque ?? false}
                className="accent-wine"
              />
              Destaque
            </label>
          </div>
        </div>

        {/* ─── FOTOS ─── */}
        <div className={cn(tab === "fotos" ? "block" : "hidden")}>
          <label className={labelCls}>Fotos do produto (até 8)</label>
          <PhotoUploader value={imagens} onChange={setImagens} />
        </div>

        {/* ─── VARIANTES & PREÇOS ─── */}
        <div className={cn(tab === "variantes" ? "block" : "hidden")}>
          <VariantesEditor
            variantes={variantes}
            onChange={setVariantes}
            cores={opcoes.cores}
            memorias={opcoes.memorias}
          />
        </div>

        {err && (
          <p className="bg-danger/10 text-danger text-sm px-4 py-2 rounded-md">
            {err}
          </p>
        )}

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-cream-dark">
          <button
            type="button"
            onClick={() => router.push("/admin/produtos")}
            className="px-5 py-2.5 rounded-md text-[12px] font-semibold tracking-[1.5px] uppercase border border-cream-dark text-muted hover:bg-cream"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={pending}
            className="bg-wine text-cream px-6 py-2.5 rounded-md text-[12px] font-semibold tracking-[1.5px] uppercase hover:bg-wine-dark transition-colors disabled:opacity-50"
          >
            {pending ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar produto"}
          </button>
        </div>
      </div>
    </form>
  );
}
