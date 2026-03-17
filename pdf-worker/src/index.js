/**
 * Phaser PDF Worker — generează PDF din HTML folosind Cloudflare Browser Rendering
 * POST / cu body: { html: string, baseUrl?: string }
 * Returnează PDF binary
 */
import puppeteer from "@cloudflare/puppeteer";

export default {
  async fetch(request, env, ctx) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
    };

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Metoda POST necesară" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "Body JSON invalid" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const html = body.html;
    const baseUrl = body.baseUrl || "https://example.com/";

    if (!html || typeof html !== "string") {
      return new Response(JSON.stringify({ error: "Câmpul 'html' e obligatoriu" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    try {
      const browser = await puppeteer.launch(env.BROWSER);
      const page = await browser.newPage();

      const fullHtml = `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="utf-8"/>
  <base href="${baseUrl.replace(/"/g, "&quot;")}"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color-adjust:exact!important}
    body{font-family:'Helvetica Neue',Arial,sans-serif;background:#f4f4f4;padding:16px}
    @media print{body{padding:0;background:#f4f4f4}@page{margin:0.5cm}}
    img{max-width:100%;height:auto}
    .print-break{break-before:page!important;page-break-before:always!important}
    .offer-page-1{break-inside:avoid!important;page-break-inside:avoid!important}
  </style>
</head>
<body>${html}</body>
</html>`;

      await page.setContent(fullHtml, {
        waitUntil: "load",
        timeout: 15000,
      });

      const pdf = await page.pdf({
        printBackground: true,
        format: "A4",
        margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" },
      });

      await browser.close();

      return new Response(pdf, {
        headers: {
          "Content-Type": "application/pdf",
          ...corsHeaders,
        },
      });
    } catch (err) {
      console.error("PDF generation error:", err);
      return new Response(
        JSON.stringify({ error: "Eroare la generare PDF", details: String(err.message) }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  },
};
