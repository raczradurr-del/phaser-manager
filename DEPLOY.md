# Phaser Manager — Deploy pe Netlify

## Pasul 1: Creează repo pe GitHub

1. Mergi la [github.com/new](https://github.com/new)
2. Nume repo: `phaser-manager` (sau altceva)
3. Alege **Private** sau **Public**
4. **NU** bifa „Add a README" — repo-ul trebuie gol
5. Click **Create repository**

## Pasul 2: Push codul pe GitHub

În terminal, din folderul proiectului:

```bash
cd "/Users/raczradu/Downloads/Phaser Manager"
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TE_USERNAME/phaser-manager.git
git push -u origin main
```

Înlocuiește `TE_USERNAME` cu username-ul tău GitHub și `phaser-manager` cu numele repo-ului dacă e diferit.

## Pasul 3: Conectează Netlify la GitHub

1. Mergi la [app.netlify.com](https://app.netlify.com)
2. **Add new site** → **Import an existing project**
3. **Connect to GitHub** → autorizează Netlify
4. Alege repo-ul `phaser-manager`
5. Setări build (deja corecte din netlify.toml):
   - **Build command:** (gol)
   - **Publish directory:** `.`
6. **Deploy site**

## Actualizări automate

După ce e conectat, la fiecare `git push` Netlify face deploy automat:

```bash
git add .
git commit -m "Descriere modificări"
git push
```

## Varianta alternativă: Drag & Drop

Dacă nu vrei Git, poți trage folderul direct pe [app.netlify.com](https://app.netlify.com) — dar nu vei avea actualizări automate.
