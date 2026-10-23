<?php
// Eduvia — receives the Free 1-Week Trial Class form (free-trial-class/index.html).
//
// Checks every answer again, adds the sign-up as a row to a CSV file outside
// public_html, and emails the centre. The countries and subjects below repeat the
// ones in assets/js/trial.js: change both.
//
// Optional settings live in eduvia-config.php next to public_html (not in this
// repository), e.g.
//   <?php return ['notify_email' => 'someone@example.com'];
// Keys: notify_email (who gets the email), data_dir (where the CSV is kept).

declare(strict_types=1);

const COUNTRIES = [
    'my' => ['60', '/^1(?:[02-46-9]\d{7}|[15]\d{8})$/'],
    'sg' => ['65', '/^[89]\d{7}$/'],
    'bn' => ['673', '/^[78]\d{6}$/'],
    'id' => ['62', '/^8\d{8,11}$/'],
    'th' => ['66', '/^[689]\d{8}$/'],
    'ph' => ['63', '/^9\d{9}$/'],
    'in' => ['91', '/^[6-9]\d{9}$/'],
    'cn' => ['86', '/^1[3-9]\d{9}$/'],
    'au' => ['61', '/^4\d{8}$/'],
    'gb' => ['44', '/^7\d{9}$/'],
    'us' => ['1', '/^[2-9]\d{2}[2-9]\d{6}$/'],
];

const SUBJECTS = [
    '3m' => '3M', 'bm' => 'Bahasa Melayu', 'eng' => 'English', 'sej' => 'Sejarah',
    'math' => 'Mathematics', 'sci' => 'Science', 'addm' => 'Add Maths', 'acc' => 'Accounting',
];

function subjects_for_age(int $age): array
{
    if ($age <= 7) return ['3m'];
    if ($age <= 12) return ['bm', 'eng', 'math', 'sci'];
    if ($age <= 15) return ['bm', 'eng', 'sej', 'math', 'sci'];
    return ['bm', 'eng', 'sej', 'math', 'sci', 'addm', 'acc'];
}

function level_for_age(int $age): string
{
    if ($age <= 6) return 'Prasekolah';
    if ($age <= 12) return 'Darjah ' . ($age - 6);
    return 'Tingkatan ' . ($age - 12);
}

$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

function respond(bool $ok, int $status, string $error = ''): never
{
    global $wantsJson;
    http_response_code($status);
    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'error' => $error]);
        exit;
    }
    // Without JavaScript: a plain page with a link back
    header('Content-Type: text/html; charset=utf-8');
    $title = $ok ? 'Terima kasih! / Thank you!' : 'Maaf / Sorry';
    $body = $ok
        ? 'Kami telah terima maklumat anda dan akan hubungi anda tidak lama lagi.<br>We have received your details and will contact you soon.'
        : 'Borang tidak lengkap atau tidak sah. Sila kembali dan semak semula.<br>The form is incomplete or not valid. Please go back and check it.';
    echo "<!doctype html><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">"
        . "<title>$title</title><body style=\"font-family:system-ui,sans-serif;max-width:36rem;margin:15vh auto;padding:0 16px;color:#12195f\">"
        . "<h1>$title</h1><p>$body</p><p><a href=\"./\">&larr; Eduvia</a></p></body>";
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(false, 405, 'method');
}

// Bots fill in the hidden "website" field: pretend it worked
if (trim((string) ($_POST['website'] ?? '')) !== '') {
    respond(true, 200);
}

$field = static fn(string $key): string => is_string($_POST[$key] ?? null) ? trim($_POST[$key]) : '';
$errors = [];

// Parent's name: letters, spaces and ' ’ - . / @
$name = preg_replace('/\s+/u', ' ', $field('parent_name')) ?? '';
if (
    mb_strlen($name) < 3 || mb_strlen($name) > 80
    || !preg_match("/^[\p{L}\p{M}][\p{L}\p{M}'’.\-\/@ ]*$/u", $name)
    || preg_match_all('/\p{L}/u', $name) < 2
) {
    $errors[] = 'parent_name';
}

// Email
$email = $field('email');
if (
    strlen($email) > 254
    || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || !preg_match('/@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/', $email)
) {
    $errors[] = 'email';
}

