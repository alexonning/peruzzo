const TITLES: Record<string, string> = {
  "/admin": "Painel",
  "/admin/configuracoes": "Configurações",
  "/admin/produtos": "Produtos",
  "/admin/produtos/novo": "Novo Produto",
  "/admin/cores": "Cores & Variantes",
  "/admin/frete": "Fretes & CEPs",
};

export function titleFor(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname];
  // /admin/produtos/<uuid>
  if (/^\/admin\/produtos\/[^/]+$/.test(pathname)) return "Editar Produto";
  return "Administração";
}
