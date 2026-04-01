#!/bin/bash
# Rulează din folderul "Phaser Manager" (dublu-click sau Terminal).
cd "$(dirname "$0")"
EXPORT=""
if [ -f phaser-export.json ]; then
  EXPORT="phaser-export.json"
elif [ -f phaser-export.txt ]; then
  EXPORT="phaser-export.txt"
else
  echo ""
  echo "LIPSEȘTE phaser-export.json SAU phaser-export.txt"
  echo "Pune în acest folder unul din ele cu textul care începe cu [ și conține phaser_main"
  echo ""
  exit 1
fi
node scripts/parse-supabase-export.js "$EXPORT"
echo ""
echo "Gata. Deschid folderul — copiază din phaser_main-data.json și phaser_gcal-data.json"
open .
