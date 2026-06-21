"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Tabela = "marcas" | "memorias" | "cores" | "condicoes";

async function refresh() {
  revalidatePath("/admin/cores");
  revalidatePath("/admin/produtos");
  revalidatePath("/admin/produtos/novo");
  revalidatePath("/");
}

// ── COR ──────────────────────────────────────────────
export async function addCor(fd: FormData) {
  const nome = String(fd.get("nome") ?? "").trim();
  const hex = String(fd.get("hex") ?? "#1a1a1a").trim();
  if (!nome) return;
  const sb = await createSupabaseServerClient();
  await sb.from("cores").insert({ nome, hex, ativo: true });
  await refresh();
}

// ── MEMÓRIA ──────────────────────────────────────────
export async function addMemoria(fd: FormData) {
  const capacidade = String(fd.get("capacidade") ?? "").trim();
  const sigla = String(fd.get("sigla") ?? "").trim().toLowerCase();
  if (!capacidade || !sigla) return;
  const sb = await createSupabaseServerClient();
  await sb.from("memorias").insert({ capacidade, sigla, ativo: true });
  await refresh();
}

// ── MARCA ────────────────────────────────────────────
export async function addMarca(fd: FormData) {
  const nome = String(fd.get("nome") ?? "").trim();
  if (!nome) return;
  const sb = await createSupabaseServerClient();
  await sb.from("marcas").insert({ nome, ativo: true });
  await refresh();
}

// ── CONDIÇÃO ─────────────────────────────────────────
export async function addCondicao(fd: FormData) {
  const nome = String(fd.get("nome") ?? "").trim();
  const badge = String(fd.get("badge") ?? "badge-blue").trim();
  if (!nome) return;
  const sb = await createSupabaseServerClient();
  await sb.from("condicoes").insert({ nome, badge, ativo: true });
  await refresh();
}

// ── COMUNS ───────────────────────────────────────────
export async function toggleAtivo(tabela: Tabela, id: string, ativo: boolean) {
  const sb = await createSupabaseServerClient();
  await sb.from(tabela).update({ ativo }).eq("id", id);
  await refresh();
}

export async function removerItem(tabela: Tabela, id: string) {
  const sb = await createSupabaseServerClient();
  await sb.from(tabela).delete().eq("id", id);
  await refresh();
}
