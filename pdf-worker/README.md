# Phaser PDF Worker

Worker Cloudflare care generează PDF-uri de calitate din HTML folosind Browser Rendering (Puppeteer).

## Setup

1. **Instalează dependențele:**
   ```bash
   cd pdf-worker
   npm install
   ```

2. **Autentificare Cloudflare:**
   ```bash
   npx wrangler login
   ```

3. **Activează Browser Rendering** în dashboard Cloudflare:
   - Workers & Pages → Overview → Browser Rendering
   - Sau la primul deploy, urmează instrucțiunile

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Copiază URL-ul Worker-ului** (ex: `https://phaser-pdf-worker.TAUL_TAU.workers.dev`) și setează-l în `index.html`:
   ```javascript
   const PDF_WORKER_URL = "https://phaser-pdf-worker.TAUL_TAU.workers.dev";
   ```

## Limitări (plan gratuit)

- 10 minute browser/zi
- Suficient pentru zeci de PDF-uri pe zi

## API

`POST /` cu body JSON:
```json
{
  "html": "<div>Conținut HTML</div>",
  "baseUrl": "https://example.com/"
}
```

Returnează PDF binary (`application/pdf`).
