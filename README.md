# Eduvia Tuition Centre website

The website for **eduvia.my**, the Eduvia tuition centre (age 5 to SPM): a static, single-page site (HTML, CSS and a little JavaScript) in Bahasa Melayu and English. There is no build step; the files in this repository are uploaded to Hostinger as they are.

```
index.html            page content
assets/css/styles.css styles
assets/js/main.js     BM / EN switch, mobile menu and the WhatsApp links
assets/js/jadual.js   Jadual 2027: the class timetable data and its interactive view
assets/js/yuran.js    Yuran 2027: the fees and the fee calculator
assets/js/signup-form.js  the sign-up form on the landing pages: its steps and checks
free-trial-class/     the Free 1-Week Trial Class landing page (eduvia.my/free-trial-class/)
biasiswa/             the Biasiswa Giveaway landing page, pre-registration for 2027 (eduvia.my/biasiswa/)
assets/img/           logos, favicon, home-screen icon and social share image
assets/img/flags/     country flags for the phone number (from flag-icons, MIT licence)
assets/fonts/         Claston brand font (WOFF2)
```

## Brand

| Colour | Hex       | Used for                                        |
| ------ | --------- | ----------------------------------------------- |
| Navy   | `#12195F` | Hero and footer backgrounds, headings, text     |
| Yellow | `#EBC35B` | Main buttons, highlights, logo on dark          |
| Blue   | `#5EB6FF` | The logo's square, bullets and focus rings      |
| White  | `#FFFFFF` | Page background, text on navy                   |

The colours are defined once as CSS variables at the top of `assets/css/styles.css`.

Logo files (SVG, traced from the brand artwork):

- `logo-wordmark.svg`: navy wordmark for light backgrounds
- `logo-wordmark-light.svg`: yellow and white wordmark for navy backgrounds
- `logo-icon.svg` / `logo-icon-light.svg`: the "v" mark on its own
- `favicon.svg`, `apple-touch-icon.png`, `og-image.png`: browser tab, phone home screen and link previews

## Typography

- **Claston** (brand font, by Drizy Studio) for the wordmark, headings and other display text. It has a single weight, so it is always set at `font-weight: 400`. Using it on a public website needs a web/webfont licence from Drizy Studio.
- **Plus Jakarta Sans** (Google Fonts) for body text, buttons and forms.

## Languages

Bahasa Melayu is the default. Every piece of text in `index.html` is written in BM, with its English version beside it in a `data-en` attribute:

```html
<h2 data-en="Our approach">Pendekatan kami</h2>
```

Placeholders and accessibility labels use `data-en-placeholder` and `data-en-aria-label`. When you edit a sentence, update both. The WhatsApp messages are in the `STRINGS` object at the top of `assets/js/main.js`; the timetable and the fee calculator keep their own text in `T` near the top of their files.

The visitor's choice is remembered, and `https://eduvia.my/?lang=en` opens the English version directly.

## Timetable (Jadual 2027)

The timetable is a list at the top of `assets/js/jadual.js`. Each class has one or more groups (Kumpulan), and each session is one line:

```js
["tue", "20:00", "21:15", "bm"],   // day, start, end (24-hour), subject
```

Days are `mon tue wed thu fri sat sun`; subjects are the keys in `SUBJECTS` (`3m bm eng sej math sci addm acc`). The page works out the Malay and English time wording (pagi, tengah hari, petang, malam), the weekly hours, and which class is on now or next (Malaysia time).

## Fees (Yuran 2027)

The fee calculator reads the fees at the top of `assets/js/yuran.js`: `REGISTRATION` (yearly, paid with the first month; Asas 3M sets its own `registration: 150`) and, for each level, the subjects on offer and the monthly fee by number of subjects:

```js
fees: { 2: 200, 3: 260, 4: 300 },   // 2 subjects RM200, 3 subjects RM260, ...
```

The first month is the registration fee plus the monthly fee. The FAQ answer on fees in `index.html` quotes the lowest monthly fee (RM200), so update it too if that changes. Asas 3M is a single class (`fees: { 1: 250 }`), so the calculator ticks it automatically.

## Free 1-Week Trial Class (free-trial-class/)

The homepage's "Join Free Trial Class" buttons open this page. Its form has three steps (the parent, the child, the location), and each step must be complete and in the right format before the next one opens:

- Parent's name: letters, spaces and ' - . / @ (e.g. "Muthu a/l Rajan").
- Email: a full address; common misspellings such as `gmial.com` get a "Did you mean" fix.
- Phone number: a mobile number for the chosen country, Malaysia (+60) by default. The countries and their number rules are `COUNTRIES` at the top of `assets/js/signup-form.js`.
- Child's level (5 Tahun, 6 Tahun, Darjah 1 – 6, Tingkatan 1 – 5; sent as `child_age` 5 to 17 and `school_year`) and the subjects offered for it, the same levels as the fee calculator: at least 2 subjects, except Asas 3M (one class, ticked for them).
- Whether they live near Eco Grandeur (Yes / No).

The form is sent to the Eduvia form backend, `https://marketing.eduvia.my/f/eduvia-enquiry` (form "Free: 1-Week Trial Class"), which saves each sign-up and emails a notification. The fields it receives:

| Field | Example |
| ----- | ------- |
| `parent_name` | Nur Aisyah binti Ahmad |
| `email` | aisyah@gmail.com |
| `phone` | +60123456789 (international format) |
| `child_age` | 10 |
| `school_year` | Darjah 4 |
| `subjects` | Mathematics, Science (a list) |
| `near_eco_grandeur` | Yes / No |
| `language` | BM / EN (the language the visitor used) |
| `came_from`, `utm_*` | where the visitor came from, added by `utm.js` |

The backend only accepts forms sent from eduvia.my, so the form can only be tried on the live site (on localhost it answers 403). If an automation on the backend returns a `next` link, the visitor is taken there; otherwise the thank-you message shows in place. `marketing.eduvia.my/utm.js` is loaded on the homepage and both landing pages, so a visitor who arrives on the homepage from an ad keeps their UTM tags when they go on to the form.

The form has to pass the checks above in the browser; the backend saves what it is sent as it is.

## Biasiswa Giveaway (biasiswa/)

"Giveaway Biasiswa: Free 1-Tahun Pembelajaran bersama Eduvia": students who pre-register for 2027 (RM50) enter the giveaway, and the winner is announced on 28 December 2026. The page has the same layout and the same form as the trial class page (`data-page="biasiswa"` on the `<form>` picks its thank-you text), and it sends the same fields to its own form on the backend, `https://marketing.eduvia.my/f/gdfnzpee` ("Pre-Reg 2027: Biasiswa Giveaway"). The email subject starts with the page's hidden `_subject` field. Its link preview image is `assets/img/biasiswa/og-image.jpg`.

## Before going live

Replace the placeholders:

- `assets/js/main.js`: set `WHATSAPP_NUMBER` (digits only, e.g. `60123456789`). Until it is set, the WhatsApp buttons open an email to `ENQUIRY_EMAIL` instead.

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Deploying

The pages load the CSS and JavaScript with a version on the end (`styles.css?v=20261023k`). When you change a file in `assets/css` or `assets/js`, change that version in `index.html`, `free-trial-class/index.html` and `biasiswa/index.html` (e.g. to the day's date), or browsers and Hostinger's CDN may keep showing the old file.


The site is hosted on the Hostinger Business plan. Upload the contents of this repository (not the `.git` folder) to the website's `public_html` directory, either through hPanel's File Manager or Hostinger's Git deployment.
