import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-wine shadow-[0_2px_20px_rgba(0,0,0,0.3)]">
      <div className="bg-wine-dark text-center py-1.5 text-[12px] tracking-[1.5px] font-light text-cream">
        IMPORTAÇÃO DIRETA · ATENDIMENTO PERSONALIZADO
      </div>

      <div className="flex items-center justify-between gap-5 px-10 py-3.5">
        <Link href="/" className="flex items-center gap-3 no-underline shrink-0">
          <span className="w-[50px] h-[50px] bg-cream rounded-full grid place-items-center shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-wine">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.41-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
          </span>
          <span className="text-cream leading-tight">
            <span className="font-display block text-[22px] font-bold tracking-[3px] leading-none">
              PERUZZO
            </span>
            <span className="text-[9px] tracking-[4px] font-light text-cream-dark">
              IMPORTS
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-cream text-[13px] tracking-[2px] uppercase">
          <Link href="/" className="hover:text-cream-dark transition-colors">
            Loja
          </Link>
          <Link href="/#colecao" className="hover:text-cream-dark transition-colors">
            Coleção
          </Link>
          <Link href="/#sobre" className="hover:text-cream-dark transition-colors">
            Sobre
          </Link>
          <Link href="/#contato" className="hover:text-cream-dark transition-colors">
            Contato
          </Link>
        </nav>
      </div>
    </header>
  );
}
