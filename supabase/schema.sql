-- ============================================================
-- Peruzzo Imports — schema completo
-- Cole este arquivo inteiro no Supabase SQL Editor e execute.
-- (Reentrante: usa IF NOT EXISTS / ON CONFLICT.)
-- ============================================================

-- ── EXTENSÕES ────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── TABELAS ──────────────────────────────────────────────────
create table if not exists public.marcas (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null unique,
  ativo       boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.memorias (
  id          uuid primary key default gen_random_uuid(),
  capacidade  text not null,
  sigla       text not null unique,
  ativo       boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.cores (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null unique,
  hex         text not null,
  ativo       boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.condicoes (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null unique,
  badge       text not null default 'badge-blue',
  ativo       boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.produtos (
  id           uuid primary key default gen_random_uuid(),
  nome         text not null,
  marca_id     uuid references public.marcas(id)    on delete set null,
  memoria_id   uuid references public.memorias(id)  on delete set null,
  cor_id       uuid references public.cores(id)     on delete set null,
  condicao_id  uuid references public.condicoes(id) on delete set null,
  preco        numeric(10,2) not null check (preco >= 0),
  preco_de     numeric(10,2) check (preco_de is null or preco_de >= preco),
  descricao    text,
  imagens      text[] not null default '{}',
  estoque      integer not null default 1 check (estoque >= 0),
  destaque     boolean not null default false,
  ativo        boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists produtos_ativo_idx     on public.produtos (ativo);
create index if not exists produtos_destaque_idx  on public.produtos (destaque) where destaque;
create index if not exists produtos_marca_idx     on public.produtos (marca_id);

create table if not exists public.frete_faixas (
  id          uuid primary key default gen_random_uuid(),
  cep_inicio  text not null,
  cep_fim     text,
  descricao   text,
  tipo        text not null check (tipo in ('gratis','fixo','consulta')),
  valor       numeric(10,2) not null default 0,
  ativo       boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.config (
  id          int primary key default 1 check (id = 1),  -- singleton
  nome        text not null default 'Peruzzo Imports',
  whatsapp    text,
  instagram   text,
  banner      text,
  cep_msg     text default 'Não encontramos o frete para o seu CEP. Consulte via WhatsApp! 😊',
  updated_at  timestamptz not null default now()
);

-- ── TRIGGER updated_at ───────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_produtos_touch on public.produtos;
create trigger trg_produtos_touch
  before update on public.produtos
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_config_touch on public.config;
create trigger trg_config_touch
  before update on public.config
  for each row execute function public.touch_updated_at();

-- ── RLS ──────────────────────────────────────────────────────
alter table public.marcas       enable row level security;
alter table public.memorias     enable row level security;
alter table public.cores        enable row level security;
alter table public.condicoes    enable row level security;
alter table public.produtos     enable row level security;
alter table public.frete_faixas enable row level security;
alter table public.config       enable row level security;

-- helper: aplica leitura pública + escrita autenticada
do $$
declare t text;
begin
  foreach t in array array['marcas','memorias','cores','condicoes','produtos','frete_faixas','config'] loop
    execute format('drop policy if exists "%s_read_public" on public.%I', t, t);
    execute format('drop policy if exists "%s_write_auth"  on public.%I', t, t);

    execute format(
      'create policy "%s_read_public" on public.%I for select to anon, authenticated using (true)',
      t, t
    );
    execute format(
      'create policy "%s_write_auth" on public.%I for all to authenticated using (true) with check (true)',
      t, t
    );
  end loop;
end $$;

-- ── STORAGE: bucket de fotos de produto ──────────────────────
insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "produtos_read_public" on storage.objects;
create policy "produtos_read_public" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'produtos');

drop policy if exists "produtos_write_auth" on storage.objects;
create policy "produtos_write_auth" on storage.objects
  for all to authenticated
  using (bucket_id = 'produtos')
  with check (bucket_id = 'produtos');

-- ── SEEDS (defaults do HTML antigo) ──────────────────────────
insert into public.marcas (nome, ativo) values
  ('Apple',   true),
  ('Samsung', false)
on conflict (nome) do nothing;

insert into public.memorias (capacidade, sigla, ativo) values
  ('128 GB', '128gb', true),
  ('256 GB', '256gb', true),
  ('512 GB', '512gb', true),
  ('1 TB',   '1tb',   false)
on conflict (sigla) do nothing;

insert into public.cores (nome, hex, ativo) values
  ('Preto Meia-Noite', '#1a1a1a', true),
  ('Estelar',          '#f5f5f0', true),
  ('Titânio Natural',  '#b5c5d5', true),
  ('Titânio Preto',    '#3a3a3a', true)
on conflict (nome) do nothing;

insert into public.condicoes (nome, badge, ativo) values
  ('Lacrado',   'badge-green', true),
  ('Semi Novo', 'badge-blue',  true)
on conflict (nome) do nothing;

insert into public.frete_faixas (cep_inicio, descricao, tipo, valor) values
  ('85800-000', 'Cascavel – PR',         'gratis', 0),
  ('85900-000', 'Região de Cascavel',    'fixo',   15)
on conflict do nothing;

insert into public.config (id, nome, instagram, banner) values
  (1, 'Peruzzo Imports', 'peruzzo_imports',
   '📍 Entregamos em Cascavel e Região · Atendimento via WhatsApp')
on conflict (id) do nothing;
