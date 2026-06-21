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
  variantes?: ProdutoVarianteComJoins[];
};

export type ProdutoVariante = {
  id: string;
  produto_id: string;
  cor_id: string | null;
  memoria_id: string | null;
  preco: number | null;       // preço "por" (base)
  preco_de: number | null;    // riscado
  preco_vista: number;        // Pix
  preco_cartao: number | null;
  parcelas_sem_juros: number;
  parcelas_com_juros: number;
  frete_gratis: boolean;
  estoque: number;
  ativo: boolean;
  created_at: string;
};

export type ProdutoVarianteComJoins = ProdutoVariante & {
  cor: Pick<Cor, "id" | "nome" | "hex"> | null;
  memoria: Pick<Memoria, "id" | "capacidade" | "sigla"> | null;
};

export type Pagamentos = {
  pix: boolean;
  dinheiro: boolean;
  credito: boolean;
  debito: boolean;
  boleto: boolean;
};

export type Config = {
  id: number;
  nome: string;
  doc: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  whatsapp: string | null;
  instagram: string | null;
  banner: string | null;
  cep_msg: string | null;
  pagamentos: Pagamentos;
  updated_at: string;
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
