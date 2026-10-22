# Eduvia Tuition Centre website

The website for **eduvia.my**, the Eduvia tuition centre (age 5 to SPM): a static, single-page site (HTML, CSS and a little JavaScript) in Bahasa Melayu and English. There is no build step; the files in this repository are uploaded to Hostinger as they are.

```
index.html            page content
assets/css/styles.css styles
assets/js/main.js     BM / EN switch, mobile menu and the WhatsApp links
assets/js/jadual.js   Jadual 2027: the class timetable data and its interactive view
assets/js/yuran.js    Yuran 2027: the fees and the fee calculator
assets/img/           logos, favicon, home-screen icon and social share image
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

The first month is the registration fee plus the monthly fee. Asas 3M is a single class (`fees: { 1: 250 }`), so the calculator ticks it automatically.

## Before going live

Replace the placeholders:

- `index.html`: every `[ ... ]` value in the **Hubungi kami** (contact) section: address, phone, email, opening hours.
- `assets/js/main.js`: set `WHATSAPP_NUMBER` (digits only, e.g. `60123456789`). Until it is set, the WhatsApp buttons open an email to `ENQUIRY_EMAIL` instead.

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Deploying

The site is hosted on the Hostinger Business plan. Upload the contents of this repository (not the `.git` folder) to the website's `public_html` directory, either through hPanel's File Manager or Hostinger's Git deployment.
