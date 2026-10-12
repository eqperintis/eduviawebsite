// Eduvia

// TODO: set this to the centre's WhatsApp number in international format,
// digits only (e.g. "60123456789"). While it is empty, enquiries fall back to email.
const WHATSAPP_NUMBER = "";
const ENQUIRY_EMAIL = "hello@eduvia.my";

// Text used by the script itself, per language
const STRINGS = {
  ms: {
    formError: "Sila isi nama anda, peringkat pelajar dan nombor telefon.",
    greeting: "Hai Eduvia, saya ingin tahu lebih lanjut tentang kelas tuisyen.",
    emailSubject: "Pertanyaan tentang kelas tuisyen",
    labels: { parentName: "Nama", studentName: "Pelajar", level: "Peringkat", subjects: "Subjek", phone: "Telefon", message: "Mesej" },
  },
  en: {
    formError: "Please fill in your name, the student's level and a phone number.",
    greeting: "Hi Eduvia, I would like to know more about your tuition classes.",
    emailSubject: "Tuition class enquiry",
    labels: { parentName: "Name", studentName: "Student", level: "Level", subjects: "Subjects", phone: "Phone", message: "Message" },
  },
};

// ---------------------------------------------------------------------------
// Language switch: Bahasa Melayu is in the HTML, English is in data-en* attributes.

const root = document.documentElement;
const msTitle = document.title;
let lang = "ms";

// [English attribute, attribute it replaces (null = the element's text)]
const TRANSLATED = [
  ["data-en", null],
  ["data-en-placeholder", "placeholder"],
  ["data-en-aria-label", "aria-label"],
];

function setLanguage(next) {
  lang = next === "en" ? "en" : "ms";
  root.lang = lang;
  for (const [enAttr, target] of TRANSLATED) {
    const msAttr = `data-ms-${target || "text"}`;
    document.querySelectorAll(`[${enAttr}]`).forEach((el) => {
      // Remember the Bahasa Melayu original the first time
      if (!el.hasAttribute(msAttr)) {
        el.setAttribute(msAttr, target ? el.getAttribute(target) || "" : el.textContent);
      }
      const value = el.getAttribute(lang === "en" ? enAttr : msAttr);
      if (target) el.setAttribute(target, value);
      else el.textContent = value;
    });
  }
  document.title = lang === "en" ? root.dataset.enTitle : msTitle;
  document.querySelectorAll(".lang-switch button").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
  });
  updateWhatsAppButton();
  try { localStorage.setItem("eduvia-lang", lang); } catch (e) { /* storage unavailable */ }
}

document.querySelectorAll(".lang-switch button").forEach((btn) => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

// ---------------------------------------------------------------------------
// Mobile navigation

const navToggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");

navToggle.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("is-open", !open);
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  }
});

// Header shadow once the page scrolls
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

document.getElementById("year").textContent = new Date().getFullYear();

// ---------------------------------------------------------------------------
// Floating WhatsApp button

function updateWhatsAppButton() {
  if (!WHATSAPP_NUMBER) return;
  const fab = document.getElementById("whatsapp-fab");
  fab.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(STRINGS[lang].greeting)}`;
  fab.target = "_blank";
  fab.rel = "noopener";
}

// ---------------------------------------------------------------------------
// Enquiry form: builds a message and opens WhatsApp (or email)

const form = document.getElementById("enquiry-form");
const formError = document.getElementById("form-error");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const t = STRINGS[lang];

  const required = ["parentName", "level", "phone"];
  let firstInvalid = null;
  for (const name of required) {
    const el = form.elements[name];
    const invalid = !el.value.trim();
    el.setAttribute("aria-invalid", String(invalid));
    if (invalid && !firstInvalid) firstInvalid = el;
  }

  if (firstInvalid) {
    formError.textContent = t.formError;
    formError.hidden = false;
    firstInvalid.focus();
    return;
  }
  formError.hidden = true;

  const data = Object.fromEntries(new FormData(form));
  const levelSelect = form.elements.level;
  data.level = levelSelect.options[levelSelect.selectedIndex].textContent;

  const details = Object.keys(t.labels)
    .filter((key) => data[key] && data[key].trim())
    .map((key) => `${t.labels[key]}: ${data[key].trim()}`);
  const text = [t.greeting, "", ...details].join("\n");

  const url = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
    : `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(t.emailSubject)}&body=${encodeURIComponent(text)}`;

  window.open(url, "_blank", "noopener");
});

// ---------------------------------------------------------------------------
// Initial language: ?lang=en in the URL, then the visitor's last choice, else BM

let initial = new URLSearchParams(location.search).get("lang");
if (!initial) {
  try { initial = localStorage.getItem("eduvia-lang"); } catch (e) { initial = null; }
}
setLanguage(initial || "ms");
