"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUI } from "@/lib/stores/ui";
import { useEffect } from "react";

type Item = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ICONS = {
  painel: (
    <svg viewBox="0 0 24 24" {...STROKE} className="w-[17px] h-[17px] shrink-0">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  config: (
    <svg viewBox="0 0 24 24" {...STROKE} className="w-[17px] h-[17px] shrink-0">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  produtos: (
    <svg viewBox="0 0 24 24" {...STROKE} className="w-[17px] h-[17px] shrink-0">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  ),
  cores: (
    <svg viewBox="0 0 24 24" {...STROKE} className="w-[17px] h-[17px] shrink-0">
      <circle cx="13.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="10.5" r="2.5" />
      <circle cx="8.5" cy="7.5" r="2.5" />
      <circle cx="6.5" cy="12.5" r="2.5" />
      <path d="M12 22c4.42 0 8-1.79 8-4s-3.58-4-8-4-8 1.79-8 4 3.58 4 8 4z" />
    </svg>
  ),
  frete: (
    <svg viewBox="0 0 24 24" {...STROKE} className="w-[17px] h-[17px] shrink-0">
      <rect x="1" y="3" width="15" height="13" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-[15px] h-[15px] shrink-0">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

const PRINCIPAL: Item[] = [{ href: "/admin", label: "Painel", icon: ICONS.painel }];

const LOJA: Item[] = [
  { href: "/admin/configuracoes", label: "Configurações", icon: ICONS.config },
  { href: "/admin/produtos", label: "Produtos", icon: ICONS.produtos },
  { href: "/admin/cores", label: "Cores & Variantes", icon: ICONS.cores },
  { href: "/admin/frete", label: "Fretes & CEPs", icon: ICONS.frete },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUI((s) => s.sidebarOpen);
  const closeSidebar = useUI((s) => s.closeSidebar);

  // fecha drawer ao navegar (mobile)
  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  // trava scroll do body enquanto drawer aberto
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const renderItem = (item: Item) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={closeSidebar}
      className={cn(
        "flex items-center gap-2.5 px-5 py-3 text-[13px] transition-all border-l-[3px] border-transparent",
        isActive(item.href)
          ? "text-cream bg-white/10 border-l-cream font-semibold"
          : "text-cream/70 hover:text-cream hover:bg-white/5",
      )}
    >
      {item.icon}
      {item.label}
    </Link>
  );

  return (
    <>
      {/* Overlay mobile */}
      <button
        type="button"
        aria-label="Fechar menu"
        onClick={closeSidebar}
        className={cn(
          "lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-[260px] sm:w-[240px] bg-wine-dark flex flex-col z-40 shadow-[4px_0_20px_rgba(0,0,0,0.2)]",
          "transition-transform duration-300 ease-out",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="px-5 py-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-[38px] h-[38px] rounded-full bg-cream grid place-items-center shrink-0">
            <svg viewBox="0 0 814 1000" className="w-[18px] h-[18px] fill-wine">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-150.7-103.4C27.8 787.3 0 701.6 0 620.6c0-217.6 141.4-332.7 280.3-332.7 75.6 0 138.7 49.8 185.4 49.8 44.7 0 115.7-52.5 200.7-52.5zm-39.8-220.5c-33.9 40.4-72.5 73.6-124.3 73.6-5.3 0-10.6-.4-15.8-1.2.6-3.2 2.8-13.3 2.8-24.3 0-45.3-23.4-91.1-58.5-120.2-31.5-26.4-73.6-43.7-114.5-43.7-2.3 0-4.6.1-6.9.2.1-3.5.2-6.9.2-10.5C431.3 43 478 0 527.8 0c47.1 0 87.8 26.5 114.3 61.7 22.3 29.6 46.2 85.2 46.2 58.7z" />
            </svg>
          </div>
          <div className="leading-tight flex-1">
            <span className="font-display text-base font-bold tracking-[2px] text-cream block">
              PERUZZO
            </span>
            <span className="text-[8px] tracking-[3px] text-cream/50 block">
              IMPORTS
            </span>
          </div>
          <button
            type="button"
            onClick={closeSidebar}
            className="lg:hidden text-cream/70 hover:text-cream"
            aria-label="Fechar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <p className="px-5 pt-2 pb-1.5 text-[9px] tracking-[3px] uppercase text-cream/35 font-semibold">
            Principal
          </p>
          {PRINCIPAL.map(renderItem)}

          <p className="px-5 pt-4 pb-1.5 text-[9px] tracking-[3px] uppercase text-cream/35 font-semibold">
            Loja
          </p>
          {LOJA.map(renderItem)}
        </nav>

        <form action="/admin/logout" method="post" className="p-4 border-t border-white/10">
          <button
            type="submit"
            className="flex items-center gap-2 text-cream/50 text-xs hover:text-cream transition-colors"
          >
            {ICONS.logout}
            Sair
          </button>
        </form>
      </aside>
    </>
  );
}
