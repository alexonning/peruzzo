"use client";

import Image from "next/image";
import type { ProdutoComJoins } from "@/lib/types";
import { fmtBRL } from "@/lib/utils";
import {
  displayPrice,
  displayPrecoDe,
  installments,
  pickDisplayVariant,
  temFreteGratis,
} from "@/lib/produtos/pricing";

function badgeColor(badge: string | null | undefined): string {
  switch (badge) {
    case "badge-green":
      return "bg-success text-white";
    case "badge-orange":
      return "bg-gold text-white";
    case "badge-red":
      return "bg-danger text-white";
    case "badge-blue":
      return "bg-info text-white";
    default:
      return "bg-charcoal text-cream-dark";
  }
}

export function ProductCard({
  produto,
  onClick,
}: {
  produto: ProdutoComJoins;
  onClick: () => void;
}) {
  const capa = produto.imagens?.[0];
  const variante = pickDisplayVariant(produto);
  const preco = displayPrice(produto);
  const precoDe = displayPrecoDe(produto);
  const parc = installments(variante);
  const freteGratis = temFreteGratis(produto);
  const memoria = variante?.memoria?.capacidade ?? produto.memoria?.capacidade;
  const cor = variante?.cor?.nome ?? produto.cor?.nome;
  const cond = produto.condicao;

  // monta a spec line "256GB · Lacrado · Titânio Preto"
  const spec = [memoria, cond?.nome, cor].filter(Boolean).join(" · ");

  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const linkWa = wa
    ? `https://wa.me/${wa}?text=${encodeURIComponent(
        `Olá! Tenho interesse no ${produto.nome}.`,
      )}`
    : null;

  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group bg-paper rounded-lg overflow-hidden border border-cream-dark hover:border-wine hover:shadow-[0_12px_36px_rgba(107,26,26,0.10)] hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-wine"
    >
      {/* Imagem com badges absolutos */}
      <div className="relative aspect-[4/3.2] bg-gradient-to-br from-cream to-cream-dark overflow-hidden">
        {cond && (
          <span
            className={`absolute top-3 left-3 z-[2] text-[10px] tracking-[1.5px] uppercase font-semibold px-2.5 py-1 rounded-sm ${badgeColor(cond.badge)}`}
          >
            {cond.nome}
          </span>
        )}
        {freteGratis && (
          <span className="absolute top-3 right-3 z-[2] bg-success text-white text-[9px] tracking-[1px] uppercase font-semibold px-2 py-1 rounded-sm">
            Frete Grátis
          </span>
        )}

        {capa ? (
          <Image
            src={capa}
            alt={produto.nome}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center opacity-40">
            <svg viewBox="0 0 24 24" className="w-12 h-12 fill-wine">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.41-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] tracking-[2px] uppercase text-wine font-semibold mb-1">
          {produto.marca?.nome ?? "Apple"}
        </p>
        <h3 className="font-display text-[20px] font-semibold text-charcoal leading-tight mb-1">
          {produto.nome}
        </h3>
        {spec && (
          <p className="text-[12.5px] text-muted mb-3 flex-1">{spec}</p>
        )}

        {/* Preço */}
        <div className="border-t border-cream-dark pt-3 mt-auto">
          {precoDe && (
            <p className="text-[11px] text-muted line-through tabular-nums">
              {fmtBRL(precoDe)}
            </p>
          )}
          <p className="font-display text-[22px] font-bold text-wine leading-none tabular-nums">
            {fmtBRL(preco)}
          </p>
          {parc && (
            <p className="text-[12px] text-muted mt-1">
              <strong className="text-charcoal font-semibold">
                {parc.n}x
              </strong>{" "}
              de{" "}
              <strong className="text-charcoal font-semibold tabular-nums">
                {fmtBRL(parc.value)}
              </strong>{" "}
              sem juros
            </p>
          )}

          {/* Botões */}
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="flex-1 bg-wine text-cream text-[11px] tracking-[1.5px] uppercase font-semibold py-2.5 rounded hover:bg-wine-dark transition-colors"
            >
              Ver detalhes
            </button>
            {linkWa && (
              <a
                href={linkWa}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label="Falar no WhatsApp"
                title="Falar no WhatsApp"
                className="bg-[#25D366] hover:bg-[#1ebe5d] text-white px-3 rounded grid place-items-center"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
