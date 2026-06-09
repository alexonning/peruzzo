import { z } from "zod";

export const produtoSchema = z.object({
  nome: z.string().trim().min(2, "Nome obrigatório"),
  marca_id: z.string().uuid().nullable().optional(),
  memoria_id: z.string().uuid().nullable().optional(),
  cor_id: z.string().uuid().nullable().optional(),
  condicao_id: z.string().uuid().nullable().optional(),
  preco: z.coerce.number().min(0, "Preço inválido"),
  preco_de: z.coerce.number().min(0).nullable().optional(),
  descricao: z.string().trim().nullable().optional(),
  estoque: z.coerce.number().int().min(0).default(1),
  destaque: z.coerce.boolean().default(false),
  ativo: z.coerce.boolean().default(true),
  imagens: z.array(z.string()).default([]),
});

export type ProdutoInput = z.infer<typeof produtoSchema>;

/** Lê um FormData e devolve o objeto pronto para validação. */
export function produtoFromFormData(fd: FormData): unknown {
  const get = (k: string) => {
    const v = fd.get(k);
    return v === null || v === "" ? null : v;
  };
  return {
    nome: get("nome"),
    marca_id: get("marca_id"),
    memoria_id: get("memoria_id"),
    cor_id: get("cor_id"),
    condicao_id: get("condicao_id"),
    preco: get("preco"),
    preco_de: get("preco_de"),
    descricao: get("descricao"),
    estoque: get("estoque") ?? 1,
    destaque: fd.get("destaque") === "on",
    ativo: fd.get("ativo") === "on",
    imagens: fd.getAll("imagens").filter(Boolean).map(String),
  };
}
