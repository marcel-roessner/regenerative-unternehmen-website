# Bestell-Empfänger (optional, digital souverän)

Die Website sendet Bestellungen und Anfragen als JSON an eine Adresse, die in den Einstellungen
(Redaktion → Einstellungen → „Bestell- und Anfrageformular“) steht. Von dort geht eine E-Mail an euch.
Es gibt zwei Wege:

## A) Eigenes Skript bei einem deutschen Hoster (empfohlen, volle Datenhoheit)

1. Webhosting mit PHP bei einem deutschen Anbieter buchen (z. B. Hetzner Webhosting oder all-inkl.; ab ca. 2–5 € im Monat). Auftragsverarbeitungsvertrag mit dem Hoster abschließen.
2. In `bestellung.php` oben `$EMPFAENGER`, `$ABSENDER` und `$ERLAUBTE_URL` prüfen. Die Absenderadresse muss zu einer Domain gehören, die bei diesem Hoster eingerichtet ist (sonst landen Mails im Spam).
3. Datei per FTP/SFTP hochladen, z. B. nach `https://formular.regenerative-unternehmen.de/bestellung.php` (Subdomain beim Domainanbieter anlegen).
4. Die Adresse der hochgeladenen Datei in der Redaktion als Bestell-Adresse eintragen. Fertig.
5. Test: Auf der Produktseite eine Testbestellung abschicken. Die E-Mail an `$EMPFAENGER` und die Bestätigung an den Kunden sollten ankommen.

Das Skript speichert nichts auf dem Server (nur einen stündlich wechselnden Hash zur Missbrauchsbremse), ignoriert Bots über ein verstecktes Feld und entfernt Zeilenumbrüche aus allen Feldern.

## B) Formular-Dienst (schneller, weniger souverän)

Z. B. Formspark (Belgien, Daten laut Anbieter in Irland und Deutschland, AV-Vertrag in den AGB enthalten; im Gratistarif 250 Einsendungen insgesamt). Dort ein Formular anlegen und die angezeigte Adresse (`https://submit-form.com/…`) in der Redaktion eintragen. Der Dienst nutzt auch Unterauftragnehmer mit US-Konzernen (u. a. AWS). Unterauftragnehmer-Liste prüfen: https://formspark.io/legal/subprocessors/
Eine Bestätigung an den Kunden gibt es dort nur, wenn der Tarif sie enthält.

## Vor dem Livegang

- Datenschutzerklärung Ziffer 5.2: Namen und Sitz des gewählten Dienstleisters eintragen.
- Bei Verkauf an Verbraucher: AGB, Widerrufsbelehrung und Preisangaben bereitstellen (der Bestell-Button heißt bereits „Zahlungspflichtig bestellen“).
