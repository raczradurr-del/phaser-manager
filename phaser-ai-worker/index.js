// Phaser AI Worker — Cloudflare AI
// - Chat: Llama 3.1 8B Instruct
// - Buletin / CI: Llama 3.2 11B Vision Instruct (prima dată pe cont: POST { "metaVisionAgree": true })
// Deploy: npx wrangler deploy → phaser-ai-worker.<subdomain>.workers.dev

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const VISION_MODEL = "@cf/meta/llama-3.2-11b-vision-instruct";

const ID_CARD_JSON_SCHEMA = {
  type: "object",
  properties: {
    clientNume: { type: "string" },
    cnp: { type: "string" },
    ciSeria: { type: "string" },
    ciNr: { type: "string" },
    jud: { type: "string" },
    localitate: { type: "string" },
    adresaDomiciliu: { type: "string" },
  },
  required: ["clientNume", "cnp", "ciSeria", "ciNr", "jud", "localitate", "adresaDomiciliu"],
};

function splitVisionAiResult(aiRes) {
  let parsedOut = null;
  let text = "";
  if (aiRes && typeof aiRes === "object") {
    const r = aiRes.response;
    if (r && typeof r === "object" && !Array.isArray(r)) {
      parsedOut = r;
    } else if (typeof r === "string") {
      text = r.trim();
    } else {
      text = String(r ?? aiRes.result ?? aiRes.text ?? "").trim();
    }
    if (!parsedOut && !text && Array.isArray(aiRes.data)) {
      const first = aiRes.data[0];
      if (first && typeof first === "object") {
        const rr = first.response ?? first.result;
        if (rr && typeof rr === "object" && !Array.isArray(rr)) parsedOut = rr;
        else text = (typeof rr === "string" ? rr : String(rr ?? first.text ?? "")).trim();
      }
    }
  } else {
    text = String(aiRes || "").trim();
  }
  return { parsed: parsedOut, text };
}

