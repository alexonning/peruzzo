"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function refresh() {
  revalidatePath("/admin/frete");
  revalidatePath("/");
}

export async function addFaixa(fd: FormData) {
  const cep_inicio = String(fd.get("cep_inicio") ?? "").trim();
  const descricao = String(fd.get("descricao") ?? "").trim() || null;
  const tipo = String(fd.get("tipo") ?? "consulta") as "gratis" | "fixo" | "consulta";
  const valor = Number(fd.get("valor") ?? 0);
  if (!cep_inicio) return;
  const sb = await createSupabaseServerClient();
  await sb.from("frete_faixas").insert({ cep_inicio, descricao, tipo, valor, ativo: true });
  await refresh();
}

export async function updateFaixa(id: string, fd: FormData) {
  const cep_inicio = String(fd.get("cep_inicio") ?? "").trim();
  const descricao = String(fd.get("descricao") ?? "").trim() || null;
  const tipo = String(fd.get("tipo") ?? "consulta") as "gratis" | "fixo" | "consulta";
  const valor = Number(fd.get("valor") ?? 0);
  const sb = await createSupabaseServerClient();
  await sb.from("frete_faixas").update({ cep_inicio, descricao, tipo, valor }).eq("id", id);
  await refresh();
}

export async function removeFaixa(id: string) {
  const sb = await createSupabaseServerClient();
  await sb.from("frete_faixas").delete().eq("id", id);
  await refresh();
}

export async function saveCepMsg(fd: FormData) {
  const cep_msg = String(fd.get("cep_msg") ?? "").trim();
  const sb = await createSupabaseServerClient();
  // upsert no singleton id=1
  await sb.from("config").upsert({ id: 1, cep_msg }, { onConflict: "id" });
  await refresh();
}
