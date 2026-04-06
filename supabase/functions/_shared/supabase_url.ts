/** Fără slash final — altfel `...co/` + `/functions` dă `//functions` și redirect_uri nu mai potrivește Google Console. */
export function supabaseOrigin(): string {
  return (Deno.env.get("SUPABASE_URL") || "").trim().replace(/\/+$/, "");
}

export function googleOAuthCallbackUrl(): string {
  const o = supabaseOrigin();
  if (!o) throw new Error("SUPABASE_URL missing");
  return `${o}/functions/v1/google-calendar-oauth-callback`;
}
