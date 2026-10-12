// Eduvia Tuition Centre

// TODO: set this to the centre's WhatsApp number in international format,
// digits only (e.g. "60123456789"). While it is empty, enquiries fall back to email.
const WHATSAPP_NUMBER = "";
const ENQUIRY_EMAIL = "hello@eduvia.my";

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

// Floating WhatsApp button
if (WHATSAPP_NUMBER) {
  const fab = document.getElementById("whatsapp-fab");
  fab.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Eduvia, I would like to know more about your tuition classes.")}`;
  fab.target = "_blank";
  fab.rel = "noopener";
}

// Enquiry form: builds a message and opens WhatsApp (or email)
const form = document.getElementById("enquiry-form");
const formError = document.getElementById("form-error");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const required = ["parentName", "level", "phone"];
  let firstInvalid = null;
  for (const name of required) {
    const el = form.elements[name];
    const invalid = !el.value.trim();
    el.setAttribute("aria-invalid", String(invalid));
    if (invalid && !firstInvalid) firstInvalid = el;
  }

  if (firstInvalid) {
    formError.textContent = "Please fill in your name, the student's level and a phone number.";
    formError.hidden = false;
    firstInvalid.focus();
    return;
  }
  formError.hidden = true;

  const data = Object.fromEntries(new FormData(form));
  const details = [
    ["Name", data.parentName],
    ["Student", data.studentName],
    ["Level", data.level],
    ["Subjects", data.subjects],
    ["Phone", data.phone],
    ["Message", data.message],
  ]
    .filter(([, value]) => value && value.trim())
    .map(([label, value]) => `${label}: ${value.trim()}`);
  const text = ["Hi Eduvia, I would like to book a free trial class.", "", ...details].join("\n");

  const url = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
    : `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent("Free trial class enquiry")}&body=${encodeURIComponent(text)}`;

  window.open(url, "_blank", "noopener");
});
