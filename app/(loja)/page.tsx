import { Hero } from "@/components/loja/Hero";
import { ProductCard } from "@/components/loja/ProductCard";
import { listProdutosPublicos } from "@/lib/produtos/queries";

export const revalidate = 60;

export default async function LandingPage() {
  const produtos = await listProdutosPublicos();

  return (
    <>
      <Hero />

      <section
        id="colecao"
        className="mx-auto max-w-6xl px-6 py-20"
        aria-labelledby="colecao-title"
      >
        <div className="text-center mb-12">
          <p className="text-wine text-[11px] tracking-[5px] uppercase mb-3">
            Vitrine
          </p>
          <h2
            id="colecao-title"
            className="font-display text-charcoal text-4xl md:text-5xl font-bold"
          >
            Coleção em destaque
          </h2>
          <p className="mt-3 text-muted">
            {produtos.length > 0
              ? `${produtos.length} ${produtos.length === 1 ? "modelo disponível" : "modelos disponíveis"}`
              : "Em breve, novos modelos."}
          </p>
        </div>

        {produtos.length === 0 ? (
          <div className="bg-paper border border-cream-dark rounded-xl p-12 text-center max-w-2xl mx-auto">
            <p className="font-display text-2xl text-charcoal mb-2">
              Catálogo em preparação
            </p>
            <p className="text-muted text-sm">
              Estamos atualizando nossa vitrine. Fale conosco no WhatsApp para
              conhecer os modelos disponíveis.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {produtos.map((p) => (
              <ProductCard key={p.id} produto={p} />
            ))}
          </div>
        )}
      </section>

      <section id="sobre" className="bg-paper border-y border-cream-dark py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-wine text-[11px] tracking-[5px] uppercase mb-3">
            Sobre
          </p>
          <h2 className="font-display text-charcoal text-4xl md:text-5xl font-bold">
            Importação que você acompanha de perto.
          </h2>
          <p className="mt-6 text-muted leading-relaxed">
            Cada aparelho passa pela curadoria da Peruzzo Imports antes de
            chegar até você. Garantia, procedência e atendimento pessoal.
          </p>
        </div>
      </section>
    </>
  );
}
