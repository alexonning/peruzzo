const ITEMS = [
  {
    title: "Garantia Apple Original",
    sub: "1 ano de garantia inclusa",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Entrega em Cascavel",
    sub: "e região, no mesmo dia",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <rect x="1" y="3" width="15" height="13" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Parcelamos em 18x",
    sub: "apenas no cartão de crédito",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    title: "Atendimento Próximo",
    sub: "WhatsApp seg–sáb, 9h às 19h",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
];

export function TrustStrip() {
  return (
    <section className="bg-paper border-y border-cream-dark">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ITEMS.map((it) => (
          <div key={it.title} className="flex items-start gap-3 sm:gap-4">
            <span className="text-wine shrink-0">{it.icon}</span>
            <div className="leading-tight">
              <p className="font-semibold text-charcoal text-sm">{it.title}</p>
              <p className="text-xs text-muted mt-1">{it.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
