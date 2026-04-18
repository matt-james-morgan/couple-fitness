-- Couple Fitness: recipes table
-- Run this in the Supabase SQL Editor before running seed.sql

CREATE TABLE IF NOT EXISTS recipes (
  id           TEXT PRIMARY KEY,
  emoji        TEXT NOT NULL DEFAULT '',
  name         TEXT NOT NULL,
  category     TEXT NOT NULL CHECK (category IN ('breakfast','lunch','dinner','snack','preworkout')),
  tags         TEXT[] NOT NULL DEFAULT '{}',
  prep_time    TEXT NOT NULL DEFAULT '',
  kcal         INTEGER NOT NULL DEFAULT 0,
  protein      INTEGER NOT NULL DEFAULT 0,
  carbs        INTEGER NOT NULL DEFAULT 0,
  fat          INTEGER NOT NULL DEFAULT 0,
  base_servings INTEGER NOT NULL DEFAULT 1,
  ingredients  TEXT[] NOT NULL DEFAULT '{}',
  steps        TEXT[] NOT NULL DEFAULT '{}',
  his_note     TEXT,
  her_note     TEXT,
  tip          JSONB
);

-- Enable row-level security and allow public reads (no login needed in the app)
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON recipes
  FOR SELECT USING (true);
