import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduto, loadOpcoesForm } from "@/lib/produtos/queries";
import { ProdutoForm } from "../produto-form";

export const dynamic = "force-dynamic";

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [produto, opcoes] = await Promise.all([
    getProduto(id),
    loadOpcoesForm(),
  ]);

  if (!produto) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/produtos" className="text-xs text-muted hover:text-wine">
          ← Produtos
        </Link>
        <h1 className="font-display text-2xl font-semibold text-charcoal mt-1">
          Editar: {produto.nome}
        </h1>
      </div>
      <ProdutoForm opcoes={opcoes} produto={produto} />
    </div>
  );
}
