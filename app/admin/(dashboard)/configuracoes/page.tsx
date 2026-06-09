export default function ConfiguracoesPage() {
  return (
    <div className="bg-paper border border-cream-dark rounded-xl p-8">
      <h2 className="font-display text-xl font-semibold text-charcoal mb-2">
        Configurações
      </h2>
      <p className="text-sm text-muted">
        Cores, marcas, memórias, condições e faixas de CEP — migrar do{" "}
        <code>localStorage</code> do HTML antigo para tabelas Supabase.
      </p>
    </div>
  );
}
