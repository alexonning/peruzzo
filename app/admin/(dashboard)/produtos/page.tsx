import Link from "next/link";
import { listProdutos } from "@/lib/produtos/queries";
import { displayPrice, pickDisplayVariant } from "@/lib/produtos/pricing";
import { fmtBRL } from "@/lib/utils";
import { DeleteButton } from "./delete-button";

export const dynamic = "force-dynamic";

export default async function ProdutosPage() {
  const produtos = await listProdutos();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-semibold text-charcoal">
            Produtos
          </h1>
          <p className="text-sm text-muted mt-1">
            {produtos.length} cadastrado{produtos.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="bg-wine text-cream px-5 py-2.5 rounded-md text-[12px] font-semibold tracking-[1.5px] uppercase hover:bg-wine-dark transition-colors text-center"
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
          <>
            {/* Tabela em desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream">
                  <tr className="text-[10px] tracking-[2px] uppercase text-muted">
                    <th className="text-left px-4 py-3 font-semibold">Produto</th>
                    <th className="text-left px-4 py-3 font-semibold">Marca</th>
                    <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Memória</th>
                    <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Cor</th>
                    <th className="text-right px-4 py-3 font-semibold">Preço</th>
                    <th className="text-center px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((p) => {
                    const v = pickDisplayVariant(p);
                    const preco = displayPrice(p);
                    const nVar = (p.variantes ?? []).length;
                    return (
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
                      <td className="px-4 py-3 text-muted hidden lg:table-cell">
                        {v?.memoria?.capacidade ?? p.memoria?.capacidade ?? "—"}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {(v?.cor ?? p.cor) ? (
                          <span className="inline-flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-cream-dark"
                              style={{ background: (v?.cor ?? p.cor)!.hex }}
                            />
                            <span className="text-muted">
                              {(v?.cor ?? p.cor)!.nome}
                              {nVar > 1 && (
                                <span className="text-[10px] opacity-70"> +{nVar - 1}</span>
                              )}
                            </span>
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-wine whitespace-nowrap tabular-nums">
                        {preco > 0 ? (
                          fmtBRL(preco)
                        ) : (
                          <span className="text-muted text-xs font-normal">
                            sem preço
                          </span>
                        )}
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
                  );
                  })}
                </tbody>
              </table>
            </div>

            {/* Cards em mobile */}
            <ul className="md:hidden divide-y divide-cream-dark">
              {produtos.map((p) => {
                const v = pickDisplayVariant(p);
                const preco = displayPrice(p);
                return (
                <li key={p.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-charcoal truncate">{p.nome}</p>
                      <p className="text-xs text-muted mt-0.5">
                        {p.marca?.nome ?? "—"}
                        {(v?.memoria ?? p.memoria) &&
                          ` · ${(v?.memoria ?? p.memoria)!.capacidade}`}
                      </p>
                      {(v?.cor ?? p.cor) && (
                        <span className="inline-flex items-center gap-1.5 mt-1.5 text-xs text-muted">
                          <span
                            className="w-3 h-3 rounded-full border border-cream-dark"
                            style={{ background: (v?.cor ?? p.cor)!.hex }}
                          />
                          {(v?.cor ?? p.cor)!.nome}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-wine whitespace-nowrap tabular-nums">
                        {preco > 0 ? fmtBRL(preco) : <span className="text-muted text-xs font-normal">sem preço</span>}
                      </p>
                      {p.ativo ? (
                        <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full inline-block mt-1">
                          Ativo
                        </span>
                      ) : (
                        <span className="text-[10px] bg-danger/10 text-danger px-2 py-0.5 rounded-full inline-block mt-1">
                          Inativo
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <Link
                      href={`/admin/produtos/${p.id}`}
                      className="flex-1 bg-cream border border-wine text-wine text-center text-xs uppercase tracking-[1.5px] font-semibold py-2 rounded-md"
                    >
                      Editar
                    </Link>
                    <DeleteButton id={p.id} nome={p.nome} />
                  </div>
                </li>
              );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
