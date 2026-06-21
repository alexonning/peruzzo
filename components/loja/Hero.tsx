const TRUST_ITEMS = [
  {
    label: "1 Ano de Garantia",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    label: "Entrega em Cascavel",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
        <rect x="1" y="3" width="15" height="13" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    label: "18x no Cartão",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    label: "Produtos Originais",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
];

export function Hero() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const linkWa = wa
    ? `https://wa.me/${wa}?text=${encodeURIComponent(
        "Olá! Gostaria de mais informações sobre os iPhones disponíveis.",
      )}`
    : "#contato";

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-wine via-wine to-wine-dark text-cream">
      {/* Detalhe decorativo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6 py-16 sm:py-24 md:py-28 text-center">
        <span className="inline-block bg-cream/15 text-cream text-[10px] sm:text-[11px] tracking-[3px] uppercase font-semibold px-4 py-1.5 rounded-full mb-6 sm:mb-8 border border-cream/20">
          ✦ iPhones Originais com Garantia
        </span>

        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
          A melhor loja de
          <br />
          <em className="text-cream-dark not-italic font-display italic">
            iPhones do Paraná
          </em>
        </h1>

        <p className="mx-auto mt-6 sm:mt-8 max-w-2xl text-cream-dark/90 text-sm sm:text-base md:text-lg leading-relaxed">
          Lacrados e semi-novos premium, com garantia e entrega em Cascavel e
          região. Parcelamos em até 18x no cartão.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <a
            href="#produtos"
            className="bg-cream text-wine uppercase tracking-[2px] text-[11px] sm:text-[12px] font-bold px-7 sm:px-9 py-3 sm:py-3.5 rounded-md hover:bg-white transition-colors"
          >
            Ver Produtos
          </a>
          <a
            href={linkWa}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-cream/40 text-cream uppercase tracking-[2px] text-[11px] sm:text-[12px] font-bold px-7 sm:px-9 py-3 sm:py-3.5 rounded-md hover:bg-cream/10 transition-colors"
          >
            Falar no WhatsApp
          </a>
        </div>

        <div className="mt-10 sm:mt-14 flex flex-wrap justify-center gap-x-6 gap-y-3 text-cream-dark/80">
          {TRUST_ITEMS.map((t) => (
            <span
              key={t.label}
              className="flex items-center gap-1.5 text-[11px] sm:text-[12px] tracking-[1px] uppercase"
            >
              {t.icon}
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
