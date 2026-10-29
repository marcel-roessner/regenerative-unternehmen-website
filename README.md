# regenerative-unternehmen.de

Die Website von **Regenerative Unternehmen** – migriert von Wix auf eine statische Seite.
Gebaut mit [Eleventy](https://www.11ty.dev/), gehostet kostenlos auf **GitHub Pages**.

- Keine Cookies, kein Tracking, keine externen Schriften oder Skripte
- Blog in Markdown (`src/posts/*.md`) – ein neuer Beitrag ist eine neue Datei
- Alte Wix-Adressen bleiben erreichbar (`/post/…`, `/kartenset`, `/category/produkte`, …)

---

## Lokal starten

```bash
npm install
npm start        # Vorschau auf http://localhost:8080 mit Live-Reload
npm run build    # fertige Seite in _site/
```

Voraussetzung: [Node.js](https://nodejs.org/) ab Version 20.

## Online stellen (einmalig)

1. Auf GitHub ein neues Repository anlegen (z. B. `regenerative-unternehmen`) und diesen Ordner hochladen:
   ```bash
   git remote add origin git@github.com:DEIN-ACCOUNT/regenerative-unternehmen.git
   git push -u origin main
   ```
2. Im Repo: **Settings → Pages → Build and deployment → Source: „GitHub Actions“**.
   Ab jetzt baut und veröffentlicht jeder Push auf `main` die Seite automatisch.
3. **Eigene Domain:** Die Datei `src/static/CNAME` enthält bereits `www.regenerative-unternehmen.de`.
   Beim Domain-Anbieter einstellen:
   - `www` → **CNAME** auf `DEIN-ACCOUNT.github.io`
   - Root-Domain (`@`) → **A-Records** auf `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Danach in *Settings → Pages* die Domain eintragen und **„Enforce HTTPS“** aktivieren.
4. Erst wenn alles läuft: Wix-Abo kündigen. **Vorher** Newsletter-Abonnent:innen und Bestellungen aus Wix exportieren.

## Inhalte pflegen

| Was | Wo |
| --- | --- |
| E-Mail, LinkedIn, Shop-/Newsletter-/Formular-Links | `src/_data/site.json` |
| Team | `src/_data/team.json` |
| Produkte | `src/_data/products.json` + `src/product-*.njk` |
| Navigation | `src/_data/nav.json` |
| Seiten | `src/index.njk`, `src/mission.njk`, `src/kartenset.njk`, `src/kontakt.njk`, … |
| Blogbeiträge | `src/posts/*.md` |
| Farben & Schriften | `src/assets/css/main.css` (ganz oben: `:root`) |

### Neuer Blogbeitrag

Datei `src/posts/mein-beitrag.md` anlegen:

```markdown
---
title: "Titel des Beitrags"
description: "Ein bis zwei Sätze für Vorschau und Suchmaschinen."
date: "2026-11-15"
updated: "2026-11-15"
author: "Marcel Rößner"
image: "/assets/img/mein-titelbild"
tags: ["post", "Regeneration"]
permalink: "/post/mein-beitrag/"
---

Text in Markdown …
```

Bilder vorher optimieren: Originale in einen Ordner `raw-images/` legen und
`npm run optimize-images` ausführen. Es entstehen `name.webp` (1600 px) und `name-720.webp`
in `src/assets/img/`. Im Text dann `![Beschreibung](/assets/img/name.webp)`.

### Shop, Newsletter, Kontaktformular

Alles ist vorbereitet, aber noch nicht an einen Dienst angebunden. Solange die Felder in
`src/_data/site.json` leer sind, öffnen die Buttons eine vorausgefüllte E-Mail.

- **Shop:** z. B. einen [Stripe Payment Link](https://stripe.com/de/payments/payment-links) pro Produkt anlegen und in `shop.kartenset` eintragen.
- **Newsletter:** z. B. Brevo, Buttondown oder Mailchimp – Formular-Action in `newsletter.action` eintragen.
- **Kontaktformular:** z. B. [Formspree](https://formspree.io) – Endpoint in `contactFormAction` eintragen.

Jeder dieser Dienste muss in der Datenschutzerklärung ergänzt werden.

## Schriften

Die Seite nutzt genau drei Schriftfamilien, alle selbst gehostet in `src/assets/fonts/`
(DSGVO-freundlich, keine Google-Server):

- **Unbounded** – Überschriften (leicht) und Wortmarke/Kapitelnamen (fett), von [NaN](https://www.nan.xyz/fonts/unbounded) (SIL Open Font License)
- **Hanken Grotesk** – Fließtext (OFL)
- **IBM Plex Mono** – kleine Beschriftungen wie Datum, Bildunterschriften (OFL)

Eine lizenzierte NaN-Schrift lässt sich später über die Variablen `--f-head` bzw. `--f-wide`
in `main.css` einsetzen – dann am besten anstelle von Unbounded, damit es bei drei Schriften bleibt.

## Vor dem Livegang prüfen

- [ ] **Datenschutzerklärung** (`src/datenschutz.md`) ist ein Entwurf: Wix-, Google-Ads-, Analytics- usw. Abschnitte wurden entfernt, GitHub-Pages-Hosting ergänzt. Bitte rechtlich prüfen lassen (z. B. eRecht24-Generator neu durchlaufen).
- [ ] **Impressum:** auf DDG/MStV aktualisiert (TMG/RStV gelten nicht mehr).
- [ ] **Shop:** Bei Verkauf an Verbraucher braucht es AGB, Widerrufsbelehrung und Preisangaben inkl. MwSt.-Hinweis.
- [ ] **Bildrechte:** Wix-Stockfotos wurden bewusst nicht übernommen (deren Lizenz gilt nur auf Wix). Alle übernommenen Bilder stammen aus eurem eigenen Wix-Medienordner – bitte trotzdem kurz prüfen, ob für jedes Bild die Rechte vorliegen.
