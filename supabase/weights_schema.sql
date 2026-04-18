-- Couple Fitness: weights table
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS weights (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person     TEXT NOT NULL CHECK (person IN ('him', 'her')),
  date       DATE NOT NULL,
  weight     NUMERIC(5,1) NOT NULL,
  body_fat   NUMERIC(4,1),
  UNIQUE (person, date)
);

ALTER TABLE weights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read"   ON weights FOR SELECT USING (true);
CREATE POLICY "Public insert" ON weights FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON weights FOR UPDATE USING (true);
CREATE POLICY "Public delete" ON weights FOR DELETE USING (true);
