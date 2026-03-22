-- ============================================================
-- Phaser Manager — Fix RLS pentru app_data
-- ============================================================
-- Rulează în Supabase Dashboard → SQL Editor
--
-- PROBLEMĂ: Policy-ul vechi bloca salvările pentru că cerea
-- auth.role() = 'authenticated', dar aplicația folosește cheia
-- anon fără sesiune de login Supabase.
-- Rezultat: toate salvările eșuau silențios, datele rămâneau
-- doar în localStorage și se pierdeau la clear cache.
--
-- SOLUȚIE: Permitem accesul complet pe app_data (citire + scriere)
-- pentru orice request. Acest lucru e sigur pentru o aplicație
-- internă de trupă unde cheia anon e știută de toți membrii.
-- ============================================================

DROP POLICY IF EXISTS "Allow authenticated users for app_data" ON app_data;
DROP POLICY IF EXISTS "Allow all for app_data" ON app_data;
DROP POLICY IF EXISTS "app_data_anon_all" ON app_data;

CREATE POLICY "app_data_anon_all" ON app_data
  FOR ALL
  USING (true)
  WITH CHECK (true);
