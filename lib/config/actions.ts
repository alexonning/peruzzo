"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function saveConfig(fd: FormData) {
  const sb = await createSupabaseServerClient();
  const payload = {
    id: 1,
    nome: String(fd.get("nome") ?? "").trim() || "Peruzzo Imports",
    doc: String(fd.get("doc") ?? "").trim() || null,
    endereco: String(fd.get("endereco") ?? "").trim() || null,
    cidade: String(fd.get("cidade") ?? "").trim() || null,
    estado: String(fd.get("estado") ?? "").trim() || null,
    cep: String(fd.get("cep") ?? "").trim() || null,
    whatsapp: String(fd.get("whatsapp") ?? "").trim() || null,
    instagram: String(fd.get("instagram") ?? "").trim() || null,
    banner: String(fd.get("banner") ?? "").trim() || null,
    pagamentos: {
      pix: fd.get("pg_pix") === "on",
      dinheiro: fd.get("pg_dinheiro") === "on",
      credito: fd.get("pg_credito") === "on",
      debito: fd.get("pg_debito") === "on",
      boleto: fd.get("pg_boleto") === "on",
    },
  };

  const { error } = await sb.from("config").upsert(payload, { onConflict: "id" });
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/configuracoes");
  revalidatePath("/");
  return { ok: true as const };
}
