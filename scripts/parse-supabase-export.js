#!/usr/bin/env node
/**
 * Usage: node scripts/parse-supabase-export.js phaser-export.json
 * Input: JSON array from Table Editor export, e.g. [{ idx, id, data: "<escaped json string>", updated_at }]
 * Output: phaser_main-data.json, phaser_gcal-data.json (pretty JSON for Table Editor → app_data.data)
 */
const fs = require("fs");
const path = process.argv[2];
if (!path || !fs.existsSync(path)) {
  console.error("Usage: node scripts/parse-supabase-export.js <export.json>");
  process.exit(1);
}
const arr = JSON.parse(fs.readFileSync(path, "utf8"));
if (!Array.isArray(arr)) {
  console.error("Expected a JSON array");
  process.exit(1);
}
for (const row of arr) {
  if (!row || !row.id) continue;
  let inner;
  try {
    inner = typeof row.data === "string" ? JSON.parse(row.data) : row.data;
  } catch (e) {
    console.error("Parse error for id", row.id, e.message);
    continue;
  }
  const safe = String(row.id).replace(/[^a-z0-9_-]/gi, "_");
  const outFile = `${safe}-data.json`;
  fs.writeFileSync(outFile, JSON.stringify(inner, null, 2), "utf8");
  console.log("Written:", outFile);
}
