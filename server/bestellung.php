<?php
/**
 * Formular-Empfänger für Bestellungen und Anfragen (regenerative-unternehmen.de)
 *
 * Läuft bei einem deutschen/EU-Hoster mit PHP (z. B. Hetzner Webhosting, all-inkl.).
 * Nimmt die Daten der Website als JSON entgegen und schickt sie als E-Mail an euch.
 * Optional geht eine Eingangsbestätigung an den Kunden.
 *
 * Einrichtung: siehe server/README.md
 */

// ---------- Einstellungen ----------
$EMPFAENGER   = 'direkt@regenerative-unternehmen.de';     // hier kommen die Bestellungen an
$ABSENDER     = 'bestellung@regenerative-unternehmen.de'; // muss zu eurer Domain bei diesem Hoster passen (SPF/DKIM)
$ERLAUBTE_URL = 'https://www.regenerative-unternehmen.de'; // nur von dieser Website annehmen
$BESTAETIGUNG = true;                                      // Eingangsbestätigung an den Kunden senden?
$MAX_PRO_STUNDE = 20;                                      // einfacher Missbrauchsschutz je IP-Adresse

// ---------- CORS ----------
header('Access-Control-Allow-Origin: ' . $ERLAUBTE_URL);
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Vary: Origin');
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo '{"ok":false}'; exit; }

function fail($code, $msg) { http_response_code($code); echo json_encode(['ok' => false, 'error' => $msg]); exit; }
function clean($v, $max = 500) { $v = is_string($v) ? $v : ''; $v = preg_replace('/[\r\n\t]+/', ' ', $v); return mb_substr(trim($v), 0, $max); }

// ---------- Missbrauchsschutz (keine IP-Adressen dauerhaft speichern: nur ein Hash, stündlich neu) ----------
$dir = sys_get_temp_dir() . '/ru-form';
@mkdir($dir, 0700, true);
$key = $dir . '/' . hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . date('YmdH') . __FILE__);
$n = (int) @file_get_contents($key);
if ($n >= $MAX_PRO_STUNDE) fail(429, 'Zu viele Anfragen');
@file_put_contents($key, $n + 1);

// ---------- Daten lesen ----------
$in = json_decode(file_get_contents('php://input'), true);
if (!is_array($in)) fail(400, 'Ungültige Daten');
if (!empty($in['website'])) { echo '{"ok":true}'; exit; }          // Honigtopf: Bots stillschweigend ignorieren

$name  = clean($in['name'] ?? '', 120);
$mail  = clean($in['email'] ?? '', 200);
if ($name === '' || !filter_var($mail, FILTER_VALIDATE_EMAIL)) fail(422, 'Name oder E-Mail fehlt');

$felder = [
  'Produkt'      => clean($in['produkt'] ?? '', 200),
  'Anzahl'       => clean($in['anzahl'] ?? '', 10),
  'Name'         => $name,
  'Organisation' => clean($in['organisation'] ?? '', 200),
  'E-Mail'       => $mail,
  'Straße'       => clean($in['strasse'] ?? '', 200),
  'PLZ'          => clean($in['plz'] ?? '', 12),
  'Ort'          => clean($in['ort'] ?? '', 120),
  'Anmerkung'    => clean($in['anmerkung'] ?? '', 1500),
  'Gesamtpreis'  => clean($in['gesamtpreis'] ?? '', 40),
];
$zeilen = [];
foreach ($felder as $k => $v) if ($v !== '') $zeilen[] = "$k: $v";
$zeilen[] = 'Eingang: ' . date('d.m.Y H:i') . ' Uhr';
$body = implode("\n", $zeilen);

$istBestellung = $felder['Straße'] !== '';
$betreff = ($istBestellung ? 'Neue Bestellung: ' : 'Neue Anfrage: ') . ($felder['Produkt'] ?: 'Website');

$kopf = "From: Regenerative Unternehmen <$ABSENDER>\r\nReply-To: $mail\r\nContent-Type: text/plain; charset=utf-8\r\nMIME-Version: 1.0";
if (!mail($EMPFAENGER, '=?UTF-8?B?' . base64_encode($betreff) . '?=', $body, $kopf)) fail(500, 'Versand fehlgeschlagen');

if ($BESTAETIGUNG) {
  $text = "Guten Tag $name,\n\nvielen Dank, wir haben Ihre " . ($istBestellung ? 'Bestellung' : 'Anfrage') . " erhalten und melden uns in der Regel innerhalb weniger Tage.\n\nIhre Angaben:\n$body\n\nHerzliche Grüße\nRegenerative Unternehmen\n";
  $kopf2 = "From: Regenerative Unternehmen <$ABSENDER>\r\nReply-To: $EMPFAENGER\r\nContent-Type: text/plain; charset=utf-8\r\nMIME-Version: 1.0";
  @mail($mail, '=?UTF-8?B?' . base64_encode('Ihre ' . ($istBestellung ? 'Bestellung' : 'Anfrage') . ' bei Regenerative Unternehmen') . '?=', $text, $kopf2);
}
echo '{"ok":true}';
