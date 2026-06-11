-- ============================================================
-- Bolão Copa do Mundo 2026 — Schema Supabase
-- Execute este SQL no SQL Editor do seu projeto Supabase
-- ============================================================

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── TABELA: profiles ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE NOT NULL,
  total_points  INT NOT NULL DEFAULT 0,
  is_admin      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TABELA: matches ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.matches (
  id             INT PRIMARY KEY,
  group_id       CHAR(1) NOT NULL,
  round          INT NOT NULL CHECK (round IN (1, 2, 3)),
  home_team      TEXT NOT NULL,   -- código ex: 'BRA'
  away_team      TEXT NOT NULL,   -- código ex: 'MAR'
  match_datetime TIMESTAMPTZ NOT NULL,
  venue          TEXT,
  home_score     INT,
  away_score     INT,
  status         TEXT NOT NULL DEFAULT 'upcoming'
                 CHECK (status IN ('upcoming', 'live', 'finished')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TABELA: predictions ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.predictions (
  id         BIGSERIAL PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_id   INT NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  home_score INT NOT NULL CHECK (home_score >= 0),
  away_score INT NOT NULL CHECK (away_score >= 0),
  points     INT,               -- NULL = não calculado ainda
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, match_id)    -- 1 palpite por jogo por usuário
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- profiles: todos veem, só o dono edita o próprio
CREATE POLICY "profiles_select_all"  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own"  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own"  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- matches: todos veem, só admin atualiza
CREATE POLICY "matches_select_all"  ON public.matches FOR SELECT USING (true);
CREATE POLICY "matches_update_admin" ON public.matches FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- predictions: todos veem (para ranking), só o dono insere, sem update
CREATE POLICY "predictions_select_all"  ON public.predictions FOR SELECT USING (true);
CREATE POLICY "predictions_insert_own"  ON public.predictions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (SELECT 1 FROM public.predictions WHERE user_id = auth.uid() AND match_id = predictions.match_id)
    AND EXISTS (
      SELECT 1 FROM public.matches
      WHERE id = predictions.match_id
        AND match_datetime > NOW()
    )
  );
-- Sem policy de UPDATE para predictions — palpites são imutáveis

-- ─── FUNÇÃO: calcular pontos de um jogo ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.calculate_points_for_match(
  p_match_id   INT,
  p_home_score INT,
  p_away_score INT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  r RECORD;
  pts INT;
  actual_outcome INT;   -- -1 away, 0 draw, 1 home
  pred_outcome   INT;
BEGIN
  -- Determine actual outcome
  actual_outcome := CASE
    WHEN p_home_score > p_away_score THEN 1
    WHEN p_home_score < p_away_score THEN -1
    ELSE 0
  END;

  -- Loop through all predictions for this match
  FOR r IN
    SELECT id, user_id, home_score, away_score
    FROM public.predictions
    WHERE match_id = p_match_id
  LOOP
    pred_outcome := CASE
      WHEN r.home_score > r.away_score THEN 1
      WHEN r.home_score < r.away_score THEN -1
      ELSE 0
    END;

    -- Calculate points
    IF r.home_score = p_home_score AND r.away_score = p_away_score THEN
      pts := 3;  -- Placar exato
    ELSIF pred_outcome = actual_outcome THEN
      pts := 1;  -- Acertou vencedor ou empate
    ELSE
      pts := 0;  -- Errou
    END IF;

    -- Update prediction points
    UPDATE public.predictions
    SET points = pts
    WHERE id = r.id;

    -- Update user total points
    UPDATE public.profiles
    SET total_points = (
      SELECT COALESCE(SUM(points), 0)
      FROM public.predictions
      WHERE user_id = r.user_id
        AND points IS NOT NULL
    )
    WHERE id = r.user_id;
  END LOOP;
END;
$$;

-- ─── FUNÇÃO: trigger ao criar perfil automaticamente ─────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Só cria perfil se não existir (pode ser criado manualmente no cadastro)
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── PUBLICAR TABELAS NO REALTIME ─────────────────────────────────────────────
-- Execute no SQL Editor do Supabase:
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.predictions;
