import Link from "next/link";
import { listProdutos } from "@/lib/produtos/queries";
import { fmtBRL } from "@/lib/utils";
import { DeleteButton } from "./delete-button";

export const dynamic = "force-dynamic";

export default async function ProdutosPage() {
  const produtos = await listProdutos();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal">
            Produtos
          </h1>
          <p className="text-sm text-muted mt-1">
            {produtos.length} cadastrado{produtos.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="bg-wine text-cream px-5 py-2.5 rounded-md text-[12px] font-semibold tracking-[1.5px] uppercase hover:bg-wine-dark transition-colors"
        >
          + Novo produto
        </Link>
      </div>

      <div className="bg-paper border border-cream-dark rounded-xl overflow-hidden">
        {produtos.length === 0 ? (
          <div className="p-10 text-center text-muted">
            Nenhum produto cadastrado.{" "}
            <Link href="/admin/produtos/novo" className="text-wine underline">
              Cadastre o primeiro
            </Link>
            .
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream">
                <tr className="text-[10px] tracking-[2px] uppercase text-muted">
                  <th className="text-left px-4 py-3 font-semibold">Produto</th>
                  <th className="text-left px-4 py-3 font-semibold">Marca</th>
                  <th className="text-left px-4 py-3 font-semibold">Memória</th>
                  <th className="text-left px-4 py-3 font-semibold">Cor</th>
                  <th className="text-right px-4 py-3 font-semibold">Preço</th>
                  <th className="text-center px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {produtos.map((p) => (
                  <tr key={p.id} className="border-t border-cream-dark hover:bg-cream/40">
                    <td className="px-4 py-3 font-medium text-charcoal">
                      {p.nome}
                      {p.destaque && (
                        <span className="ml-2 text-[10px] bg-gold/15 text-gold px-1.5 py-0.5 rounded">
                          DESTAQUE
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">{p.marca?.nome ?? "—"}</td>
                    <td className="px-4 py-3 text-muted">
                      {p.memoria?.capacidade ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {p.cor ? (
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-cream-dark"
                            style={{ background: p.cor.hex }}
                          />
                          <span className="text-muted">{p.cor.nome}</span>
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-wine whitespace-nowrap">
                      {fmtBRL(p.preco)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.ativo ? (
                        <span className="text-[11px] bg-success/10 text-success px-2 py-0.5 rounded-full">
                          Ativo
                        </span>
                      ) : (
                        <span className="text-[11px] bg-danger/10 text-danger px-2 py-0.5 rounded-full">
                          Inativo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/produtos/${p.id}`}
                        className="text-wine text-xs uppercase tracking-[1.5px] font-semibold hover:underline mr-3"
                      >
                        Editar
                      </Link>
                      <DeleteButton id={p.id} nome={p.nome} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
