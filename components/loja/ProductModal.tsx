"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { ProdutoComJoins, ProdutoVarianteComJoins } from "@/lib/types";
import { fmtBRL } from "@/lib/utils";
import { installments, installmentsList } from "@/lib/produtos/pricing";
import { cn } from "@/lib/utils";

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

const PAYMENT_METHODS = [
  { label: "💵 Dinheiro" },
  { label: "📱 Pix" },
  { label: "💳 Cartão Crédito 18x" },
  { label: "💳 Cartão Débito" },
];

export function ProductModal({
  produto,
  onClose,
}: {
  produto: ProdutoComJoins | null;
  onClose: () => void;
}) {
  const variantesAtivas = useMemo(
    () => (produto?.variantes ?? []).filter((v) => v.ativo),
    [produto],
  );

  const variantePadrao = useMemo(() => {
    if (variantesAtivas.length === 0) return null;
    return variantesAtivas.reduce((min, v) =>
      Number(v.preco_vista) < Number(min.preco_vista) ? v : min,
    );
  }, [variantesAtivas]);

  const [selVarId, setSelVarId] = useState<string | null>(variantePadrao?.id ?? null);
  const [fotoIdx, setFotoIdx] = useState(0);

  useEffect(() => {
    setSelVarId(variantePadrao?.id ?? null);
    setFotoIdx(0);
  }, [produto?.id, variantePadrao?.id]);

  useEffect(() => {
    if (produto) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [produto]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (produto) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [produto, onClose]);

  if (!produto) return null;

  const variante: ProdutoVarianteComJoins | null =
    variantesAtivas.find((v) => v.id === selVarId) ?? variantePadrao;

  const preco = variante ? Number(variante.preco_vista) : Number(produto.preco ?? 0);
  const precoDe = variante?.preco_de
    ? Number(variante.preco_de)
    : produto.preco_de
      ? Number(produto.preco_de)
      : null;
  const showRiscado = precoDe != null && precoDe > preco;
  const parc = installments(variante);
  const parcList = installmentsList(variante);
  const freteGratis = variante?.frete_gratis ?? false;
  const imagens = produto.imagens ?? [];
  const capa = imagens[fotoIdx] ?? imagens[0];

  const memoria = variante?.memoria?.capacidade ?? produto.memoria?.capacidade;
  const cor = variante?.cor ?? produto.cor;
  const cond = produto.condicao;
  const spec = [memoria, cond?.nome, "1 Ano Garantia Apple"]
    .filter(Boolean)
    .join(" · ");

  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const msg = `Olá! Tenho interesse no ${produto.nome}${cor?.nome ? ` (${cor.nome}` : ""}${memoria ? `${cor?.nome ? " · " : " ("}${memoria}` : ""}${cor?.nome || memoria ? ")" : ""} — preço ${fmtBRL(preco)}.`;
  const linkWa = wa
    ? `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`
    : null;

  // Linhas de detalhes
  const detailRows: Array<[string, string | null]> = [
    ["Marca", produto.marca?.nome ?? null],
    ["Modelo", produto.nome],
    ["Armazenamento", memoria ?? null],
    ["Cor", cor?.nome ?? null],
    ["Condição", cond?.nome ?? null],
    ["Garantia", "1 Ano Apple"],
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={produto.nome}
      onClick={onClose}
      className="fixed inset-0 z-[60] bg-charcoal/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-5"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-paper rounded-t-2xl sm:rounded-xl w-full sm:max-w-[640px] max-h-[92vh] sm:max-h-[90vh] overflow-y-auto relative shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-cream/95 hover:bg-cream-dark rounded-full w-9 h-9 grid place-items-center text-charcoal text-lg shadow-md"
        >
          ✕
        </button>

        {/* Imagem hero */}
        <div className="relative aspect-[16/10] bg-gradient-to-br from-cream to-cream-dark">
          {capa ? (
            <Image
              src={capa}
              alt={produto.nome}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-contain p-6 sm:p-8"
              priority
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center opacity-35">
              <svg viewBox="0 0 24 24" className="w-20 h-20 fill-wine">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.41-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            </div>
          )}
        </div>

        {/* Thumbs */}
        {imagens.length > 1 && (
          <div className="flex gap-2 px-5 sm:px-7 mt-3 overflow-x-auto">
            {imagens.map((url, i) => (
              <button
                key={url}
                type="button"
                onClick={() => setFotoIdx(i)}
                aria-label={`Foto ${i + 1}`}
                className={cn(
                  "relative aspect-square w-14 sm:w-16 shrink-0 rounded-md overflow-hidden bg-cream",
                  i === fotoIdx
                    ? "ring-2 ring-wine"
                    : "ring-1 ring-cream-dark opacity-70 hover:opacity-100",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="px-5 sm:px-7 pb-6 pt-5 space-y-5">
          {/* Badge + título */}
          <div>
            {cond && (
              <span
                className={cn(
                  "inline-block text-[10px] tracking-[2px] uppercase font-semibold px-3 py-1 rounded-sm mb-3",
                  badgeColor(cond.badge),
                )}
              >
                {cond.nome}
              </span>
            )}
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal leading-tight">
              {produto.nome}
            </h2>
            {spec && (
              <p className="text-muted text-sm mt-1.5">{spec}</p>
            )}
          </div>

          {/* Variant picker */}
          {variantesAtivas.length > 1 && (
            <div>
              <p className="text-[11px] tracking-[2px] uppercase text-wine font-semibold mb-2">
                Escolha a variante
              </p>
              <div className="flex flex-wrap gap-2">
                {variantesAtivas.map((v) => {
                  const ativo = v.id === variante?.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelVarId(v.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors",
                        ativo
                          ? "bg-wine text-cream border border-wine"
                          : "bg-cream/60 border border-cream-dark text-charcoal hover:border-wine",
                      )}
                    >
                      {v.cor && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/40"
                          style={{ background: v.cor.hex }}
                        />
                      )}
                      <span>
                        {v.cor?.nome ?? "Cor"}
                        {v.memoria && ` · ${v.memoria.capacidade}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bloco de preços */}
          <div className="bg-cream/70 rounded-md p-5">
            {showRiscado && (
              <p className="text-xs text-muted line-through tabular-nums mb-1">
                De {fmtBRL(precoDe!)}
              </p>
            )}
            <p className="font-display text-[44px] font-bold text-wine leading-none tabular-nums">
              {fmtBRL(preco)}
            </p>
            {parc && (
              <p className="text-sm text-muted mt-2">
                ou{" "}
                <strong className="text-charcoal font-semibold">
                  {parc.n}x de {fmtBRL(parc.value)}
                </strong>{" "}
                no cartão de crédito
              </p>
            )}
            {variante?.parcelas_com_juros &&
              variante.parcelas_com_juros > 0 && (
                <p className="text-[12px] text-muted mt-1">
                  ou em até {variante.parcelas_com_juros}x com juros
                </p>
              )}

            {parcList.length > 1 && (
              <details className="mt-4 group">
                <summary className="cursor-pointer text-[12px] tracking-[1px] uppercase text-wine font-semibold flex items-center gap-1.5 select-none list-none">
                  <span>Ver opções de parcelamento</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-3.5 h-3.5 transition-transform group-open:rotate-180"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <div className="mt-3 bg-paper rounded-md border border-cream-dark overflow-hidden">
                  <ul className="divide-y divide-cream-dark text-sm">
                    {parcList.map((p) => (
                      <li
                        key={p.n}
                        className="flex items-center justify-between px-3.5 py-2"
                      >
                        <span className="text-charcoal">
                          <strong className="tabular-nums">{p.n}x</strong>{" "}
                          {p.juros ? (
                            <span className="text-[11px] text-muted">com juros</span>
                          ) : (
                            <span className="text-[11px] text-success">sem juros</span>
                          )}
                        </span>
                        <span className="tabular-nums font-semibold text-charcoal">
                          {fmtBRL(p.value)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            )}
          </div>

          {/* Detalhes em rows */}
          <div>
            <ul className="divide-y divide-cream-dark">
              {detailRows
                .filter(([, v]) => v != null)
                .map(([label, value]) => (
                  <li
                    key={label}
                    className="flex items-center justify-between py-2 text-[13.5px]"
                  >
                    <span className="text-muted">{label}</span>
                    <span className="font-medium text-charcoal">{value}</span>
                  </li>
                ))}
            </ul>
          </div>

          {/* Formas de pagamento */}
          <div className="bg-cream/70 rounded-md p-5">
            <p className="text-[11px] tracking-[2px] uppercase text-wine font-semibold mb-3">
              Formas de Pagamento
            </p>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((p) => (
                <span
                  key={p.label}
                  className="bg-paper border border-cream-dark rounded text-[12px] font-medium text-charcoal px-3.5 py-1.5"
                >
                  {p.label}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-muted mt-2.5">
              ⚠️ Não realizamos pagamentos por boleto bancário.
            </p>
          </div>

          {/* Frete grátis */}
          {freteGratis && (
            <div className="bg-success/10 border border-success/30 rounded-md p-3.5 text-sm text-success flex gap-2.5 items-start">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-success shrink-0 mt-0.5"
                aria-hidden="true"
              >
                <rect x="1" y="3" width="15" height="13" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <div className="leading-tight">
                <strong>Entrega em Cascavel e Região</strong>
                <br />
                <span className="text-[12px] text-success/80">
                  Entregamos no mesmo dia para Cascavel e cidades da região.
                  Consulte disponibilidade pelo WhatsApp.
                </span>
              </div>
            </div>
          )}

          {/* Descrição */}
          {produto.descricao && (
            <div>
              <p className="text-[11px] tracking-[2px] uppercase text-wine font-semibold mb-2">
                Descrição
              </p>
              <p className="text-sm text-charcoal leading-relaxed whitespace-pre-wrap">
                {produto.descricao}
              </p>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            {linkWa ? (
              <>
                <a
                  href={linkWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-wine text-cream uppercase tracking-[2px] text-[13px] font-semibold py-3.5 rounded text-center hover:bg-wine-dark transition-colors"
                >
                  Comprar Agora
                </a>
                <a
                  href={linkWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-5 py-3.5 rounded font-semibold text-[13px]"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </>
            ) : (
              <p className="text-center text-xs text-muted w-full">
                Configure o WhatsApp em Administração → Configurações.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
