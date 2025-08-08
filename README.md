
# TaskOps — Sistema de Gestão Diário (Apple‑style)

MVP pronto para você usar agora, com **Next.js + Tailwind** e **Supabase** (Postgres).

## Como usar (5 passos)

1. **Crie um projeto no Supabase** (gratuito) e copie:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE` (Settings → API → Service role key)

2. No Supabase, vá em **SQL Editor** e rode os arquivos `sql/schema.sql` e depois `sql/seed.sql` para criar as tabelas e inserir os dados de exemplo.

3. Faça uma cópia de `.env.example` como `.env.local` e preencha as variáveis.

4. Instale e rode localmente:
   ```bash
   npm install
   npm run dev
   ```

5. **Deploy** (opcional): crie um projeto na **Vercel**, conecte este repositório e configure as variáveis de ambiente. Deploy com 1 clique.

> Segurança: este MVP usa **SUPABASE_SERVICE_ROLE** apenas no servidor (route handlers). Não exponha essa chave no cliente.

---

## O que vem pronto
- Dashboard com buckets (**Atrasado**, **Hoje**, **Próximo**, **Concluído**).
- Filtros por **responsável**, **tipo** e **busca**.
- Painel lateral com **clientes + prioridade (1–10)**.
- Ações rápidas: **Concluir** e **Adiar** (PATCH via API).
- UI Apple‑like com **dark mode** automático.

## Próximos upgrades sugeridos
- Autenticação (Supabase Auth) por usuário.
- Histórico de OBS por cliente e agenda detalhada por etapa.
- Relatórios e exportação CSV de verdade.
- Notificações (e-mail/webpush) para atrasos.
