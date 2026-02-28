# Phaser Manager → Produs SaaS
## Roadmap complet: de la tool personal la produs vandabil

---

## Viziunea produsului

Un tool de management all-in-one pentru trupe muzicale: evenimente, oferte profesionale, contracte, facturi automate, calendar, rider tehnic, press kit. Pornind din experiența reală a trupei Phaser, scalat spre orice formație.

**Piața țintă:** Trupe și artiști din România (10.000+ formații active) care azi gestionează totul prin Excel, WhatsApp și email.

**Propunere de valoare:** Tot ce are nevoie o trupă ca să arate profesional față de clienți — într-o singură aplicație.

---

## Faza 0 — Fundație
### "Aplicația online, datele în cloud"
**Durată estimată: 2–3 săptămâni**

Scopul acestei faze este să mutăm aplicația din browser-ul local pe internet, cu date stocate în cloud în loc de localStorage.

**Ce se întâmplă concret:**

- Cod urcat pe **GitHub** (repo privat `raczradu/phaser-manager`)
- Aplicație publicată pe **Netlify** → `phaser.netlify.app` sau domeniu custom
- **Login cu Google** (Sign in with Google) — nu mai există risc să pierzi datele dacă se schimbă browserul sau calculatorul
- Date mutate din localStorage în **Supabase** (bază de date cloud, PostgreSQL)
- Backup automat inclus — Supabase face backup zilnic

**De ce Supabase și nu Google Drive pentru date?**
Google Drive e perfect pentru fișiere (PDF-uri, contracte, poze). Dar pentru date structurate (evenimente cu câmpuri, oferte, task-uri), o bază de date relațională e mult mai rapidă, mai sigură și mai ușor de extins. Supabase Free tier e gratuit până la aproximativ 10 clienți activi.

**Deliverables Faza 0:**
- [ ] GitHub repo privat creat și configurat
- [ ] Netlify deployment funcțional (link public)
- [ ] Google OAuth login
- [ ] Date Phaser migrate în Supabase
- [ ] Backup automat activ

---

## Faza 1 — Phaser Live
### "Folosim aplicația pentru toate evenimentele reale"
**Durată estimată: 4–6 săptămâni**

Scopul este să testăm produsul în condiții reale, cu evenimentele adevărate ale trupei Phaser. Fiecare problemă descoperită acum e o problemă pe care nu o vor avea clienții viitori.

**Funcționalități noi:**

**Facturi automate (factureaza.ro)**
- Buton "Generează factură" în fiecare eveniment finalizat
- Datele clientului și suma se completează automat din eveniment
- Factura apare în contul tău factureaza.ro gata de trimis
- Suportă e-Factura ANAF automat

**Google Calendar sync**
- Evenimentele din Phaser Manager apar automat în Google Calendar al trupei
- Modificările se sincronizează în timp real
- Membrii trupei văd evenimentele în propriul calendar

**Upload fișiere**
- Contracte semnate (PDF), dovezi de plată, rider-uri — stocate în Supabase Storage
- Organizate per eveniment

**Email direct din aplicație**
- Trimiți oferta clientului direct din app
- Template profesional cu logo Phaser

**Notificări & remindere**
- Reminder automat cu X zile înainte de eveniment
- Alertă când un avans nu a fost plătit

**Deliverables Faza 1:**
- [ ] Integrare factureaza.ro (GraphQL API)
- [ ] Google Calendar sync
- [ ] Upload fișiere per eveniment
- [ ] Trimitere email ofertă din app
- [ ] Sistem notificări/remindere
- [ ] UI optimizat pentru mobil

---

## Faza 2 — Productizare
### "Transformăm din tool Phaser în produs generic"
**Durată estimată: 4–6 săptămâni**

Până acum aplicația e croită pe Phaser. În această fază o transformăm într-un produs pe care orice trupă îl poate folosi.

**Ce se schimbă:**

**Multi-tenancy**
Fiecare trupă are datele ei complet izolate. Trupa A nu vede nimic din datele trupei B. Implementat prin Row Level Security în Supabase.

**Onboarding flow**
O trupă nouă completează în 10 minute:
1. Datele firmei / PFA
2. Logo și culori brand
3. Conectare Google Calendar
4. Conectare factureaza.ro (API key)
5. Template ofertă și contract

**Branding personalizabil per trupă**
- Logo propriu în oferte și contracte
- Culori brand
- Date firmă (CUI, IBAN, adresă)

**Template system**
Fiecare trupă își personalizează:
- Textul ofertei
- Clauzele contractului
- Rider tehnic
- Press kit

