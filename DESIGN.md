# Gestaltung – was sich geändert hat und warum

Leitidee: **zurückhaltend, editorial, mit einer Prise NaN.** Viel Papier, wenig Farbe,
eine starke Schrift und ein paar überraschende Details.

## Umgesetzt

| Vorher (Wix) | Jetzt | Warum |
| --- | --- | --- |
| Helvetica Bold in Versalien, überall gleich laut | Drei Schriften: **Unbounded** (NaN) leicht für Überschriften und fett-breit für Wortmarke und Kapitelnamen, **Hanken Grotesk** für Text, **IBM Plex Mono** für kleine Beschriftungen | Klare Hierarchie mit wenigen Mitteln |
| Reinweiß + Hellgrau | Warmes Papier `#f1ede3`, Tinte `#171713`, **Rost** `#c4471f` als einzige Akzentfarbe, **Tannengrün** aus dem Kartenset, Lime nur als Highlight | Eine eigene, ruhige Farbwelt, die zum Kartenset passt |
| Stockfotos (Windräder, Wüste) als Hintergründe | Generative **Wachstumsringe** (SVG, langsam rotierend) im Hero | Eigenständiges Motiv: Jahresringe, Donut, Kreislauf. Außerdem: Wix-Bilder dürfen außerhalb von Wix nicht genutzt werden |
| Weißer Text auf Blogbildern | Bilder in **Graustufen**, Farbe erscheint beim Hover; Titel unter dem Bild | Bunt gemischte KI-Bilder wirken als Serie, Titel sind lesbar |
| Zentrierter Fließtext, kleine Schrift | 18 px Text, max. 66 Zeichen pro Zeile, links ausgerichtet | Deutlich besser lesbar, besonders bei langen Blogbeiträgen |
| Icon-Kreise im Angebot | Römische Ziffern *i. ii. iii.* und Haarlinien | Editorial statt Baukasten |
| Abschnitte ohne Ordnung | Nummerierte Kapitel **01–07** mit Outline-Ziffern | Gibt der Startseite einen Lesefluss wie in einem Magazin |
| Diagramm auf Wüstenfoto | Diagramm als „Abbildung“ mit Bildunterschrift | Das eigene Modell wird zum Ausstellungsstück |
| Fußnoten als Wix-Dashboard-Links | Hochgestellte Verweise + sauberer Quellenblock | Wissenschaftlicher, funktionierend |
| Glatte, digitale Flächen | feine Papierkörnung über der ganzen Seite | Haptik, analoger Charakter |

Technisch: keine Cookies, kein Tracking, keine externen Server, Schriften lokal, Bilder als WebP in zwei Größen und mit Lazy Loading.

## Die Seite wächst beim Scrollen

- **Farbe:** Das Papier wandert beim Scrollen langsam von Sand zu einem hellen Moosgrün.
- **Jahresringe:** Im Hero liegt anfangs nur der Kern, weitere Ringe wachsen beim Scrollen dazu. Unten rechts zeigt ein kleines Ring-Emblem den Fortschritt auf jeder Seite (Klick = nach oben); am Ende färbt sich ein Ring rostrot.
- **Überschriften** gewinnen an Gewicht, während sie ins Bild kommen (variable Schriftstärke von Unbounded).
- **Kapitelnummern** füllen sich, **Linien** wachsen von links, **Listen und Karten** keimen nacheinander auf.
- Alles in `src/assets/js/site.js`; bei „Bewegung reduzieren“ im System drehen sich die Ringe nicht.

## Weitere Vorschläge

1. **Echte Fotografie statt KI-Bilder.** Eine kleine Serie eigener Fotos (Workshops, Hände mit Karten,
   Materialien, Natur-Details) in einheitlichem Licht würde die Seite sofort hochwertiger machen.
   Die Blogbilder könnten dann schrittweise durch abstrakte, einfarbige Illustrationen ersetzt werden.
2. **Porträts angleichen.** Beide Fotos im selben Setting, gleicher Ausschnitt, gleiche Lichtstimmung.
3. **Eine NaN-Kaufschrift für die Wortmarke.** Z. B. *NaN Jaune* (elegant, leicht schräg) oder
   *NaN Holo* (für eine sehr breite Wortmarke). Mit einer echten Wortmarke wäre auch ein Logo erledigt.
4. **Referenzen / Stimmen.** Zwei, drei echte Zitate von Kund:innen oder Workshop-Teilnehmenden
   (mit Einverständnis) als großer Serif-Satz.
5. **Formate konkretisieren.** Beim Angebot Dauer, Gruppengröße und Ergebnis nennen –
   z. B. „Planetary-Thinking-Workshop · 1 Tag · 8–20 Personen“.
6. **Fallstudien als eigene Rubrik.** PNZ und Denttabs eignen sich als „Case Studies“ mit Kennzahlen.
7. **Dark Mode** – ist mit den Farbvariablen in `main.css` in einer Stunde ergänzt.
