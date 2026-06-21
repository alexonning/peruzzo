"use client";

import { useState, useTransition } from "react";
import { saveCepMsg } from "@/lib/frete/actions";

export function MensagemPanel({ cepMsg }: { cepMsg: string }) {
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-paper border border-cream-dark rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-cream-dark">
        <h2 className="font-display text-lg font-semibold text-charcoal">
          Mensagem para CEP não encontrado
        </h2>
      </div>
      <form
        action={(fd) =>
          start(async () => {
            await saveCepMsg(fd);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          })
        }
        className="p-6"
      >
        <textarea
          name="cep_msg"
          rows={3}
          defaultValue={cepMsg}
          className="w-full px-3.5 py-2.5 border border-cream-dark rounded-md text-sm bg-paper focus:outline-none focus:border-wine resize-y"
        />
        <div className="flex items-center justify-end gap-3 mt-3">
          {saved && (
            <span className="text-success text-xs font-semibold">✓ Salvo</span>
          )}
          <button
            type="submit"
            disabled={pending}
            className="bg-wine text-cream px-5 py-2 rounded-md text-[11px] font-semibold tracking-[1.5px] uppercase hover:bg-wine-dark disabled:opacity-50"
          >
            {pending ? "Salvando..." : "Salvar Mensagem"}
          </button>
        </div>
      </form>
    </div>
  );
}
