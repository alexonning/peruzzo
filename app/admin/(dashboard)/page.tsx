import Link from "next/link";
import { dashboardStats, listProdutosRecentes } from "@/lib/produtos/queries";
import { fmtBRL } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, recentes] = await Promise.all([
    dashboardStats(),
    listProdutosRecentes(5),
  ]);

  const cards = [
    { label: "Produtos Ativos", value: stats.produtosAtivos, note: "na loja" },
    { label: "Variantes", value: stats.variantes, note: "combinações cor + memória" },
    { label: "CEPs Cobertos", value: stats.faixasCep, note: "faixas cadastradas" },
    {
      label: "WhatsApp",
      value: stats.whatsapp ?? "—",
      note: stats.whatsapp ? "configurado" : "definir em Configurações",
      small: true,
    },
  ];

  const atalhos = [
    { href: "/admin/configuracoes", emoji: "⚙️", title: "Configurações", sub: "Endereço, WhatsApp" },
    { href: "/admin/cores", emoji: "🎨", title: "Cores & Memória", sub: "Variantes globais" },
    { href: "/admin/produtos/novo", emoji: "📱", title: "Novo Produto", sub: "Cadastrar iPhone" },
    { href: "/admin/frete", emoji: "🚚", title: "Fretes", sub: "Tabela de entrega" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((s) => (
          <div
            key={s.label}
            className="bg-paper border border-cream-dark rounded-xl p-5"
          >
            <p className="text-[11px] tracking-[1.5px] uppercase text-muted font-semibold mb-2">
              {s.label}
            </p>
            <p
              className={`font-display font-bold text-wine leading-none truncate ${
                s.small ? "text-[17px] pt-1.5" : "text-3xl"
              }`}
            >
              {s.value}
            </p>
            <p className="text-[11px] text-muted mt-2">{s.note}</p>
          </div>
        ))}
      </div>

      {/* Início Rápido */}
      <div className="bg-paper border border-cream-dark rounded-xl">
        <div className="px-6 py-4 border-b border-cream-dark">
          <h2 className="font-display text-lg font-semibold text-charcoal">
            Início Rápido
          </h2>
        </div>
        <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {atalhos.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="bg-cream rounded-lg p-5 text-center border-[1.5px] border-cream-dark hover:border-wine transition-colors"
            >
              <div className="text-3xl mb-2">{a.emoji}</div>
              <div className="font-semibold text-[13px] text-charcoal">{a.title}</div>
              <div className="text-[11px] text-muted mt-1">{a.sub}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Produtos Recentes */}
      <div className="bg-paper border border-cream-dark rounded-xl">
        <div className="px-6 py-4 border-b border-cream-dark flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-charcoal">
            Produtos Recentes
          </h2>
          <Link
            href="/admin/produtos"
            className="bg-wine text-cream text-[11px] font-semibold tracking-[1.5px] uppercase px-3.5 py-1.5 rounded-md hover:bg-wine-dark"
          >
            Ver todos
          </Link>
        </div>
        <div className="p-6">
          {recentes.length === 0 ? (
            <p className="text-muted text-sm">Nenhum produto ainda.</p>
          ) : (
            <ul className="divide-y divide-cream-dark">
              {recentes.map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-charcoal">{p.nome}</p>
                    <p className="text-xs text-muted">
                      {p.marca?.nome ?? "—"} · {p.memoria?.capacidade ?? "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-wine">{fmtBRL(p.preco)}</span>
                    <Link
                      href={`/admin/produtos/${p.id}`}
                      className="text-xs uppercase tracking-[1.5px] font-semibold text-wine hover:underline"
                    >
                      Editar
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
