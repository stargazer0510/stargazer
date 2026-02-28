-- ============================================================
-- 사주비서 데이터베이스 스키마
-- Supabase SQL 편집기에서 순서대로 실행하세요.
-- ============================================================

-- ── 1. categories ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          text NOT NULL UNIQUE,
  name          text NOT NULL,
  description   text NOT NULL DEFAULT '',
  price         integer NOT NULL DEFAULT 0,
  icon_url      text,
  avg_rating    numeric(3,2) NOT NULL DEFAULT 4.8,
  review_count  integer NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,
  sort_order    integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories 읽기" ON categories FOR SELECT USING (true);

-- 카테고리 초기 데이터
INSERT INTO categories (slug, name, description, price, avg_rating, review_count, is_active, sort_order) VALUES
  ('doha-sal',       '도화살 알아보기',  '나에게 도화살이 있는지, 연애운과 매력이 어떤지 분석합니다.',              3900, 4.8, 127, true,  1),
  ('name-score',     '나의 이름 점수',   '성명학을 기반으로 이름이 운명에 미치는 영향을 분석합니다.',               2900, 4.7, 84,  false, 2),
  ('reunion',        '재회 가능성',       '헤어진 연인과의 재회 가능성과 인연의 깊이를 분석합니다.',                4900, 4.9, 203, true,  3),
  ('compatibility',  '궁합 분석',         '두 사람의 사주로 알아보는 깊이 있는 궁합 분석입니다.',                   5900, 4.8, 315, true,  4),
  ('yearly-fortune', '올해 종합 운세',   '올해 전반적인 운의 흐름 — 연애, 재물, 건강, 직업운을 분석합니다.',       5900, 4.9, 428, true,  5)
ON CONFLICT (slug) DO NOTHING;


-- ── 2. profiles ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id             uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname       text,
  birth_date     date,
  gender         text CHECK (gender IN ('남', '여')),
  birth_time     text,
  saju_key       text,
  last_edited_at timestamptz,
  is_complete    boolean NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- 본인만 읽기/수정
CREATE POLICY "profiles 본인 읽기" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles 본인 수정" ON profiles FOR ALL    USING (auth.uid() = id);


-- ── 3. free_readings ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS free_readings (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id     uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  heavenly_stem   text NOT NULL,   -- 연주 천간 (갑/을/병/정/무/기/경/신/임/계)
  earthly_branch  text NOT NULL,   -- 연주 지지 (자/축/인/묘/진/사/오/미/신/유/술/해)
  gender          text NOT NULL CHECK (gender IN ('남', '여')),
  content         jsonb NOT NULL,  -- { summary, sections: [{title, body}] }
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- 동일 카테고리+천간+지지+성별 중복 방지
CREATE UNIQUE INDEX IF NOT EXISTS free_readings_unique
  ON free_readings (category_id, heavenly_stem, earthly_branch, gender);

ALTER TABLE free_readings ENABLE ROW LEVEL SECURITY;
-- 누구나 읽기 (로그인 불필요)
CREATE POLICY "free_readings 읽기" ON free_readings FOR SELECT USING (true);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER free_readings_updated_at
  BEFORE UPDATE ON free_readings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ── 4. orders ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number    text NOT NULL UNIQUE,
  category_id     uuid NOT NULL REFERENCES categories(id),
  user_id         uuid REFERENCES profiles(id),
  email           text,
  phone           text,
  birth_date      date NOT NULL,
  gender          text NOT NULL CHECK (gender IN ('남', '여')),
  birth_time      text NOT NULL,
  amount          integer NOT NULL,
  payment_method  text,
  payment_key     text,
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded')),
  has_review      boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  paid_at         timestamptz
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- 본인 주문 또는 비회원(user_id IS NULL)은 별도 처리
CREATE POLICY "orders 본인 읽기" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders 서비스 삽입" ON orders FOR INSERT WITH CHECK (true);


-- ── 5. subscriptions ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         uuid NOT NULL REFERENCES profiles(id),
  plan_type       text NOT NULL DEFAULT 'yearly',
  amount          integer NOT NULL,
  payment_method  text,
  payment_key     text,
  status          text NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired','cancelled')),
  starts_at       timestamptz NOT NULL DEFAULT now(),
  expires_at      timestamptz NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subscriptions 본인 읽기" ON subscriptions FOR SELECT USING (auth.uid() = user_id);


-- ── 6. generated_readings ──────────────────────────────────
CREATE TABLE IF NOT EXISTS generated_readings (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id        uuid NOT NULL REFERENCES orders(id),
  category_id     uuid NOT NULL REFERENCES categories(id),
  saju_key        text NOT NULL,
  content         jsonb NOT NULL,
  prompt_version  text NOT NULL DEFAULT 'v1',
  model_version   text NOT NULL DEFAULT 'claude-sonnet-4-6',
  tokens_used     integer,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE generated_readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "generated_readings 본인 읽기" ON generated_readings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );


-- ── 7. reviews ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id    uuid UNIQUE REFERENCES orders(id),
  category_id uuid NOT NULL REFERENCES categories(id),
  nickname    text NOT NULL,
  rating      integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content     text NOT NULL,
  image_urls  text[] NOT NULL DEFAULT '{}',
  is_admin    boolean NOT NULL DEFAULT false,
  is_deleted  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews 읽기" ON reviews FOR SELECT USING (NOT is_deleted);
CREATE POLICY "reviews 삽입" ON reviews FOR INSERT WITH CHECK (true);

-- avg_rating / review_count 자동 갱신 트리거
CREATE OR REPLACE FUNCTION refresh_category_stats()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE v_cat_id uuid;
BEGIN
  v_cat_id := COALESCE(NEW.category_id, OLD.category_id);
  UPDATE categories SET
    avg_rating   = (SELECT COALESCE(AVG(rating), 4.8) FROM reviews WHERE category_id = v_cat_id AND NOT is_deleted),
    review_count = (SELECT COUNT(*) FROM reviews WHERE category_id = v_cat_id AND NOT is_deleted)
  WHERE id = v_cat_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER reviews_stats
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION refresh_category_stats();
