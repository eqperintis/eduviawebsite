// Eduvia — Free 1-Week Trial Class form (free-trial-class/index.html)
//
// Three steps: the parent, the child, the location. A step must be complete and in
// the right format before the next one opens. The form is sent to the Eduvia form
// backend (the form's action), which saves the fields as they are sent.

(() => {
  const form = document.getElementById("trial-form");
  if (!form) return;

  // Phone numbers: dial code, and the national number without its leading 0 (mobile numbers)
  const COUNTRIES = {
    my: { code: "60", pattern: /^1(?:[02-46-9]\d{7}|[15]\d{8})$/, example: "12-345 6789" },
    sg: { code: "65", pattern: /^[89]\d{7}$/, example: "8123 4567" },
    bn: { code: "673", pattern: /^[78]\d{6}$/, example: "712 3456" },
    id: { code: "62", pattern: /^8\d{8,11}$/, example: "812 3456 7890" },
    th: { code: "66", pattern: /^[689]\d{8}$/, example: "81 234 5678" },
    ph: { code: "63", pattern: /^9\d{9}$/, example: "912 345 6789" },
    in: { code: "91", pattern: /^[6-9]\d{9}$/, example: "98765 43210" },
    cn: { code: "86", pattern: /^1[3-9]\d{9}$/, example: "131 2345 6789" },
    au: { code: "61", pattern: /^4\d{8}$/, example: "412 345 678" },
    gb: { code: "44", pattern: /^7\d{9}$/, example: "7400 123456" },
    us: { code: "1", pattern: /^[2-9]\d{2}[2-9]\d{6}$/, example: "201 555 0123" },
  };

  // School year as the centre writes it, sent with the age
  const schoolYear = (age) => (age <= 6 ? "Prasekolah" : age <= 12 ? `Darjah ${age - 6}` : `Tingkatan ${age - 12}`);

  // Subjects offered for each age (the same levels as the fee calculator), by data-subject
  const subjectsForAge = (age) =>
    age <= 7 ? ["3m"]
    : age <= 12 ? ["bm", "eng", "math", "sci"]
    : age <= 15 ? ["bm", "eng", "sej", "math", "sci"]
    : ["bm", "eng", "sej", "math", "sci", "addm", "acc"];

  // Letters (any script), spaces and the marks found in Malaysian names: ' ’ - . / @
  const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}'’.\-\/@ ]*$/u;
  const EMAIL_RE = /^[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;

  // Common misspellings of email providers, offered as a fix
  const EMAIL_TYPOS = {
    "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gamil.com": "gmail.com", "gmal.com": "gmail.com",
    "gmail.co": "gmail.com", "gmail.con": "gmail.com", "gmail.cm": "gmail.com", "gmail.om": "gmail.com",
    "gmail.my": "gmail.com", "yaho.com": "yahoo.com", "yahoo.co": "yahoo.com", "yahoo.con": "yahoo.com",
    "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com", "hotmail.co": "hotmail.com",
    "outlok.com": "outlook.com", "outlook.co": "outlook.com", "icloud.co": "icloud.com", "iclod.com": "icloud.com",
  };

  const T = {
    ms: {
      nameRequired: "Sila masukkan nama anda.",
      nameShort: "Sila masukkan nama penuh anda.",
      nameInvalid: "Nama hanya boleh mengandungi huruf, ruang dan tanda ' - . / @",
      emailRequired: "Sila masukkan alamat e-mel anda.",
      emailInvalid: "Alamat e-mel ini tidak lengkap atau tidak sah. Contoh: nama@gmail.com",
      emailTypo: (email) => `Maksud anda ${email}?`,
      emailTypoFix: "Guna ini",
      phoneRequired: "Sila masukkan nombor telefon bimbit anda.",
      phoneInvalid: (example) => `Nombor ini tidak sah untuk negara yang dipilih. Contoh: ${example}`,
      ageRequired: "Sila pilih umur anak anda.",
      subjectsRequired: "Sila pilih sekurang-kurangnya satu subjek.",
      nearRequired: "Sila pilih Ya atau Tidak.",
      review: { parent_name: "Nama", email: "E-mel", phone: "Telefon", child_age: "Umur anak", subjects: "Subjek", near: "Dekat Eco Grandeur" },
      edit: "Ubah",
      yes: "Ya", no: "Tidak",
      failed: "Maaf, borang tidak dapat dihantar. Sila cuba lagi.",
      failedContact: "Atau hubungi kami terus",
      contactMessage: "Hai Eduvia, saya nak daftar kelas percubaan percuma 1 minggu.",
      doneTitle: (name) => `Terima kasih, ${name}!`,
      doneBody: (phone) => `Kami telah terima maklumat anda. Kami akan hubungi anda di ${phone} untuk aturkan kelas percubaan anak anda.`,
    },
    en: {
      nameRequired: "Please enter your name.",
      nameShort: "Please enter your full name.",
      nameInvalid: "Names can only have letters, spaces and the marks ' - . / @",
      emailRequired: "Please enter your email address.",
      emailInvalid: "This email address is incomplete or not valid. Example: name@gmail.com",
      emailTypo: (email) => `Did you mean ${email}?`,
      emailTypoFix: "Use this",
      phoneRequired: "Please enter your mobile number.",
      phoneInvalid: (example) => `This number isn't valid for the chosen country. Example: ${example}`,
      ageRequired: "Please choose your child's age.",
      subjectsRequired: "Please choose at least one subject.",
      nearRequired: "Please choose Yes or No.",
      review: { parent_name: "Name", email: "Email", phone: "Phone", child_age: "Child's age", subjects: "Subjects", near: "Near Eco Grandeur" },
      edit: "Edit",
      yes: "Yes", no: "No",
      failed: "Sorry, the form couldn't be sent. Please try again.",
      failedContact: "Or contact us directly",
      contactMessage: "Hi Eduvia, I'd like to book the free 1-week trial class.",
      doneTitle: (name) => `Thank you, ${name}!`,
      doneBody: (phone) => `We've received your details. We'll contact you at ${phone} to arrange your child's trial class.`,
    },
  };

  const $ = (selector) => form.querySelector(selector);
  const steps = [...form.querySelectorAll(".tf-step")];
  const nameInput = $("#tf-name");
  const emailInput = $("#tf-email");
  const phoneInput = $("#tf-phone");
  const countrySelect = $("#tf-country");
  const ageSelect = $("#tf-age");
  const chips = [...form.querySelectorAll('input[name="subjects"]')];
  const nearInputs = [...form.querySelectorAll('input[name="near_eco_grandeur"]')];
  const backBtn = $("#tf-back");
  const nextBtn = $("#tf-next");
  const status = $("#tf-status");
  const done = document.getElementById("tf-done");

  let lang = "ms";
  let current = 0;
  let sending = false;
  const errors = {};      // field -> [message key, argument]
  const touched = new Set();

  // ---------------------------------------------------------------------------
  // Reading and checking the fields

  const cleanName = () => nameInput.value.trim().replace(/\s+/g, " ");
  const cleanEmail = () => emailInput.value.trim();
  const country = () => COUNTRIES[countrySelect.value] || COUNTRIES.my;

  // National number: digits only, without a typed or pasted country code or leading 0
  function nationalNumber() {
    const { code, pattern } = country();
    const digits = phoneInput.value.replace(/\D/g, "").replace(/^00/, "");
    const local = digits.replace(/^0+/, "");
    if (!pattern.test(local) && digits.startsWith(code)) {
      const rest = digits.slice(code.length).replace(/^0+/, "");
      if (pattern.test(rest)) return rest;
    }
    return local;
  }

  // Malaysian numbers read as 12-345 6789 / 11-2345 6789; others in groups of three or four
  function formatNational(number) {
    if (countrySelect.value === "my") return number.replace(/^(\d{2})(\d{3,4})(\d{4})$/, "$1-$2 $3");
    return number.replace(/(\d{3,4})(?=(\d{3,4})+$)/g, "$1 ").trim();
  }

  const selectedSubjects = () => chips.filter((c) => c.checked && !c.closest(".tf-chip").hidden).map((c) => c.dataset.subject);
  const nearValue = () => nearInputs.find((i) => i.checked)?.value || "";

  const CHECKS = {
    parent_name() {
      const name = cleanName();
      if (!name) return ["nameRequired"];
      if (!NAME_RE.test(name)) return ["nameInvalid"];
      if (name.replace(/[^\p{L}]/gu, "").length < 2 || name.length < 3) return ["nameShort"];
      return null;
    },
    email() {
      const email = cleanEmail();
      if (!email) return ["emailRequired"];
      if (email.length > 254 || !EMAIL_RE.test(email) || email.split("@")[0].length > 64) return ["emailInvalid"];
      return null;
    },
    phone() {
      if (!phoneInput.value.trim()) return ["phoneRequired"];
      if (!country().pattern.test(nationalNumber())) return ["phoneInvalid", country().example];
      return null;
    },
    child_age() { return ageSelect.value ? null : ["ageRequired"]; },
    subjects() { return selectedSubjects().length ? null : ["subjectsRequired"]; },
    near_eco_grandeur() { return nearValue() ? null : ["nearRequired"]; },
  };

  const STEP_FIELDS = [["parent_name", "email", "phone"], ["child_age", "subjects"], ["near_eco_grandeur"]];

  function check(field) {
    const result = CHECKS[field]();
    if (result) errors[field] = result; else delete errors[field];
    showError(field);
    return !result;
  }

  function showError(field) {
    const wrap = form.querySelector(`[data-field="${field}"]`);
    const box = wrap.querySelector(".tf-error");
    const error = errors[field];
    const message = error ? (typeof T[lang][error[0]] === "function" ? T[lang][error[0]](error[1]) : T[lang][error[0]]) : "";
    box.textContent = message;
    wrap.classList.toggle("is-invalid", Boolean(error));
    wrap.querySelectorAll("input:not([type=checkbox]):not([type=radio]), select").forEach((el) => {
      if (el !== countrySelect) el.setAttribute("aria-invalid", String(Boolean(error)));
    });
    if (wrap.tagName === "FIELDSET") wrap.setAttribute("aria-invalid", String(Boolean(error)));
  }

  const firstControl = (el) => [...el.querySelectorAll("input:not([type=hidden]), select")].find((c) => c !== countrySelect && !c.closest("[hidden]"));

  // Checks every field of a step; focuses the first one that is wrong
  function checkStep(index) {
    const fields = STEP_FIELDS[index];
    fields.forEach((f) => touched.add(f));
    const bad = fields.filter((f) => !check(f));
    if (bad.length) {
      const wrap = form.querySelector(`[data-field="${bad[0]}"]`);
      firstControl(wrap)?.focus({ preventScroll: true });
      wrap.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    return bad.length === 0;
  }

  // ---------------------------------------------------------------------------
  // Email typo hint ("Did you mean ...@gmail.com?")

  const emailField = form.querySelector('[data-field="email"]');
  const typoHint = document.createElement("p");
  const typoText = document.createElement("span");
  const typoFix = document.createElement("button");
  let suggestion = "";
  typoHint.className = "tf-hint tf-typo";
  typoHint.hidden = true;
  typoFix.type = "button";
  typoHint.append(typoText, " ", typoFix);
  emailField.insertBefore(typoHint, emailField.querySelector(".tf-error"));
  typoFix.addEventListener("click", () => {
    emailInput.value = suggestion;
    updateTypoHint();
    if (touched.has("email")) check("email");
    emailInput.focus();
  });

  function updateTypoHint() {
    const [local, domain = ""] = cleanEmail().split("@");
    const fix = EMAIL_TYPOS[domain.toLowerCase()];
    typoHint.hidden = !fix || !local;
    if (typoHint.hidden) return;
    suggestion = `${local}@${fix}`;
    typoText.textContent = T[lang].emailTypo(suggestion);
    typoFix.textContent = T[lang].emailTypoFix;
  }

  // ---------------------------------------------------------------------------
  // Field behaviour

  // Check a field once it has been left, then again on every change
  const watch = (el, field, events = ["input"]) => {
    el.addEventListener("blur", () => { if (el.value.trim()) touched.add(field); if (touched.has(field)) check(field); });
    events.forEach((type) => el.addEventListener(type, () => { if (touched.has(field)) check(field); }));
  };
  watch(nameInput, "parent_name");
  watch(emailInput, "email");
  watch(phoneInput, "phone");
  emailInput.addEventListener("input", updateTypoHint);
  nameInput.addEventListener("blur", () => { nameInput.value = cleanName(); });
  emailInput.addEventListener("blur", () => { emailInput.value = cleanEmail(); updateTypoHint(); });

  // Only digits and the usual separators can be typed in the phone number
  phoneInput.addEventListener("input", () => {
    const cleaned = phoneInput.value.replace(/[^\d+\-\s()]/g, "");
    if (cleaned !== phoneInput.value) phoneInput.value = cleaned;
  });
  phoneInput.addEventListener("blur", () => {
    const number = nationalNumber();
    if (country().pattern.test(number)) phoneInput.value = formatNational(number);
  });

  function updateCountry() {
    const id = countrySelect.value in COUNTRIES ? countrySelect.value : "my";
    document.getElementById("tf-flag").src = `../assets/img/flags/${id}.svg`;
    document.getElementById("tf-dial").textContent = `+${COUNTRIES[id].code}`;
    phoneInput.placeholder = COUNTRIES[id].example;
  }
  countrySelect.addEventListener("change", () => {
    updateCountry();
    if (touched.has("phone")) check("phone");
    phoneInput.focus();
  });

  // The subject list follows the child's age; a single choice (3M) is ticked for them
  function updateSubjects() {
    const age = Number(ageSelect.value);
    const offered = age ? subjectsForAge(age) : [];
    chips.forEach((chip) => {
      const show = offered.includes(chip.dataset.subject);
      chip.closest(".tf-chip").hidden = !show;
      if (!show) chip.checked = false;
    });
    if (offered.length === 1) chips.find((c) => c.dataset.subject === offered[0]).checked = true;
    document.getElementById("tf-subjects-empty").hidden = Boolean(age);
  }
  ageSelect.addEventListener("change", () => {
    touched.add("child_age");
    check("child_age");
    updateSubjects();
    if (touched.has("subjects")) check("subjects");
  });
  chips.forEach((chip) => chip.addEventListener("change", () => { touched.add("subjects"); check("subjects"); }));
  nearInputs.forEach((input) => input.addEventListener("change", () => { touched.add("near_eco_grandeur"); check("near_eco_grandeur"); }));

  // ---------------------------------------------------------------------------
  // Steps

  function showStep(index, focus = true) {
    current = index;
    steps.forEach((step, i) => { step.hidden = i !== index; });
    backBtn.hidden = index === 0;
    const last = index === steps.length - 1;
    nextBtn.querySelector(".tf-label-next").hidden = last;
    nextBtn.querySelector(".tf-label-submit").hidden = !last;
    if (last) renderReview();
    status.hidden = true;
    if (focus) {
      firstControl(steps[index])?.focus({ preventScroll: true });
      const card = document.getElementById("form");
      if (card.getBoundingClientRect().top < parseFloat(getComputedStyle(card).scrollMarginTop)) card.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Summary of the answers on the last step, each with a link back to its step
  function renderReview() {
    const t = T[lang];
    const ageOption = ageSelect.selectedOptions[0];
    const subjectNames = selectedSubjects().map((v) => chips.find((c) => c.dataset.subject === v).closest(".tf-chip").textContent.trim());
    const rows = [
      [t.review.parent_name, cleanName(), 0],
      [t.review.email, cleanEmail(), 0],
      [t.review.phone, `+${country().code} ${formatNational(nationalNumber())}`, 0],
      [t.review.child_age, ageSelect.value ? ageOption.textContent : "", 1],
      [t.review.subjects, subjectNames.join(", "), 1],
    ];
    const list = document.getElementById("tf-review-list");
    list.replaceChildren(...rows.map(([label, value, step]) => {
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      const edit = document.createElement("button");
      dt.textContent = label;
      dd.textContent = value;
      edit.type = "button";
      edit.className = "tf-edit";
      edit.textContent = t.edit;
      edit.setAttribute("aria-label", `${t.edit}: ${label}`);
      edit.addEventListener("click", () => showStep(step));
      row.append(dt, dd, edit);
      return row;
    }));
    document.getElementById("tf-review").hidden = false;
  }

  backBtn.addEventListener("click", () => showStep(Math.max(0, current - 1)));

  // Next (or Enter in a field) opens the next step; on the last step it sends the form
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (sending) return;
    if (!checkStep(current)) return;
    if (current < steps.length - 1) { showStep(current + 1); return; }
    // Everything once more before sending, in case an earlier step was changed
    const firstBad = STEP_FIELDS.findIndex((fields, i) => { fields.forEach((f) => touched.add(f)); return !fields.every((f) => check(f)); });
    if (firstBad !== -1) { showStep(firstBad); checkStep(firstBad); return; }
    send();
  });

  function setSending(on) {
    sending = on;
    nextBtn.disabled = on;
    backBtn.disabled = on;
    nextBtn.querySelector(".tf-label-submit").hidden = on;
    nextBtn.querySelector(".tf-label-sending").hidden = !on;
    form.setAttribute("aria-busy", String(on));
  }

  // Sends the form as FormData, so the hidden fields utm.js adds (came_from, utm_*) go too
  async function send() {
    const data = new FormData(form);
    data.set("parent_name", cleanName());
    data.set("email", cleanEmail());
    data.set("phone", `+${country().code}${nationalNumber()}`);
    data.delete("phone_country"); // already part of the phone number
    data.set("school_year", schoolYear(Number(ageSelect.value)));
    data.set("language", lang === "en" ? "EN" : "BM");
    data.set("_subject", `Free 1-Week Trial Class: ${cleanName()}`);
    setSending(true);
    status.hidden = true;
    try {
      const response = await fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } });
      const result = await response.json().catch(() => ({}));
      if (!result.ok) {
        showFailure(result.error);
        setSending(false);
        return;
      }
      // An automation on the backend can choose where this visitor goes next
      if (result.next) {
        window.location.assign(result.next);
        return;
      }
      showDone();
      setSending(false);
    } catch (error) {
      showFailure();
      setSending(false);
    }
  }

  // The backend's own message when it gives one (e.g. too many tries), else ours
  let failureMessage = "";
  function showFailure(message = "") {
    const t = T[lang];
    failureMessage = message;
    status.textContent = `${message || t.failed} `;
    // Same WhatsApp (or email) link as the rest of the site, with the details filled in
    const details = `${t.contactMessage}\n\n${t.review.parent_name}: ${cleanName()}\n${t.review.phone}: +${country().code} ${formatNational(nationalNumber())}`;
    const attrs = window.EduviaContact ? window.EduviaContact.link(details) : `href="mailto:hello@eduvia.my"`;
    const holder = document.createElement("span");
    holder.innerHTML = `<a ${attrs}></a>`;
    const anchor = holder.firstChild;
    anchor.textContent = t.failedContact;
    status.append(anchor, ".");
    status.hidden = false;
  }

  let doneDetails = null;
  function showDone() {
    // "Nur Aisyah binti Ahmad" -> "Nur Aisyah"
    const name = cleanName().split(/\s+(?:bin|binti|bt|a\/l|a\/p|@)\s+/i)[0];
    doneDetails = { name, phone: `+${country().code} ${formatNational(nationalNumber())}` };
    form.hidden = true;
    done.hidden = false;
    renderDone();
    done.focus({ preventScroll: true });
    document.getElementById("form").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderDone() {
    if (!doneDetails) return;
    document.getElementById("tf-done-title").textContent = T[lang].doneTitle(doneDetails.name);
    document.getElementById("tf-done-body").textContent = T[lang].doneBody(doneDetails.phone);
  }

  // ---------------------------------------------------------------------------
  // Language: main.js calls render() whenever BM / EN changes

  window.EduviaTrial = {
    render(next) {
      lang = next === "en" ? "en" : "ms";
      Object.keys(errors).forEach(showError);
      updateTypoHint();
      if (current === steps.length - 1) renderReview();
      if (!status.hidden) showFailure(failureMessage);
      renderDone();
    },
  };

  form.classList.add("is-stepped");
  updateCountry();
  updateSubjects();
  showStep(0, false);
})();
