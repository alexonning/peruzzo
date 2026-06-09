import Image from "next/image";
import type { ProdutoComJoins } from "@/lib/types";
import { fmtBRL } from "@/lib/utils";

export function ProductCard({ produto }: { produto: ProdutoComJoins }) {
  const capa = produto.imagens?.[0];
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const link = wa
    ? `https://wa.me/${wa}?text=${encodeURIComponent(
        `Olá! Tenho interesse no ${produto.nome} (R$ ${produto.preco}).`,
      )}`
    : "#contato";

  return (
    <article className="bg-paper border border-cream-dark rounded-xl p-5 hover:shadow-[0_12px_36px_rgba(107,26,26,0.10)] transition-shadow flex flex-col">
      <div className="aspect-[4/5] rounded-lg bg-cream-dark/40 mb-5 overflow-hidden relative">
        {capa ? (
          <Image
            src={capa}
            alt={produto.nome}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-muted text-xs tracking-[3px] uppercase">
              Sem foto
            </span>
          </div>
        )}
        {produto.destaque && (
          <span className="absolute top-3 left-3 bg-gold/90 text-white text-[10px] font-bold tracking-[2px] px-2 py-1 rounded">
            DESTAQUE
          </span>
        )}
      </div>

      <p className="text-[11px] tracking-[3px] uppercase text-muted">
        {produto.marca?.nome ?? "Apple"}
        {produto.memoria && ` · ${produto.memoria.capacidade}`}
      </p>
      <h3 className="font-display text-2xl font-semibold mt-1 text-charcoal">
        {produto.nome}
      </h3>

      {produto.cor && (
        <div className="flex items-center gap-2 mt-2 text-xs text-muted">
          <span
            className="w-3 h-3 rounded-full border border-cream-dark"
            style={{ background: produto.cor.hex }}
          />
          {produto.cor.nome}
        </div>
      )}

      <div className="mt-auto pt-4">
        {produto.preco_de && produto.preco_de > produto.preco && (
          <p className="text-xs text-muted line-through">
            {fmtBRL(produto.preco_de)}
          </p>
        )}
        <p className="text-wine font-semibold text-xl">{fmtBRL(produto.preco)}</p>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-3 text-center bg-wine text-cream text-[11px] font-semibold tracking-[2px] uppercase py-2.5 rounded-md hover:bg-wine-dark transition-colors"
        >
          Falar no WhatsApp
        </a>
      </div>
    </article>
  );
}
