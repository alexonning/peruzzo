import { Hero } from "@/components/loja/Hero";
import { ShopLayout } from "@/components/loja/ShopLayout";
import { TrustStrip } from "@/components/loja/TrustStrip";
import {
  listProdutosPublicos,
  loadFiltrosPublicos,
} from "@/lib/produtos/queries";

export const revalidate = 60;

export default async function LandingPage() {
  const [produtos, filtros] = await Promise.all([
    listProdutosPublicos(),
    loadFiltrosPublicos(),
  ]);

  return (
    <>
      <Hero />

      {produtos.length === 0 ? (
        <section className="mx-auto max-w-3xl px-5 sm:px-6 py-20 text-center">
          <p className="text-wine text-[11px] tracking-[5px] uppercase mb-3">
            Vitrine
          </p>
          <h2 className="font-display text-charcoal text-3xl sm:text-4xl md:text-5xl font-bold">
            Catálogo em preparação
          </h2>
          <p className="mt-5 text-muted text-sm sm:text-base">
            Estamos atualizando nossa vitrine. Fale conosco no WhatsApp para
            conhecer os modelos disponíveis.
          </p>
        </section>
      ) : (
        <ShopLayout
          produtos={produtos}
          condicoes={filtros.condicoes}
          memorias={filtros.memorias}
        />
      )}

      <TrustStrip />
    </>
  );
}
