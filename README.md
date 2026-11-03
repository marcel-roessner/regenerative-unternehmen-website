# regenerative-unternehmen.de

Die Website von **Regenerative Unternehmen** – migriert von Wix auf eine statische Seite.
Gebaut mit [Eleventy](https://www.11ty.dev/), gehostet in der EU auf **[statichost.eu](https://www.statichost.eu)**, Redaktion mit **[Sveltia CMS](https://sveltiacms.app)** unter `/admin`.

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

**Repo (privat) bei GitHub, Website bei statichost.eu (Schweden, nur europäische Server).**

1. **GitHub:** Neues *privates* Repository anlegen (z. B. `regenerative-unternehmen`) und hochladen:
   ```bash
   git remote add origin git@github.com:DEIN-ACCOUNT/regenerative-unternehmen.git
   git push -u origin main
   ```
   Im GitHub-Konto **Zwei-Faktor-Authentifizierung** aktivieren (Settings → Password and authentication).
   Wenn ihr eine GitHub-Organisation nutzt: Organisation → Settings → Authentication security → „Require two-factor authentication“.
2. **statichost.eu:** Konto anlegen (Tarif „Hobby“ ist kostenlos) → neue Site mit der **SSH-Adresse** des Repos.
   Den angezeigten öffentlichen Schlüssel bei GitHub unter *Repo → Settings → Deploy keys* eintragen (nur Lesezugriff).
   Für automatische Veröffentlichung bei jeder Änderung den Webhook aus dem statichost-Dashboard bei GitHub unter *Repo → Settings → Webhooks* eintragen.
   Die Build-Einstellungen stehen bereits in `statichost.yml` (Node 22, `npm ci && npm run build`, Ausgabe `_site`).
3. **AV-Vertrag:** Den Auftragsverarbeitungsvertrag von statichost.eu (https://www.statichost.eu/dpa/) ausdrucken, unterschreiben und an statichost senden – die Datenschutzerklärung geht davon aus.
4. **Domain:** Im statichost-Dashboard unter *Settings → Domains* `www.regenerative-unternehmen.de` und `regenerative-unternehmen.de` eintragen. Beim Domain-Anbieter:
   - `www` → **CNAME** auf `SITENAME.statichost.page.`
   - Root-Domain → **ALIAS** auf `SITENAME.statichost.page.` (oder `A 95.217.26.94` und `AAAA 2a01:4f9:c01f:8002::`)
   HTTPS wird automatisch eingerichtet.
5. **Redaktion:** In `src/admin/config.yml` bei `repo:` euren GitHub-Account eintragen (siehe unten).
6. Erst wenn alles läuft: Wix-Abo kündigen. **Vorher** Newsletter-Abonnent:innen und Bestellungen aus Wix exportieren.

Alte Wix-Adressen werden über `_redirects` dauerhaft (301) auf die neuen Adressen umgeleitet.

## Redaktion (Backend) unter /admin

Unter **https://www.regenerative-unternehmen.de/admin/** lassen sich Blogbeiträge schreiben und Kerntexte ändern:
Blog · Modell (5 Stufen) · Team · Referenzen · Glossar · Produkte · Einstellungen (Kontakt, Shop, Newsletter) · Impressum · Datenschutz.
Jede Änderung wird als Commit im Repo gespeichert; statichost baut die Seite danach automatisch neu (ca. 1 Minute).

**Anmeldung mit 2FA – so geht’s:**
1. Bei GitHub anmelden (Passwort + zweiter Faktor).
2. *Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token*
   - Repository access: **Only select repositories** → nur dieses Repo
   - Permissions: **Contents: Read and write** (sonst nichts)
   - Ablaufdatum setzen (z. B. 90 Tage)
3. `/admin` öffnen → „Sign In Using Access Token“ → Token einfügen.

Der Token bleibt nur im eigenen Browser gespeichert. Wer keinen GitHub-Zugang mit 2FA hat, kommt nicht hinein; ein verlorener Token wird bei GitHub einfach widerrufen.
Das CMS läuft komplett im Browser – es gibt keinen eigenen Server. Hinweis: Die Redaktionsoberfläche lädt ihre eigenen Symbol-Schriften von einem CDN (jsDelivr); das betrifft nur die Redaktion, nicht die Besucher der Website.

Seitenlayouts (Startseite, Mission, Kartenset) bleiben bewusst fest im Code – so kann beim Bearbeiten nichts am Design kaputtgehen.

## Inhalte pflegen

| Was | Wo |
| --- | --- |
| E-Mail, LinkedIn, Shop-/Newsletter-/Formular-Links | `src/_data/site.json` |
| Team | `src/_data/team.json` |
| Referenzen (Startseite) | `src/_data/references.json` |
| Glossar (`/glossar/`) | `src/_data/glossar.json` |
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
- **Bestellungen und Whitepaper-Anfragen:** Das Formular auf den Produktseiten löst eine E-Mail aus, sobald in der Redaktion unter „Einstellungen“ die Bestell-Adresse eingetragen ist. Zwei Wege (eigenes Skript bei deutschem Hoster oder Formular-Dienst) stehen in `server/README.md`. Ohne Adresse öffnet sich nur eine vorausgefüllte E-Mail.
- **Kontaktformular:** z. B. [Formspree](https://formspree.io) – Endpoint in `contactFormAction` eintragen.

Jeder dieser Dienste muss in der Datenschutzerklärung ergänzt werden.

## Schriften

Die Seite nutzt zwei Schriftfamilien (höchstens drei), alle selbst gehostet in `src/assets/fonts/`
(DSGVO-freundlich, keine Google-Server):

- **Unbounded** – Überschriften (leicht), Wortmarke/Kapitelnamen (fett) und kleine Beschriftungen (Medium), von [NaN](https://www.nan.xyz/fonts/unbounded) (SIL Open Font License)
- **Hanken Grotesk** – Fließtext (OFL)

Eine lizenzierte NaN-Schrift lässt sich später über die Variablen `--f-head` bzw. `--f-wide`
in `main.css` einsetzen – dann am besten anstelle von Unbounded.

## Vor dem Livegang prüfen

- [ ] **Datenschutzerklärung** (`src/datenschutz.md`) ist ein Entwurf: Wix-, Google-Ads-, Analytics- usw. Abschnitte wurden entfernt, Hosting bei statichost.eu ergänzt. Bitte rechtlich prüfen lassen (z. B. eRecht24-Generator neu durchlaufen).
- [ ] **Impressum:** auf DDG/MStV aktualisiert (TMG/RStV gelten nicht mehr).
- [ ] **Shop:** Bei Verkauf an Verbraucher braucht es AGB, Widerrufsbelehrung und Preisangaben inkl. MwSt.-Hinweis.
- [ ] **Bildrechte:** Wix-Stockfotos wurden bewusst nicht übernommen (deren Lizenz gilt nur auf Wix). Alle übernommenen Bilder stammen aus eurem eigenen Wix-Medienordner – bitte trotzdem kurz prüfen, ob für jedes Bild die Rechte vorliegen.
