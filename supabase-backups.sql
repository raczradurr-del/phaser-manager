-- ═══════════════════════════════════════════════════
-- Phaser Manager — Backups table
-- Rulează în Supabase → SQL Editor
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS backups (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  backup_date DATE        NOT NULL,
  label       TEXT        NOT NULL,
  data        JSONB       NOT NULL
);

-- Index pentru căutare rapidă după dată
CREATE INDEX IF NOT EXISTS backups_date_idx ON backups(backup_date DESC);

-- RLS: permite toate operațiunile (la fel ca app_data)
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on backups" ON backups;
CREATE POLICY "Allow all on backups" ON backups
  FOR ALL USING (true) WITH CHECK (true);
