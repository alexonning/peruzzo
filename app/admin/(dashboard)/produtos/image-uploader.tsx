"use client";

import { useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const BUCKET = "produtos";

export function ImageUploader({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setErr(null);
    const sb = createSupabaseBrowserClient();
    const novos: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await sb.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) {
        setErr(error.message);
        continue;
      }
      const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
      novos.push(data.publicUrl);
    }

    onChange([...value, ...novos]);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        {value.map((url) => (
          <div
            key={url}
            className="relative aspect-square rounded-md overflow-hidden border border-cream-dark bg-cream group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute top-1.5 right-1.5 bg-danger text-white text-[10px] font-bold rounded-full w-6 h-6 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remover imagem"
            >
              ×
            </button>
          </div>
        ))}
        <label
          className="aspect-square rounded-md border-2 border-dashed border-cream-dark text-muted text-xs grid place-items-center cursor-pointer hover:border-wine hover:text-wine transition-colors"
        >
          {busy ? "Enviando..." : "+ Adicionar"}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={busy}
          />
        </label>
      </div>
      {err && <p className="text-danger text-xs">{err}</p>}
      <p className="text-[11px] text-muted">
        Recomendado: 1200×1500px, JPG/PNG. Primeira imagem é a capa.
      </p>
    </div>
  );
}
