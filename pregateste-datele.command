#!/bin/bash
cd "$(dirname "$0")"
EXPORT=""
if [ -f phaser-export.json ]; then EXPORT="phaser-export.json"
elif [ -f phaser-export.txt ]; then EXPORT="phaser-export.txt"
else
  echo "LIPSEȘTE phaser-export.json sau phaser-export.txt — vezi CITESTE-MIGRARE.txt"
  read -r _
  exit 1
fi
node scripts/parse-supabase-export.js "$EXPORT"
echo "Gata. Copiază conținutul fișierelor *-data.json în Supabase (vezi CITESTE-MIGRARE.txt)"
open .
read -r _
