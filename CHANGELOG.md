# Phaser Manager — Modificări

## Implementat în această sesiune

### 0. Stage plot integrat
- Imaginea `StagePlot.png` din folder este afișată direct în secțiunea Rider Tehnic (Plan amplasament).
- Nu mai apare textul „disponibil la cerere”.

### 1. Privat / Public — contrast
- Butoanele "Privat" și "Public" au acum fundal alb (#fff) și text negru — se văd clar în orice temă.

### 2. Rider tehnic — doar pt Corporate / Private Party / Altele
- Tab-ul "Rider" în preview ofertă apare doar pentru Corporate, Private Party, Altele.
- Pentru Nuntă și Botez — nu apare rider tehnic.
- În formularul de ofertă, tab-ul "Tehnic" dispare pentru Nuntă/Botez.

### 3. Necesar tehnic — ca anexă opțională
- Checkbox "Include necesar tehnic ca anexă în ofertă" în tab Tehnic (doar pentru Corporate, Private Party, Altele).
- Secțiunea "Necesar tehnic" în ofertă apare doar când e bifat.

### 4. Modalitate plată
- Restul sumei: "5 zile după eveniment" (implicit).
- Câmp nou "Rest — zile după eveniment" în formular (editabil, implicit 5).
- În contract: numărul de zile e editabil.
- Plată prin virament bancar (menționat).

### 5. Ofertă finală
- Logo PHASER mărit (32px → 48px).
- Total scos din header — nu mai apare direct, se evită "sperietura".
- Totalul rămâne în secțiunea "Modalitate plată" (Avans + Rest).

### 6. Secțiuni template (meniu)
- Tab nou **Secțiuni** în navigare.
- **Rider**: denumire editabilă.
- **Playlist**: template editabil — adaugi/ștergi/modifici piese. Folosit ca bază pentru oferte private.
- **Press Kit Privat / Public**: denumiri editabile.
- **Poveste / Media**: text editabil care apare în oferta privată ca secțiune „Despre noi” — să cucerească oamenii.

### 7. Tasks Notion-style
- **Listă / Calendar**: toggle între vizualizări.
- **Reminder**: dată scadentă per task.
- **Subtasks**: sub-sarcini cu checkbox.
- **Discussion**: câmp note/comentarii per task.
- Expandare task (buton +) pentru detalii.

### 8. Ofertă privată — poveste
- Secțiune „Despre noi” cu textul din template Poveste.
- Poate fi suprascris per eveniment (ev.poveste).

---

## De făcut ulterior

- **Media (Public)**: format diferit de privat (fără video-uri ca la privat) — de clarificat.
- **Persistență tasks**: salvare în localStorage (opțional).
