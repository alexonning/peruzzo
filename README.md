# Peruzzo Imports — Web App

Esqueleto Next.js 15 (App Router) + TypeScript + Tailwind v4 + Supabase para a
loja **Peruzzo Imports** (landing + painel administrativo).

## Stack

| Camada | Ferramenta |
|---|---|
| Framework | Next.js 15 (App Router, RSC, Server Actions) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 (tokens via `@theme` em `globals.css`) |
| Fontes | `next/font/google` — Cormorant Garamond + Jost |
| Banco / Auth / Storage | Supabase (PostgreSQL) |
| Formulários | React Hook Form + Zod |
| Estado | Zustand (quando precisar) |
| Ícones | lucide-react |
| Utils | clsx + tailwind-merge (`cn()` em `lib/utils.ts`) |

## Estrutura

```
app/
├─ (loja)/            → landing pública (header, hero, vitrine, footer)
│  ├─ layout.tsx
│  └─ page.tsx
├─ admin/
│  ├─ login/page.tsx          → tela de login
│  ├─ logout/route.ts         → POST de logout
│  └─ (dashboard)/
│     ├─ layout.tsx           → sidebar + topbar + guard de sessão
│     ├─ page.tsx             → dashboard
│     ├─ produtos/page.tsx
│     └─ configuracoes/page.tsx
├─ globals.css        → @theme com paleta Peruzzo (--wine, --cream, --gold...)
└─ layout.tsx         → root, importa fontes
components/
├─ loja/              → Header, Hero, Footer
└─ ui/                → componentes reutilizáveis
lib/
├─ supabase/
│  ├─ client.ts       → cliente browser
│  ├─ server.ts       → cliente server (RSC / Server Actions)
│  └─ middleware.ts   → atualização de sessão
└─ utils.ts           → cn(), fmtBRL()
middleware.ts         → protege /admin/*
```

## Rodando localmente

```bash
cp .env.example .env.local   # preencher com credenciais Supabase
npm run dev                  # http://localhost:3000
```

Rotas:
- `/` — landing pública
- `/admin/login` — login
- `/admin` — dashboard (protegido)
- `/admin/produtos`, `/admin/configuracoes`

## Configurando o Supabase

1. Crie o projeto em <https://supabase.com/dashboard>.
2. Em **Settings → API**, copie `Project URL` e `anon public key` para `.env.local`.
3. Em **Authentication → Users**, convide o e-mail do administrador.
4. Aplique o schema sugerido abaixo em **SQL Editor**.

### Schema sugerido (espelha o `localStorage` do HTML antigo)

```sql
create table public.marcas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.memorias (
  id uuid primary key default gen_random_uuid(),
  capacidade text not null,
  sigla text not null unique,
  ativo boolean not null default true
);

create table public.cores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  hex text not null,
  ativo boolean not null default true
);

create table public.condicoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  badge text not null default 'badge-blue',
  ativo boolean not null default true
);

create table public.produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  marca_id uuid references public.marcas(id),
  memoria_id uuid references public.memorias(id),
  cor_id uuid references public.cores(id),
  condicao_id uuid references public.condicoes(id),
  preco numeric(10,2) not null,
  descricao text,
  imagens text[] not null default '{}',
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.frete_faixas (
  id uuid primary key default gen_random_uuid(),
  cep_inicio text not null,
  cep_fim text,
  descricao text,
  tipo text not null check (tipo in ('gratis','fixo','consulta')),
  valor numeric(10,2) not null default 0
);

-- RLS: leitura pública para a vitrine, escrita só para admins autenticados
alter table public.produtos enable row level security;
alter table public.marcas enable row level security;
alter table public.memorias enable row level security;
alter table public.cores enable row level security;
alter table public.condicoes enable row level security;
alter table public.frete_faixas enable row level security;

create policy "ler produtos ativos" on public.produtos
  for select using (ativo = true);

create policy "admin grava produtos" on public.produtos
  for all using (auth.role() = 'authenticated')
        with check (auth.role() = 'authenticated');
```

### Storage

Crie um bucket `produtos` (público). Salve os paths em `produtos.imagens`.

## Próximos passos

- [ ] CRUD real de Produtos (RHF + Zod + Server Actions)
- [ ] Upload de imagens para Supabase Storage
- [ ] Filtros da vitrine (marca, memória, cor, faixa de preço)
- [ ] Página `/produto/[id]` com WhatsApp
- [ ] Validação de CEP usando `frete_faixas`
- [ ] Analytics (Vercel Analytics + GA4)
- [ ] Deploy: `vercel` (env vars no painel)

## Notas

- Cores e fontes vieram do `:root` dos HTMLs originais — qualquer ajuste vira
  um token novo em `app/globals.css`.
- Os HTMLs originais ficam em `../administracao (1).html` e
  `../peruzzo-imports.html` como referência visual.
