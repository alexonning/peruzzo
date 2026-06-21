import { z } from "zod";

export const produtoSchema = z.object({
  nome: z.string().trim().min(2, "Nome obrigatório"),
  marca_id: z.string().uuid().nullable().optional(),
  condicao_id: z.string().uuid().nullable().optional(),
  descricao: z.string().trim().nullable().optional(),
  estoque: z.coerce.number().int("Estoque deve ser inteiro").min(0).default(1),
  destaque: z.coerce.boolean().default(false),
  ativo: z.coerce.boolean().default(true),
  imagens: z.array(z.string().url()).max(8, "Máximo 8 fotos").default([]),
  // produtos.preco é NOT NULL no DB; preços reais vivem em produto_variantes.
  // Mantemos como 0 no nível do produto pra não violar a constraint.
  preco: z.coerce.number().min(0).default(0),
  preco_de: z.coerce.number().min(0).nullable().optional(),
});

export type ProdutoInput = z.infer<typeof produtoSchema>;

export const varianteSchema = z.object({
  id: z.string().uuid().optional(),
  cor_id: z.string().uuid().nullable(),
  memoria_id: z.string().uuid().nullable(),
  preco: z.coerce.number().min(0).nullable(),
  preco_de: z.coerce.number().min(0).nullable(),
  preco_vista: z.coerce.number().min(0),
  preco_cartao: z.coerce.number().min(0).nullable(),
  parcelas_sem_juros: z.coerce.number().int().min(1).default(1),
  parcelas_com_juros: z.coerce.number().int().min(0).default(12),
  frete_gratis: z.coerce.boolean().default(false),
  estoque: z.coerce.number().int().min(0).default(1),
});

export type VarianteInput = z.infer<typeof varianteSchema>;

export const variantesArraySchema = z.array(varianteSchema);

export function produtoFromFormData(fd: FormData): unknown {
  const get = (k: string) => {
    const v = fd.get(k);
    return v === null || v === "" ? null : v;
  };
  return {
    nome: get("nome"),
    marca_id: get("marca_id"),
    condicao_id: get("condicao_id"),
    descricao: get("descricao"),
    estoque: get("estoque") ?? 1,
    destaque: fd.get("destaque") === "on",
    ativo: fd.get("ativo") === "on",
    imagens: fd.getAll("imagens").filter(Boolean).map(String),
  };
}
