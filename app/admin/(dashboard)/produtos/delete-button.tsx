"use client";

import { useTransition } from "react";
import { deleteProduto } from "@/lib/produtos/actions";

export function DeleteButton({ id, nome }: { id: string; nome: string }) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Excluir "${nome}"? Essa ação não pode ser desfeita.`)) return;
        start(() => deleteProduto(id));
      }}
      className="text-danger text-xs uppercase tracking-[1.5px] font-semibold hover:underline disabled:opacity-50"
    >
      {pending ? "Excluindo..." : "Excluir"}
    </button>
  );
}
