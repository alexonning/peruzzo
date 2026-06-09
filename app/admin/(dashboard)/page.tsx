import { dashboardStats } from "@/lib/produtos/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { produtosAtivos, faixasCep } = await dashboardStats();
  const sb = await createSupabaseServerClient();
  const { data: { user } } = await sb.auth.getUser();

  const stats = [
    { label: "Produtos ativos", value: produtosAtivos },
    { label: "Faixas de CEP", value: faixasCep },
    { label: "Usuário logado", value: user?.email?.split("@")[0] ?? "—" },
    { label: "Pedidos (mês)", value: "—" },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-paper border border-cream-dark rounded-xl p-5"
          >
            <p className="text-[11px] tracking-[1.5px] uppercase text-muted font-semibold mb-1.5">
              {s.label}
            </p>
            <p className="font-display text-3xl font-bold text-wine leading-none truncate">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-paper border border-cream-dark rounded-xl p-8">
        <h2 className="font-display text-xl font-semibold mb-3 text-charcoal">
          Bem-vindo de volta
        </h2>
        <p className="text-sm text-muted">
          Use o menu lateral para gerenciar os produtos da vitrine. As alterações
          aparecem imediatamente na landing pública.
        </p>
      </div>
    </div>
  );
}
