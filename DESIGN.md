# Gestaltung – was sich geändert hat und warum

Leitidee: **zurückhaltend, editorial, mit einer Prise NaN.** Viel Papier, wenig Farbe,
eine starke Schrift und ein paar überraschende Details.

## Umgesetzt

| Vorher (Wix) | Jetzt | Warum |
| --- | --- | --- |
| Helvetica Bold in Versalien, überall gleich laut | Drei Schriften: **Unbounded** (NaN) leicht für Überschriften und fett-breit für Wortmarke und Kapitelnamen, **Hanken Grotesk** für Text, **IBM Plex Mono** für kleine Beschriftungen | Klare Hierarchie mit wenigen Mitteln |
| Reinweiß + Hellgrau | Warmes Papier `#f1ede3`, Tinte `#171713`, **Rost** `#c4471f` als einzige Akzentfarbe, **Tannengrün** aus dem Kartenset, Lime nur als Highlight | Eine eigene, ruhige Farbwelt, die zum Kartenset passt |
| Stockfotos (Windräder, Wüste) als Hintergründe | Generative **Wachstumsringe** (SVG, ruhig) im Hero | Eigenständiges Motiv: Jahresringe, Donut, Kreislauf. Außerdem: Wix-Bilder dürfen außerhalb von Wix nicht genutzt werden |
| Weißer Text auf Blogbildern | Bilder in **Graustufen**, Farbe erscheint beim Hover; Titel unter dem Bild | Bunt gemischte KI-Bilder wirken als Serie, Titel sind lesbar |
| Zentrierter Fließtext, kleine Schrift | 18 px Text, max. 66 Zeichen pro Zeile, links ausgerichtet | Deutlich besser lesbar, besonders bei langen Blogbeiträgen |
| Icon-Kreise im Angebot | Römische Ziffern *i. ii. iii.* und Haarlinien | Editorial statt Baukasten |
| Abschnitte ohne Ordnung | Nummerierte Kapitel **01–07** mit Outline-Ziffern | Gibt der Startseite einen Lesefluss wie in einem Magazin |
| Diagramm auf Wüstenfoto | Diagramm als „Abbildung“ mit Bildunterschrift | Das eigene Modell wird zum Ausstellungsstück |
| Fußnoten als Wix-Dashboard-Links | Hochgestellte Verweise + sauberer Quellenblock | Wissenschaftlicher, funktionierend |
| Glatte, digitale Flächen | feine Papierkörnung über der ganzen Seite | Haptik, analoger Charakter |

Technisch: keine Cookies, kein Tracking, keine externen Server, Schriften lokal, Bilder als WebP in zwei Größen und mit Lazy Loading.

## Ein starker Moment: das Modell als Geschichte

Der Rest der Seite bleibt ruhig. In Kapitel 02 der Startseite bleibt die Bühne beim Scrollen stehen,
und das Modell nach Reed / Mang baut sich Stufe für Stufe auf:
**Konventionell → Grün → Nachhaltig → Wiederherstellend → Regenerativ.**

- Ein Punkt wandert über die Achse und rastet an jeder Stufe kurz ein.
- Die schwarze Fläche (degenerative Entwicklung) schrumpft bis „Nachhaltig“, danach wächst die grüne Fläche (regenerative Entwicklung).
- Links wechseln Stufenname, Kernsatz und Erklärung; ein Balken zeigt, wo man steht.
- Texte stehen in `src/_data/model.json`, die Grafik in `src/_includes/partials/story.njk`, die Logik in `src/assets/js/site.js`.
- Ohne JavaScript erscheint die fertige Grafik mit allen fünf Stufen als Liste.

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
