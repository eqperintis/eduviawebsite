# Eduvia Tuition Centre website

The website for **eduvia.my**: a static, single-page site (HTML, CSS and a little JavaScript). There is no build step; the files in this repository are uploaded to Hostinger as they are.

```
index.html            page content
assets/css/styles.css styles
assets/js/main.js     mobile menu and the WhatsApp enquiry form
assets/img/           logo and favicon
assets/fonts/         Claston brand font (WOFF2)
```

## Typography

- **Claston** (brand font, by Drizy Studio) for the wordmark, headings and other display text. It has a single weight, so it is always set at `font-weight: 400`. Using it on a public website needs a web/webfont licence from Drizy Studio.
- **Plus Jakarta Sans** (Google Fonts) for body text, buttons and forms.

## Before going live

Replace the placeholders:

- `index.html`: every `[ ... ]` value in the **Fees** and **Contact** sections (fees, address, phone, email, opening hours).
- `assets/js/main.js`: set `WHATSAPP_NUMBER` (digits only, e.g. `60123456789`). Until it is set, the enquiry form opens an email to `ENQUIRY_EMAIL` instead.

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Deploying

The site is hosted on the Hostinger Business plan. Upload the contents of this repository (not the `.git` folder) to the website's `public_html` directory, either through hPanel's File Manager or Hostinger's Git deployment.
