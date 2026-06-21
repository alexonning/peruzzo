"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function rawFromDisplay(display: string): number {
  const digits = display.replace(/\D/g, "");
  return digits ? Number(digits) / 100 : 0;
}

/**
 * Input com máscara de moeda BRL.
 *
 * - Prefixo visual "R$".
 * - Aceita só dígitos; formata como 1.234,56 enquanto o usuário digita.
 * - Envia o valor numérico cru (12.34) em <input type="hidden" name={name}>
 *   para que Server Actions recebam Number, não string formatada.
 * - Quando `onValueChange` é passado, também emite o valor em tempo real
 *   (útil para state managed externo, como editor de variantes).
 */
export function CurrencyInput({
  name,
  defaultValue = 0,
  className,
  required = false,
  placeholder = "0,00",
  onValueChange,
}: {
  name?: string;
  defaultValue?: number | string | null;
  className?: string;
  required?: boolean;
  placeholder?: string;
  onValueChange?: (value: number) => void;
}) {
  const initial = Number(defaultValue ?? 0) || 0;
  const [display, setDisplay] = useState(formatBRL(initial));
  const raw = rawFromDisplay(display);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    const num = digits ? Number(digits) / 100 : 0;
    const newDisplay = formatBRL(num);
    setDisplay(newDisplay);
    onValueChange?.(num);
  }

  return (
    <div className="relative">
      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted text-xs pointer-events-none select-none font-medium">
        R$
      </span>
      <input
        type="text"
        inputMode="decimal"
        value={display}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className={cn(
          "w-full pl-8 pr-2.5 py-2 border border-cream-dark rounded-md text-sm bg-paper focus:outline-none focus:border-wine text-right tabular-nums",
          className,
        )}
      />
      {name && <input type="hidden" name={name} value={raw} />}
    </div>
  );
}
