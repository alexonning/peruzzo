import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sb = await createSupabaseServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen flex bg-[#f0e8de]">
      <aside className="fixed inset-y-0 left-0 w-[240px] bg-wine-dark text-cream/80 flex flex-col z-30">
        <div className="px-5 py-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-cream grid place-items-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-wine">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.41-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
          </div>
          <div>
            <p className="font-display text-base font-bold tracking-[2px] leading-none">
              PERUZZO
            </p>
            <p className="text-[8px] tracking-[3px] text-cream/50">ADMIN</p>
          </div>
        </div>

        <nav className="flex-1 py-4">
          <p className="px-5 py-2 text-[9px] tracking-[3px] uppercase text-cream/35 font-semibold">
            Vitrine
          </p>
          <NavLink href="/admin">Dashboard</NavLink>
          <NavLink href="/admin/produtos">Produtos</NavLink>
          <NavLink href="/admin/configuracoes">Configurações</NavLink>
        </nav>

        <form action="/admin/logout" method="post" className="p-4 border-t border-white/10">
          <button className="text-cream/60 text-xs hover:text-cream">
            Sair
          </button>
        </form>
      </aside>

      <main className="ml-[240px] flex-1 min-h-screen">
        <div className="bg-paper h-16 px-8 flex items-center border-b border-cream-dark sticky top-0 z-20 shadow-sm">
          <p className="font-display text-xl font-semibold text-charcoal">
            Painel administrativo
          </p>
        </div>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-5 py-2.5 text-cream/70 text-[13px] hover:bg-white/5 hover:text-cream transition-colors"
    >
      {children}
    </Link>
  );
}
