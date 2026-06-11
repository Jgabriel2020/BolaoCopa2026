# Bolão Copa do Mundo 2026 — Guia de Configuração

## 1. Criar conta e projeto no Supabase

1. Acesse https://supabase.com e crie uma conta gratuita
2. Clique em **New Project**
3. Dê um nome (ex: `bolao-copa-2026`), defina uma senha e escolha a região mais próxima (South America - São Paulo)
4. Aguarde o projeto inicializar (~2 minutos)

---

## 2. Configurar o banco de dados

No painel do Supabase, acesse **SQL Editor** (ícone de código) e execute:

**Passo 2.1 — Schema:**
- Clique em `New Query`
- Cole o conteúdo de `supabase/schema.sql`
- Clique em **Run** ▶

**Passo 2.2 — Dados dos jogos:**
- Crie outra query
- Cole o conteúdo de `supabase/seed.sql`
- Clique em **Run** ▶

---

## 3. Configurar Realtime

No SQL Editor, execute:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.predictions;
```

---

## 4. Pegar as chaves da API

1. No painel do Supabase, vá em **Settings → API**
2. Copie:
   - **Project URL** (ex: `https://xyzabc.supabase.co`)
   - **anon public** key

---

## 5. Configurar o site

Abra o arquivo `src/supabase.js` e substitua:

```js
const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co'
const SUPABASE_ANON_KEY = 'SUA_ANON_KEY_AQUI'
```

Pelos valores que você copiou no passo 4.

---

## 6. Abrir o site

Abra `index.html` diretamente no navegador — **ou** use um servidor local simples.

### Opção A — Python (se tiver instalado)
```bash
python -m http.server 8080
```
Abra: http://localhost:8080

### Opção B — Node.js (se tiver instalado)
```bash
npx serve .
```

### Opção C — VS Code
Instale a extensão **Live Server** e clique em "Go Live".

---

## 7. Configurar administrador

Para poder inserir resultados dos jogos, um usuário precisa ser admin.

Após criar sua conta no site, execute no SQL Editor:
```sql
UPDATE public.profiles
SET is_admin = TRUE
WHERE username = 'SEU_USERNAME';
```

---

## 8. Como funciona a pontuação

| Acerto | Pontos |
|--------|--------|
| Placar exato (ex: acertou 2×1 e foi 2×1) | **3 pontos** |
| Vencedor correto ou empate (acertou quem ganhou) | **1 ponto** |
| Errou | **0 pontos** |

A pontuação é calculada automaticamente quando o admin salva o resultado de um jogo.

---

## 9. N8N — Atualização automática de resultados (opcional)

Para atualizar os resultados automaticamente via N8N:

1. No N8N, crie um workflow com um nó **Schedule Trigger** (ex: a cada 5 min durante a Copa)
2. Use um nó **HTTP Request** para buscar resultados de uma API de football (ex: api-football.com)
3. Para cada jogo finalizado, use um nó **Supabase** ou **HTTP Request** para chamar:

```
POST https://SEU_PROJETO.supabase.co/rest/v1/rpc/calculate_points_for_match
Headers:
  apikey: SUA_SERVICE_ROLE_KEY
  Content-Type: application/json

Body:
{
  "p_match_id": 6,
  "p_home_score": 2,
  "p_away_score": 1
}
```

E antes, atualizar o placar na tabela matches:
```
PATCH https://SEU_PROJETO.supabase.co/rest/v1/matches?id=eq.6
Headers:
  apikey: SUA_SERVICE_ROLE_KEY
  Content-Type: application/json

Body:
{
  "home_score": 2,
  "away_score": 1,
  "status": "finished"
}
```

> ⚠️ Para o N8N, use a **service_role key** (em Settings → API), não a anon key.

---

## Estrutura dos arquivos

```
index.html              — Página principal
src/
  app.js               — Roteador principal
  supabase.js          — Configuração do Supabase ← editar aqui!
  data/
    matches.js         — Todos os 72 jogos + dados dos times
  pages/
    auth.js            — Login e cadastro
    dashboard.js       — Jogos e palpites
    ranking.js         — Ranking em tempo real
    mypicks.js         — Meus palpites
    admin.js           — Painel admin (inserir resultados)
  components/
    header.js          — Navegação
    toast.js           — Notificações
supabase/
  schema.sql           — Estrutura do banco
  seed.sql             — Dados dos jogos
```
