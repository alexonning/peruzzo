"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const sb = createSupabaseBrowserClient();
    const { error } = await sb.auth.signInWithPassword({
      email,
      password: pwd,
    });
    setLoading(false);
    if (error) {
      setErr("Credenciais inválidas.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="fixed inset-0 grid place-items-center bg-gradient-to-br from-wine-dark via-wine to-[#8a3030]">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md mx-4 bg-paper rounded-xl p-10 shadow-[0_24px_80px_rgba(0,0,0,0.35)] text-center"
      >
        <div className="mb-7">
          <div className="w-[72px] h-[72px] mx-auto rounded-full bg-wine grid place-items-center mb-3">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-cream">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.41-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
          </div>
          <p className="font-display text-2xl font-bold tracking-[3px] text-wine">
            PERUZZO
          </p>
          <p className="text-[10px] tracking-[4px] text-muted">IMPORTS</p>
        </div>

        <h1 className="font-display text-lg font-semibold mb-6 text-charcoal">
          Painel administrativo
        </h1>

        <div className="text-left mb-4">
          <label className="block text-[11px] tracking-[1.5px] uppercase text-muted font-semibold mb-1.5">
            E-mail
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-cream-dark rounded-md text-sm focus:outline-none focus:border-wine"
          />
        </div>

        <div className="text-left mb-2">
          <label className="block text-[11px] tracking-[1.5px] uppercase text-muted font-semibold mb-1.5">
            Senha
          </label>
          <input
            type="password"
            required
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-cream-dark rounded-md text-sm focus:outline-none focus:border-wine"
          />
        </div>

        {err && <p className="text-danger text-xs mt-2">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-wine text-cream py-3 rounded-md text-[13px] font-semibold tracking-[2px] uppercase hover:bg-wine-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