function tryParseIdCardJsonFromText(text) {
  let s = String(text || "").trim();
  s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  let parsed;
  try {
    parsed = JSON.parse(s);
  } catch {
    const i0 = s.indexOf("{");
    const i1 = s.lastIndexOf("}");
    if (i0 < 0 || i1 <= i0) return null;
    try {
      parsed = JSON.parse(s.slice(i0, i1 + 1));
    } catch {
      return null;
    }
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  return parsed;
}

function idCardParsedHasAnyValue(o) {
  if (!o || typeof o !== "object") return false;
  const keys = ["clientNume", "cnp", "ciSeria", "ciNr", "jud", "localitate", "adresaDomiciliu"];
  return keys.some((k) => String(o[k] ?? "").trim() !== "");
}

function textLooksLikeVisionRefusal(t) {
  const s = String(t || "").slice(0, 500).toLowerCase();
  if (!s.trim()) return false;
  if (/\{/.test(s) && /\}/.test(s)) return false;
  return /cannot read|can't read|unable to read|not possible|i don't|i am not able|i'm not able|can't assist|refuse|nu pot citi|nu este posibil/i.test(
    s
  );
}

async function runVisionIdCardOnce(env, imageDataUrl, messages, useJsonSchema, maxTokens) {
  const baseOpts = { messages, image: imageDataUrl, max_tokens: maxTokens };
  if (!useJsonSchema) {
    return await env.AI.run(VISION_MODEL, baseOpts);
  }
  try {
    return await env.AI.run(VISION_MODEL, {
      ...baseOpts,
      response_format: {
        type: "json_schema",
        json_schema: ID_CARD_JSON_SCHEMA,
      },
    });
  } catch (e) {
    const msg = String(e && e.message ? e.message : e);
    if (/JSON Mode|json schema|couldn'?t be met|json_schema/i.test(msg)) {
      return await env.AI.run(VISION_MODEL, baseOpts);
    }
    throw e;
  }
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json();

      /** O singură dată per cont Cloudflare — acceptă licența Meta pentru Llama 3.2 Vision (documentație CF). */
      if (body && body.metaVisionAgree === true) {
        try {
          await env.AI.run("@cf/meta/llama-3.2-11b-vision-instruct", { prompt: "agree" });
        } catch (e) {
          // Cloudflare poate arunca mesajul 5016 „Thank you for agreeing…” chiar la succes — îl tratăm ca OK.
          const msg = String(e && e.message ? e.message : e);
          if (!/Thank you for agreeing|5016/.test(msg)) throw e;
        }
        return new Response(
          JSON.stringify({
            ok: true,
            message: "Licență Meta acceptată pentru Llama 3.2 Vision. Poți folosi citirea din buletin.",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (body && body.visionIdCard === true && body.imageDataUrl) {
        const imageDataUrl = String(body.imageDataUrl || "").trim();
        if (!/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(imageDataUrl)) {
          return new Response(
            JSON.stringify({
              error: "Imaginea trebuie să fie data:image/jpeg|png|webp;base64,...",
            }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const sysEn =
          "You are an OCR assistant for Romanian ID cards. " +
          "You MUST respond with nothing except one JSON object — no apologies, no 'I cannot', no English explanations, no markdown. " +
          "If unsure, use empty strings \"\" for fields. " +
          "Keys: clientNume (UPPERCASE full name), cnp (13 digits), ciSeria (2 letters), ciNr (digits), " +
          "jud, localitate, adresaDomiciliu from DOMICILIU block only — not birthplace L-N line, not card header country.";

        const userEn =
          "Read the Romanian ID card. Output ONLY JSON with keys clientNume, cnp, ciSeria, ciNr, jud, localitate, adresaDomiciliu. " +
          "Domiciliu fields from domiciliu section only; ignore place of birth for jud, localitate, adresaDomiciliu.";

        const jsonTemplate =
          '{"clientNume":"","cnp":"","ciSeria":"","ciNr":"","jud":"","localitate":"","adresaDomiciliu":""}';

        /** Mai multe încercări: schema → fără schema (uneori refuză mai rar) → prompt RO. */
        const attempts = [
          {
            schema: true,
            max_tokens: 768,
            messages: [
              { role: "system", content: sysEn },
              { role: "user", content: userEn },
            ],
          },
          {
            schema: false,
            max_tokens: 896,
            messages: [
              {
                role: "system",
                content:
                  "Output only valid JSON, one object, no markdown, no other words. " +
                  "Empty string \"\" for unreadable fields.",
              },
              {
                role: "user",
                content:
                  "Romanian national ID card. Fill this exact shape (replace empty strings): " +
                  jsonTemplate +
                  " jud/localitate/adresaDomiciliu = DOMICILIU lines only, not birthplace.",
              },
            ],
          },
          {
            schema: false,
            max_tokens: 896,
            messages: [
              { role: "system", content: "Răspunde doar cu un obiect JSON valid, fără alt text." },
              {
                role: "user",
                content:
                  "Citește cartea de identitate românească din imagine. " +
                  "Chei: clientNume, cnp, ciSeria, ciNr, jud, localitate, adresaDomiciliu. " +
                  "Pentru jud, localitate, adresaDomiciliu folosește doar blocul DOMICILIU, nu locul nașterii.",
              },
            ],
          },
          {
            schema: true,
            max_tokens: 768,
            messages: [
              {
                role: "system",
                content:
                  "JSON only. Romanian ID card fields. Never reply in sentences. Unknown field = \"\".",
              },
              {
                role: "user",
                content:
                  "Extract: clientNume, cnp, ciSeria, ciNr, jud, localitate, adresaDomiciliu from the image. " +
                  "Last three from residence/domiciliu, not birth place.",
              },
            ],
          },
        ];

        let lastText = "";

        for (const att of attempts) {
          let aiRes;
          try {
            aiRes = await runVisionIdCardOnce(env, imageDataUrl, att.messages, att.schema, att.max_tokens);
          } catch {
            continue;
          }

          const { parsed, text } = splitVisionAiResult(aiRes);
          if (text) lastText = text;

          if (parsed && idCardParsedHasAnyValue(parsed)) {
            return new Response(JSON.stringify({ parsed }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }

          if (text && !textLooksLikeVisionRefusal(text)) {
            const j = tryParseIdCardJsonFromText(text);
            if (idCardParsedHasAnyValue(j)) {
              return new Response(JSON.stringify({ parsed: j }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              });
            }
          }
        }

        if (!lastText) {
          return new Response(
            JSON.stringify({
              error:
                "Modelul vision nu a returnat un răspuns folositor după mai multe încercări. Încearcă JPEG mai mic (lumină uniformă, buletin întreg în cadru).",
            }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(JSON.stringify({ raw: lastText }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { messages, system } = body || {};
      if (!Array.isArray(messages)) {
        return new Response(
          JSON.stringify({
            error: "Trimite { messages: [...], system?: string } sau { visionIdCard: true, imageDataUrl }.",
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const llamaMessages = [
        ...(system ? [{ role: "system", content: system }] : []),
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ];

      const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: llamaMessages,
        max_tokens: 1024,
      });

      return new Response(JSON.stringify({ response: response.response }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(
        JSON.stringify({ error: String(e && e.message ? e.message : e) }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  },
};