// Phone: country and national number (trial.js sends digits only, without the leading 0)
$countryId = $field('phone_country');
$national = ltrim(preg_replace('/\D/', '', $field('phone')) ?? '', '0');
if (!isset(COUNTRIES[$countryId])) {
    $errors[] = 'phone';
} else {
    [$dialCode, $pattern] = COUNTRIES[$countryId];
    if (!preg_match($pattern, $national) && str_starts_with($national, $dialCode)) {
        $national = ltrim(substr($national, strlen($dialCode)), '0');
    }
    if (!preg_match($pattern, $national)) $errors[] = 'phone';
}

// Child's age and the subjects offered for it
$ageText = $field('child_age');
$age = ctype_digit($ageText) ? (int) $ageText : 0;
if ($age < 5 || $age > 17) $errors[] = 'child_age';

$subjects = $_POST['subjects'] ?? [];
$subjects = is_array($subjects) ? array_values(array_unique(array_filter($subjects, 'is_string'))) : [];
if (!$subjects || ($age && array_diff($subjects, subjects_for_age($age)))) $errors[] = 'subjects';

// Near Eco Grandeur
$near = $field('near_eco_grandeur');
if (!in_array($near, ['yes', 'no'], true)) $errors[] = 'near_eco_grandeur';

if ($errors) {
    respond(false, 422, implode(',', $errors));
}

// ---------------------------------------------------------------------------
// Save and notify

$base = dirname(__DIR__, 2); // the folder that holds public_html
$configFile = $base . '/eduvia-config.php';
$config = is_file($configFile) ? (array) (include $configFile) : [];
$notifyEmail = (string) ($config['notify_email'] ?? 'hello@eduvia.my');
$dataDir = (string) ($config['data_dir'] ?? $base . '/eduvia-data');

$submittedAt = (new DateTimeImmutable('now', new DateTimeZone('Asia/Kuala_Lumpur')))->format('Y-m-d H:i:s');
$phoneE164 = '+' . $dialCode . $national;
$subjectNames = implode(', ', array_map(static fn($s) => SUBJECTS[$s], $subjects));
$lang = $field('lang') === 'en' ? 'en' : 'ms';

$row = [
    'submitted_at' => $submittedAt,
    'parent_name' => $name,
    'email' => $email,
    'phone' => $phoneE164,
    'child_age' => (string) $age,
    'level' => level_for_age($age),
    'subjects' => $subjectNames,
    'near_eco_grandeur' => $near === 'yes' ? 'Yes' : 'No',
    'language' => $lang,
];

// Spreadsheet apps run cells that start with = + - @ as formulas
$safe = static fn(string $v): string =>
    preg_match('/^[=+\-@\t\r]/', $v) && !preg_match('/^\+\d+$/', $v) ? "'" . $v : $v;

$saved = false;
if (is_dir($dataDir) || @mkdir($dataDir, 0750, true)) {
    $file = $dataDir . '/free-trial-class.csv';
    $handle = @fopen($file, 'a');
    if ($handle && flock($handle, LOCK_EX)) {
        if (filesize($file) === 0) fputcsv($handle, array_keys($row), ',', '"', '');
        $saved = fputcsv($handle, array_map($safe, array_values($row)), ',', '"', '') !== false;
        flock($handle, LOCK_UN);
    }
    if ($handle) fclose($handle);
}

$lines = [
    'Pendaftaran kelas percubaan percuma 1 minggu / Free 1-week trial class sign-up',
    '',
    "Nama ibu bapa / Parent's name: $name",
    "E-mel / Email: $email",
    "Telefon / Phone: $phoneE164",
    "Umur anak / Child's age: $age (" . level_for_age($age) . ')',
    "Subjek / Subjects: $subjectNames",
    'Dekat Eco Grandeur / Near Eco Grandeur: ' . $row['near_eco_grandeur'],
    "Dihantar / Sent: $submittedAt",
];
$headers = [
    'From: Eduvia <no-reply@eduvia.my>',
    'Reply-To: ' . $email, // already checked, so it cannot carry extra headers
    'Content-Type: text/plain; charset=UTF-8',
];
$subject = '=?UTF-8?B?' . base64_encode("Kelas percubaan: $name") . '?=';
$mailed = $notifyEmail !== '' && @mail($notifyEmail, $subject, implode("\n", $lines), implode("\r\n", $headers));

if (!$saved && !$mailed) {
    error_log('Eduvia trial form: could not save or email a sign-up');
    respond(false, 500, 'storage');
}

respond(true, 200);
