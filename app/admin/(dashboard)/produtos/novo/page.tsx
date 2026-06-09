import Link from "next/link";
import { loadOpcoesForm } from "@/lib/produtos/queries";
import { ProdutoForm } from "../produto-form";

export const dynamic = "force-dynamic";

export default async function NovoProdutoPage() {
  const opcoes = await loadOpcoesForm();

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/produtos" className="text-xs text-muted hover:text-wine">
          ← Produtos
        </Link>
        <h1 className="font-display text-2xl font-semibold text-charcoal mt-1">
          Novo produto
        </h1>
      </div>
      <ProdutoForm opcoes={opcoes} />
    </div>
  );
}
