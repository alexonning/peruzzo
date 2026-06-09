"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { produtoFromFormData, produtoSchema } from "./schema";

type ActionResult = { ok: boolean; error?: string };

export async function createProduto(formData: FormData): Promise<ActionResult> {
  const parsed = produtoSchema.safeParse(produtoFromFormData(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const sb = await createSupabaseServerClient();
  const { error } = await sb.from("produtos").insert(parsed.data);
  if (error) return { ok: false, error: error.message };

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

  const sb = await createSupabaseServerClient();
  const { error } = await sb.from("produtos").update(parsed.data).eq("id", id);
  if (error) return { ok: false, error: error.message };

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
