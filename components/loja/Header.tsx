"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Loja" },
  { href: "/#colecao", label: "Coleção" },
  { href: "/#sobre", label: "Sobre" },
  { href: "/#contato", label: "Contato" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-wine shadow-[0_2px_20px_rgba(0,0,0,0.3)]">
      <div className="bg-wine-dark text-center py-1.5 text-[10px] sm:text-[12px] tracking-[1.5px] font-light text-cream px-3">
        IMPORTAÇÃO DIRETA · ATENDIMENTO PERSONALIZADO
      </div>

      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-10 py-3 sm:py-3.5">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 no-underline shrink-0">
          <span className="w-[44px] h-[44px] sm:w-[50px] sm:h-[50px] bg-cream rounded-full grid place-items-center shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
            <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] fill-wine">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.41-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
          </span>
          <span className="text-cream leading-tight">
            <span className="font-display block text-[18px] sm:text-[22px] font-bold tracking-[2px] sm:tracking-[3px] leading-none">
              PERUZZO
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[3px] sm:tracking-[4px] font-light text-cream-dark">
              IMPORTS
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-cream text-[12px] lg:text-[13px] tracking-[2px] uppercase">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-cream-dark transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-cream p-1.5 -mr-1.5"
        >
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Drawer mobile */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-[max-height] duration-300 ease-out border-t border-wine-light/50",
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <nav className="flex flex-col py-2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-6 py-3 text-cream text-sm tracking-[2px] uppercase hover:bg-wine-dark"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
