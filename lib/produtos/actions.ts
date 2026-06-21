"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  produtoFromFormData,
  produtoSchema,
  variantesArraySchema,
} from "./schema";

type ActionResult = { ok: boolean; error?: string };

function parseVariantesFromFD(fd: FormData) {
  const raw = String(fd.get("__variantes") ?? "[]");
  try {
    const parsed = JSON.parse(raw);
    return variantesArraySchema.safeParse(parsed);
  } catch (e) {
    return {
      success: false as const,
      error: { issues: [{ message: "JSON de variantes inválido" }] },
    };
  }
}

export async function createProduto(formData: FormData): Promise<ActionResult> {
  const parsed = produtoSchema.safeParse(produtoFromFormData(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const variantesResult = parseVariantesFromFD(formData);
  if (!variantesResult.success) {
    return {
      ok: false,
      error:
        "Variantes inválidas: " +
        (variantesResult.error?.issues?.[0]?.message ?? "verifique os campos"),
    };
  }

  const sb = await createSupabaseServerClient();
  const { data: produto, error } = await sb
    .from("produtos")
    .insert(parsed.data)
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };

  if (variantesResult.data.length > 0) {
    const toInsert = variantesResult.data.map((v) => ({
      produto_id: produto.id,
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
    }));
    const { error: vErr } = await sb.from("produto_variantes").insert(toInsert);
    if (vErr) return { ok: false, error: `Variantes: ${vErr.message}` };
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/");
  redirect("/admin/produtos");
}

export async function updateProduto(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = produtoSchema.safeParse(produtoFromFormData(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const variantesResult = parseVariantesFromFD(formData);
  if (!variantesResult.success) {
    return {
      ok: false,
      error:
        "Variantes inválidas: " +
        (variantesResult.error?.issues?.[0]?.message ?? "verifique os campos"),
    };
  }

  const sb = await createSupabaseServerClient();
  const { error } = await sb.from("produtos").update(parsed.data).eq("id", id);
  if (error) return { ok: false, error: error.message };

  // Estratégia: deletar todas as variantes do produto e re-inserir.
  // Simples e correto; produto_variantes não tem dependências externas.
  const { error: delErr } = await sb
    .from("produto_variantes")
    .delete()
    .eq("produto_id", id);
  if (delErr) return { ok: false, error: `Limpar variantes: ${delErr.message}` };

  if (variantesResult.data.length > 0) {
    const toInsert = variantesResult.data.map((v) => ({
      produto_id: id,
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
    }));
    const { error: vErr } = await sb.from("produto_variantes").insert(toInsert);
    if (vErr) return { ok: false, error: `Variantes: ${vErr.message}` };
  }

  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${id}`);
  revalidatePath("/");
  redirect("/admin/produtos");
}

export async function deleteProduto(id: string): Promise<void> {
  const sb = await createSupabaseServerClient();
  await sb.from("produtos").delete().eq("id", id);
  revalidatePath("/admin/produtos");
  revalidatePath("/");
}

export async function toggleAtivo(id: string, ativo: boolean): Promise<void> {
  const sb = await createSupabaseServerClient();
  await sb.from("produtos").update({ ativo }).eq("id", id);
  revalidatePath("/admin/produtos");
  revalidatePath("/");
}
