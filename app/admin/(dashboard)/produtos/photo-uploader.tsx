"use client";

import { useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const BUCKET = "produtos";
const MAX_PHOTOS = 8;

export function PhotoUploader({
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
    const slotsLeft = MAX_PHOTOS - value.length;
    if (slotsLeft <= 0) {
      setErr(`Máximo ${MAX_PHOTOS} fotos.`);
      return;
    }
    setBusy(true);
    setErr(null);
    const sb = createSupabaseBrowserClient();
    const novos: string[] = [];

    for (const file of Array.from(files).slice(0, slotsLeft)) {
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

  function setMain(url: string) {
    const rest = value.filter((u) => u !== url);
    onChange([url, ...rest]);
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  function moveLeft(idx: number) {
    if (idx <= 0) return;
    const copy = [...value];
    [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
    onChange(copy);
  }

  function moveRight(idx: number) {
    if (idx >= value.length - 1) return;
    const copy = [...value];
    [copy[idx + 1], copy[idx]] = [copy[idx], copy[idx + 1]];
    onChange(copy);
  }

  const canAdd = value.length < MAX_PHOTOS;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
        {value.map((url, idx) => (
          <PhotoCell
            key={url}
            url={url}
            isMain={idx === 0}
            onSetMain={() => setMain(url)}
            onRemove={() => remove(url)}
            onMoveLeft={() => moveLeft(idx)}
            onMoveRight={() => moveRight(idx)}
            isFirst={idx === 0}
            isLast={idx === value.length - 1}
          />
        ))}
        {canAdd && (
          <label className="aspect-square rounded-md border-2 border-dashed border-cream-dark text-muted text-xs grid place-items-center cursor-pointer hover:border-wine hover:text-wine transition-colors text-center px-2">
            <div>
              {busy ? (
                "Enviando..."
              ) : (
                <>
                  <div className="text-lg mb-1">+</div>
                  <div>Adicionar</div>
                  <div className="text-[10px] mt-0.5 opacity-60">
                    {value.length}/{MAX_PHOTOS}
                  </div>
                </>
              )}
            </div>
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
        )}
      </div>
      {err && <p className="text-danger text-xs mb-1">{err}</p>}
      <p className="text-[11px] text-muted leading-relaxed">
        A primeira foto é a <strong>principal</strong> (a capa). Clique em{" "}
        <span className="font-semibold">★ Tornar principal</span> em qualquer
        outra para mudar. Máximo {MAX_PHOTOS} fotos.
      </p>
    </div>
  );
}

function PhotoCell({
  url,
  isMain,
  onSetMain,
  onRemove,
  onMoveLeft,
  onMoveRight,
  isFirst,
  isLast,
}: {
  url: string;
  isMain: boolean;
  onSetMain: () => void;
  onRemove: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div
      className={cn(
        "relative aspect-square rounded-md overflow-hidden bg-cream group",
        isMain ? "ring-2 ring-wine" : "border border-cream-dark",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className="w-full h-full object-cover" />

      {isMain && (
        <span className="absolute top-1.5 left-1.5 bg-wine text-cream text-[9px] font-bold tracking-[1px] px-2 py-0.5 rounded shadow">
          ★ PRINCIPAL
        </span>
      )}

      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
        {/* Top: reorder */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onMoveLeft}
            disabled={isFirst}
            className="bg-white/90 text-charcoal w-7 h-7 rounded grid place-items-center font-bold text-sm disabled:opacity-30"
            aria-label="Mover para trás"
            title="Mover para trás"
          >
            ←
          </button>
          <button
            type="button"
            onClick={onMoveRight}
            disabled={isLast}
            className="bg-white/90 text-charcoal w-7 h-7 rounded grid place-items-center font-bold text-sm disabled:opacity-30"
            aria-label="Mover para frente"
            title="Mover para frente"
          >
            →
          </button>
        </div>

        {/* Bottom: actions */}
        <div className="flex gap-1.5">
          {!isMain && (
            <button
              type="button"
              onClick={onSetMain}
              className="flex-1 bg-white text-charcoal text-[10px] font-semibold py-1.5 rounded hover:bg-cream"
            >
              ★ Principal
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            className={cn(
              "bg-danger text-white text-[10px] font-semibold py-1.5 px-2 rounded hover:bg-danger/90",
              isMain ? "flex-1" : "shrink-0",
            )}
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}