**Landing page produs**
- Prezentare produs, features, pricing
- Demo video (screen recording din aplicație)
- Buton "Încearcă gratuit 14 zile"

**Deliverables Faza 2:**
- [ ] Multi-tenancy complet (Row Level Security)
- [ ] Onboarding flow nou utilizator (< 10 minute)
- [ ] Branding 100% personalizabil
- [ ] Landing page publicat
- [ ] Pricing page

---

## Faza 3 — Beta Launch
### "Primii clienți plătitori"
**Durată estimată: 2–4 săptămâni**

**Recrutare beta testeri**
2-3 trupe prietene care testează gratuit (sau la preț redus) și oferă feedback sincer. Ideal trupe care au deja evenimente comerciale (nunți, corporate) nu doar concerte.

**Integrare plăți (Stripe)**
- Abonament lunar sau anual
- Trial gratuit 14 zile
- Plată cu card sau prin ordin de plată (pentru firme)

**Feedback loop rapid**
- Chat suport direct în aplicație (Crisp sau Intercom — variante gratuite)
- Formular feedback post-eveniment
- Fix rapid pe baza problemelor raportate

**Launch public**
- Post Facebook/Instagram în comunități de muzicieni
- Grupuri: "Muzicieni România", "Event Planners Romania", etc.
- Outreach direct la agenții de booking

**Deliverables Faza 3:**
- [ ] 3-5 beta testeri activi
- [ ] Stripe integration
- [ ] Trial gratuit 14 zile
- [ ] 1-2 clienți plătitori

---

## Stack tehnic

| Layer | Tehnologie | Rol |
|---|---|---|
| Frontend | React (deja scris) | Interfața utilizatorului |
| Build & hosting | Netlify | Publicare, HTTPS, deploy automat |
| Backend / DB | Supabase | Bază de date, auth, storage, API |
| Auth | Google OAuth via Supabase | Login cu contul Google |
| Facturare | factureaza.ro API (GraphQL) | Generare facturi automate |
| Calendar | Google Calendar API | Sync evenimente |
| Serverless | Netlify Functions | Proxy pentru API-uri cu chei secrete |
| Plăți | Stripe | Abonamente |
| Email | Resend (gratuit 3K/lună) | Trimitere oferte, notificări |

---

## Costuri infrastructură

| Serviciu | Plan | Cost/lună |
|---|---|---|
| Netlify | Free | €0 |
| Supabase | Free (până la ~500MB date) | €0 |
| Resend (email) | Free (3.000 emails/lună) | €0 |
| **Total la start** | | **€0** |
| Supabase Pro (după 10+ clienți activi) | Pro | ~€23 |
| Netlify Pro (dacă depășești limitele) | Pro | ~€18 |
| **Total la scară** | | **~€41/lună** |

---

## Model de pricing propus

| Plan | Preț | Pentru cine |
|---|---|---|
| **Starter** | €15/lună | Formații mici, puține evenimente/an |
| **Pro** | €25/lună | Formații active, evenimente comerciale |
| **Studio** | €45/lună | Agenții, manageri cu mai mulți artiști |

### Break-even și profitabilitate

| Nr. clienți Pro (€25) | Venit lunar | Profit (după infra €41) |
|---|---|---|
| 3 clienți | €75 | €34 |
| 5 clienți | €125 | €84 |
| 10 clienți | €250 | €209 |
| 20 clienți | €500 | €459 |
| 50 clienți | €1.250 | €1.209 |

La 5 clienți Pro ești pe profit. La 20 clienți ai €500/lună pasiv.

---

## Timeline estimativ

```
Luna 1      → Faza 0: Online + Google login + Supabase
Luna 2-3    → Faza 1: Phaser folosește live, facturi, calendar
Luna 3-4    → Faza 2: Productizare, multi-tenancy, landing page
Luna 5      → Faza 3: Beta cu 3-5 trupe, primii bani
Luna 6+     → Creștere, marketing, noi funcționalități
```

---

## Primul pas concret (azi)

Cel mai important lucru acum nu este să construim totul — ci să punem **fundația corectă** ca să nu trebuiască să refacem lucrurile.

**Azi:**
1. Creăm GitHub repo privat
2. Publicăm aplicația pe Netlify
3. Planificăm migrarea la Supabase

Aplicația Phaser (versiunea ta personală) rămâne funcțională pe tot parcursul — nu o „stricăm" în timp ce construim.

---

*Roadmap creat: Februarie 2026*
