export type Marca = {
  id: string;
  nome: string;
  ativo: boolean;
  created_at: string;
};

export type Memoria = {
  id: string;
  capacidade: string;
  sigla: string;
  ativo: boolean;
  created_at: string;
};

export type Cor = {
  id: string;
  nome: string;
  hex: string;
  ativo: boolean;
  created_at: string;
};

export type Condicao = {
  id: string;
  nome: string;
  badge: string;
  ativo: boolean;
  created_at: string;
};

export type Produto = {
  id: string;
  nome: string;
  marca_id: string | null;
  memoria_id: string | null;
  cor_id: string | null;
  condicao_id: string | null;
  preco: number;
  preco_de: number | null;
  descricao: string | null;
  imagens: string[];
  estoque: number;
  destaque: boolean;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

export type ProdutoComJoins = Produto & {
  marca: Pick<Marca, "id" | "nome"> | null;
  memoria: Pick<Memoria, "id" | "capacidade" | "sigla"> | null;
  cor: Pick<Cor, "id" | "nome" | "hex"> | null;
  condicao: Pick<Condicao, "id" | "nome" | "badge"> | null;
};

export type FreteFaixa = {
  id: string;
  cep_inicio: string;
  cep_fim: string | null;
  descricao: string | null;
  tipo: "gratis" | "fixo" | "consulta";
  valor: number;
  ativo: boolean;
  created_at: string;
};
