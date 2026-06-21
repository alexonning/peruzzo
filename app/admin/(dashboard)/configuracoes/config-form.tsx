"use client";

import { useState, useTransition } from "react";
import type { Config } from "@/lib/types";
import { saveConfig } from "@/lib/config/actions";

const inputCls =
  "w-full px-3.5 py-2.5 border border-cream-dark rounded-md text-sm bg-paper focus:outline-none focus:border-wine";
const labelCls =
  "block text-[11px] tracking-[1.5px] uppercase text-wine font-semibold mb-1.5";

const ESTADOS = [
  ["PR", "Paraná"],
  ["SP", "São Paulo"],
  ["SC", "Santa Catarina"],
  ["RS", "Rio Grande do Sul"],
  ["MG", "Minas Gerais"],
  ["RJ", "Rio de Janeiro"],
];

export function ConfigForm({ cfg }: { cfg: Config | null }) {
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const pg = cfg?.pagamentos ?? {
    pix: true,
    dinheiro: true,
    credito: true,
    debito: true,
    boleto: false,
  };

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const res = await saveConfig(fd);
      if (!res.ok) {
        setErr(res.error ?? "Erro ao salvar");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-paper border border-cream-dark rounded-xl p-4 sm:p-6 lg:p-8 max-w-4xl space-y-5 sm:space-y-6"
    >
      <div>
        <h2 className="font-display text-xl font-semibold text-charcoal">
          Informações da Loja
        </h2>
        <p className="text-xs text-muted mt-0.5">Dados e integrações</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Nome da loja</label>
          <input name="nome" defaultValue={cfg?.nome ?? "Peruzzo Imports"} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>CNPJ / CPF</label>
          <input
            name="doc"
            defaultValue={cfg?.doc ?? ""}
            placeholder="00.000.000/0000-00"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Endereço</label>
        <input
          name="endereco"
          defaultValue={cfg?.endereco ?? ""}
          placeholder="Rua, número – Bairro"
          className={inputCls}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Cidade</label>
          <input
            name="cidade"
            defaultValue={cfg?.cidade ?? "Cascavel"}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Estado</label>
          <select
            name="estado"
            defaultValue={cfg?.estado ?? "PR"}
            className={inputCls}
          >
            {ESTADOS.map(([sigla, nome]) => (
              <option key={sigla} value={sigla}>{nome} – {sigla}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>CEP</label>
          <input
            name="cep"
            defaultValue={cfg?.cep ?? ""}
            placeholder="85800-000"
            className={inputCls}
          />
        </div>
      </div>

      <hr className="border-cream-dark" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>
            WhatsApp <span className="text-danger">*</span>
          </label>
          <div className="flex">
            <span className="bg-cream border border-cream-dark rounded-l-md px-3 grid place-items-center text-sm text-muted">
              +55
            </span>
            <input
              name="whatsapp"
              defaultValue={cfg?.whatsapp ?? ""}
              placeholder="45999999999"
              className={`${inputCls} rounded-l-none`}
            />
          </div>
          <p className="text-[11px] text-muted mt-1">Apenas números</p>
        </div>
        <div>
          <label className={labelCls}>Instagram</label>
          <div className="flex">
            <span className="bg-cream border border-cream-dark rounded-l-md px-3 grid place-items-center text-sm text-muted">
              @
            </span>
            <input
              name="instagram"
              defaultValue={cfg?.instagram ?? "peruzzo_imports"}
              className={`${inputCls} rounded-l-none`}
            />
          </div>
        </div>
      </div>

      <div>
        <label className={labelCls}>Mensagem do topo da loja</label>
        <input
          name="banner"
          defaultValue={cfg?.banner ?? ""}
          placeholder="📍 Entregamos em Cascavel e Região"
          className={inputCls}
        />
      </div>

      <hr className="border-cream-dark" />

      <div>
        <label className={labelCls}>Métodos de Pagamento</label>
        <div className="flex flex-wrap gap-4 mt-2">
          <Toggle name="pg_pix" defaultChecked={pg.pix} label="Pix" />
          <Toggle name="pg_dinheiro" defaultChecked={pg.dinheiro} label="Dinheiro" />
          <Toggle name="pg_credito" defaultChecked={pg.credito} label="Cartão de Crédito" />
          <Toggle name="pg_debito" defaultChecked={pg.debito} label="Cartão de Débito" />
          <Toggle name="pg_boleto" defaultChecked={pg.boleto} label="Boleto" />
        </div>
      </div>

      {err && (
        <p className="bg-danger/10 text-danger text-sm px-4 py-2 rounded-md">{err}</p>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-cream-dark">
        {saved && <span className="text-success text-xs font-semibold">✓ Configurações salvas</span>}
        <button
          type="submit"
          disabled={pending}
          className="bg-wine text-cream px-6 py-2.5 rounded-md text-[12px] font-semibold tracking-[1.5px] uppercase hover:bg-wine-dark disabled:opacity-50"
        >
          {pending ? "Salvando..." : "Salvar Configurações"}
        </button>
      </div>
    </form>
  );
}

function Toggle({
  name,
  defaultChecked,
  label,
}: {
  name: string;
  defaultChecked: boolean;
  label: string;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="accent-wine"
      />
      {label}
    </label>
  );
}
