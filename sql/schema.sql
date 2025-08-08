
-- Create tables in Supabase
create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  responsavel text not null check (responsavel in ('IURE','ELIS')),
  prioridade int not null check (prioridade between 1 and 10),
  obs text default ''
);

create table if not exists pecas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  tipo text not null check (tipo in ('Feed','Stories','Reels','Outro')),
  status text not null check (status in ('Atrasado','Hoje','Próximo','Concluído')),
  qtd int,
  programado date,
  atraso_desde date
);
