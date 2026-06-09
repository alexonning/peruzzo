"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { OpcoesForm } from "@/lib/produtos/queries";
import type { ProdutoComJoins } from "@/lib/types";
import { createProduto, updateProduto } from "@/lib/produtos/actions";
import { ImageUploader } from "./image-uploader";

type Props = {
  opcoes: OpcoesForm;
  produto?: ProdutoComJoins;
};

export function ProdutoForm({ opcoes, produto }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [imagens, setImagens] = useState<string[]>(produto?.imagens ?? []);

  const isEdit = !!produto;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);

    const fd = new FormData(e.currentTarget);
    imagens.forEach((url) => fd.append("imagens", url));

    start(async () => {
      const result = isEdit
        ? await updateProduto(produto!.id, fd)
        : await createProduto(fd);
      if (result && !result.ok) setErr(result.error ?? "Erro ao salvar");
    });
  }

  const field = "w-full px-3.5 py-2.5 border border-cream-dark rounded-md text-sm bg-paper text-ink focus:outline-none focus:border-wine";
  const label = "block text-[11px] tracking-[1.5px] uppercase text-wine font-semibold mb-1.5";

  return (
    <form onSubmit={onSubmit} className="bg-paper border border-cream-dark rounded-xl p-8 max-w-4xl space-y-6">
      <div>
        <label className={label}>Nome do produto</label>
        <input
          name="nome"
          required
          defaultValue={produto?.nome ?? ""}
          placeholder="iPhone 16 Pro Max"
          className={field}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={label}>Marca</label>
          <select name="marca_id" defaultValue={produto?.marca_id ?? ""} className={field}>
            <option value="">—</option>
            {opcoes.marcas.map((m) => (
              <option key={m.id} value={m.id}>{m.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Memória</label>
          <select name="memoria_id" defaultValue={produto?.memoria_id ?? ""} className={field}>
            <option value="">—</option>
            {opcoes.memorias.map((m) => (
              <option key={m.id} value={m.id}>{m.capacidade}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Cor</label>
          <select name="cor_id" defaultValue={produto?.cor_id ?? ""} className={field}>
            <option value="">—</option>
            {opcoes.cores.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Condição</label>
          <select name="condicao_id" defaultValue={produto?.condicao_id ?? ""} className={field}>
            <option value="">—</option>
            {opcoes.condicoes.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={label}>Preço (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="preco"
            required
            defaultValue={produto?.preco ?? ""}
            className={field}
          />
        </div>
        <div>
          <label className={label}>Preço &quot;de&quot; (opcional)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="preco_de"
            defaultValue={produto?.preco_de ?? ""}
            className={field}
          />
        </div>
        <div>
          <label className={label}>Estoque</label>
          <input
            type="number"
            min="0"
            name="estoque"
            defaultValue={produto?.estoque ?? 1}
            className={field}
          />
        </div>
      </div>

      <div>
        <label className={label}>Descrição</label>
        <textarea
          name="descricao"
          rows={4}
          defaultValue={produto?.descricao ?? ""}
          className={`${field} resize-y`}
          placeholder="Detalhes, garantia, observações..."
        />
      </div>

      <div>
        <label className={label}>Imagens</label>
        <ImageUploader value={imagens} onChange={setImagens} />
      </div>

      <div className="flex gap-6 pt-2">
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

      {err && (
        <p className="bg-danger/10 text-danger text-sm px-4 py-2 rounded-md">{err}</p>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-cream-dark">
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
    </form>
  );
}
