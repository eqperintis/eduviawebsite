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
  ["data-en-alt", "alt"],
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
  window.EduviaJadual?.render(lang);
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
// Approach demo: Uji, Semak, Bantu on the laptop screen.
// Plays through the steps on its own once visible; any click stops it.

const demo = document.getElementById("demo");
if (demo) {
  const STEP_MS = 5000;
  const demoTabs = [...demo.querySelectorAll('[role="tab"]')];
  const appNav = [...demo.querySelectorAll(".app-nav")];
  let current = 0, timer = null;

  const showStep = (index) => {
    current = index;
    demoTabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const pane = document.getElementById(tab.getAttribute("aria-controls"));
      pane.hidden = !selected;
      pane.classList.toggle("is-active", selected);
    });
    appNav.forEach((item, i) => item.classList.toggle("is-active", i === index));
  };

  const stop = () => { clearInterval(timer); timer = null; demo.classList.remove("is-playing"); };
  const play = () => {
    if (timer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    demo.style.setProperty("--demo-ms", `${STEP_MS}ms`);
    demo.classList.add("is-playing");
    timer = setInterval(() => showStep((current + 1) % demoTabs.length), STEP_MS);
  };

  demoTabs.forEach((tab, i) => {
    tab.addEventListener("click", () => { stop(); showStep(i); });
    tab.addEventListener("keydown", (event) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      stop();
      const next = (i + step + demoTabs.length) % demoTabs.length;
      showStep(next);
      demoTabs[next].focus();
    });
  });

  // Using anything on the laptop screen stops the auto-play
  demo.querySelector(".laptop").addEventListener("pointerdown", stop);

  // Uji screen: tap an answer; wrong turns red (try again), correct turns green
  const quiz = document.getElementById("q-options");
  if (quiz) {
    const setMessage = (state) => demo.querySelectorAll(".q-msg").forEach((m) => m.classList.toggle("is-shown", m.dataset.state === state));
    quiz.addEventListener("click", (event) => {
      const option = event.target.closest(".q-opt");
      if (!option || option.disabled) return;
      stop();
      if (option.hasAttribute("data-correct")) {
        option.classList.add("is-right");
        quiz.querySelectorAll(".q-opt").forEach((o) => { o.disabled = true; });
        setMessage("right");
      } else {
        option.classList.remove("is-wrong");
        void option.offsetWidth; // restart the shake if tapped again
        option.classList.add("is-wrong");
        setMessage("wrong");
      }
    });
  }

  showStep(0);
  if ("IntersectionObserver" in window) {
    let started = false;
    new IntersectionObserver((entries) => {
      if (!started && entries.some((e) => e.isIntersecting)) { started = true; play(); }
    }, { threshold: 0.4 }).observe(demo);
  } else {
    play();
  }
}

// ---------------------------------------------------------------------------
// Soft spotlight that follows the pointer over cards

const spotCards = document.querySelectorAll(".module, .programme, .price-card");
spotCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  });
  card.addEventListener("pointerleave", () => {
    card.style.removeProperty("--mx");
    card.style.removeProperty("--my");
  });
});

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
