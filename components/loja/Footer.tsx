import Link from "next/link";

export function Footer() {
  return (
    <footer
      id="contato"
      className="mt-auto border-t border-cream-dark bg-wine-dark text-cream"
    >
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold tracking-[3px]">
            PERUZZO
          </p>
          <p className="text-[10px] tracking-[4px] text-cream-dark mt-1">
            IMPORTS
          </p>
          <p className="mt-4 text-sm text-cream/70 max-w-xs">
            iPhones originais, importados e entregues com garantia.
          </p>
        </div>

        <div>
          <p className="text-[11px] tracking-[3px] uppercase text-cream-dark mb-3">
            Navegação
          </p>
          <ul className="space-y-2 text-sm text-cream/80">
            <li>
              <Link href="/" className="hover:text-cream">
                Loja
              </Link>
            </li>
            <li>
              <Link href="/#colecao" className="hover:text-cream">
                Coleção
              </Link>
            </li>
            <li>
              <Link href="/#sobre" className="hover:text-cream">
                Sobre
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] tracking-[3px] uppercase text-cream-dark mb-3">
            Contato
          </p>
          <p className="text-sm text-cream/80">
            Atendimento via WhatsApp,
            <br />
            seg–sáb, 9h às 19h.
          </p>
        </div>
      </div>
      <div className="border-t border-cream/10 py-4 text-center text-[11px] text-cream/50 tracking-[2px] uppercase">
        © {new Date().getFullYear()} Peruzzo Imports
      </div>
    </footer>
  );
}
