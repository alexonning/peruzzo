export function Hero() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const link = wa
    ? `https://wa.me/${wa}?text=${encodeURIComponent(
        "Olá! Gostaria de mais informações sobre os iPhones disponíveis.",
      )}`
    : "#contato";

  return (
    <section className="relative isolate overflow-hidden border-b border-cream-dark bg-gradient-to-b from-cream to-cream-dark">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32 text-center">
        <p className="text-wine text-[11px] tracking-[6px] uppercase mb-6">
          Coleção 2026
        </p>
        <h1 className="font-display text-charcoal text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
          iPhones <span className="italic text-wine">originais</span>,
          <br />
          atendimento próximo.
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-muted text-base md:text-lg leading-relaxed">
          Importação direta, lacrados, com garantia. Cada peça da nossa vitrine
          é selecionada e atendida pessoalmente.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#colecao"
            className="bg-wine text-cream uppercase tracking-[2px] text-[12px] font-semibold px-8 py-3.5 rounded-md hover:bg-wine-dark transition-colors"
          >
            Ver coleção
          </a>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-wine text-wine uppercase tracking-[2px] text-[12px] font-semibold px-8 py-3.5 rounded-md hover:bg-wine hover:text-cream transition-colors"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
