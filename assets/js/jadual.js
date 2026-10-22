// Eduvia — Jadual 2027 (class timetable)
//
// To change the timetable, edit CLASSES below. Each session is
//   [day, start, end, subject]
// with day one of mon tue wed thu fri sat sun, times in 24-hour "HH:MM",
// and subject one of the keys in SUBJECTS.

const SUBJECTS = {
  "3m":  { ms: "3M · Membaca, Menulis, Mengira", en: "3M · Reading, Writing, Arithmetic", color: "#ebc35b" },
  bm:    { ms: "Bahasa Melayu", en: "Bahasa Melayu", color: "#f2994a" },
  eng:   { ms: "English", en: "English", color: "#5eb6ff" },
  sej:   { ms: "Sejarah", en: "Sejarah", color: "#a77bd6" },
  math:  { ms: "Mathematics", en: "Mathematics", color: "#12195f" },
  sci:   { ms: "Science", en: "Science", color: "#2fb67c" },
  addm:  { ms: "Add Maths", en: "Add Maths", color: "#e05d7a" },
  acc:   { ms: "Accounting", en: "Accounting", color: "#c98a1e" },
};

// stage: "rendah" (preschool and primary) or "menengah" (secondary)
// level: value of the matching option in the enquiry form's level dropdown
const CLASSES = [
  { id: "prek", stage: "rendah", level: "prek",
    name: { ms: "5 Tahun – Darjah 1", en: "Age 5 – Standard 1" },
    // Shown under the class name to help parents pick a group
    notes: {
      A: { ms: "Pelajar baru mula & sangat lemah", en: "New starters & very weak students" },
      B: { ms: "Pelajar lemah hingga sederhana", en: "Weak to average students" },
    },
    groups: {
      A: [["sat", "09:30", "11:30", "3m"]],
      B: [["sat", "09:30", "11:30", "3m"]],
    } },
  { id: "d2", stage: "rendah", level: "d2-3",
    name: { ms: "Darjah 2", en: "Standard 2" },
    groups: { "": [["fri", "20:00", "21:00", "math"], ["fri", "21:00", "22:00", "sci"]] } },
  { id: "d3", stage: "rendah", level: "d2-3",
    name: { ms: "Darjah 3", en: "Standard 3" },
    groups: { "": [
      ["mon", "20:00", "21:00", "bm"], ["mon", "21:00", "22:00", "eng"],
      ["fri", "20:00", "21:00", "sci"], ["fri", "21:00", "22:00", "math"],
    ] } },
  { id: "d4", stage: "rendah", level: "d4-6",
    name: { ms: "Darjah 4", en: "Standard 4" },
    groups: {
      A: [["tue", "20:00", "21:00", "math"], ["tue", "21:00", "22:00", "sci"],
          ["sat", "11:30", "12:30", "bm"], ["sat", "12:30", "13:30", "eng"]],
      B: [["mon", "20:00", "21:00", "eng"], ["mon", "21:00", "22:00", "bm"],
          ["sat", "09:30", "10:30", "math"], ["sat", "10:30", "11:30", "sci"]],
    } },
  { id: "d5", stage: "rendah", level: "d4-6",
    name: { ms: "Darjah 5", en: "Standard 5" },
    groups: {
      A: [["tue", "20:00", "21:00", "sci"], ["tue", "21:00", "22:00", "math"],
          ["sat", "11:30", "12:30", "eng"], ["sat", "12:30", "13:30", "bm"]],
      B: [["mon", "20:00", "21:00", "sci"], ["mon", "21:00", "22:00", "math"],
          ["sat", "11:30", "12:30", "eng"], ["sat", "12:30", "13:30", "bm"]],
    } },
  { id: "d6", stage: "rendah", level: "d4-6",
    name: { ms: "Darjah 6", en: "Standard 6" },
    groups: {
      A: [["mon", "20:00", "21:00", "math"], ["mon", "21:00", "22:00", "sci"],
          ["thu", "20:00", "21:00", "bm"], ["thu", "21:00", "22:00", "eng"]],
      B: [["thu", "20:00", "21:00", "bm"], ["thu", "21:00", "22:00", "eng"],
          ["sat", "09:30", "10:30", "math"], ["sat", "10:30", "11:30", "sci"]],
    } },
  { id: "t1", stage: "menengah", level: "f1-3",
    name: { ms: "Tingkatan 1", en: "Form 1" },
    groups: { "": [
      ["thu", "20:00", "21:00", "eng"], ["thu", "21:00", "22:00", "bm"],
      ["sat", "11:30", "12:30", "math"], ["sat", "12:30", "13:30", "sci"],
    ] } },
  { id: "t2", stage: "menengah", level: "f1-3",
    name: { ms: "Tingkatan 2", en: "Form 2" },
    groups: { "": [
      ["wed", "20:00", "21:00", "math"], ["wed", "20:00", "21:00", "sej"], ["wed", "21:00", "22:00", "sci"],
      ["fri", "20:00", "21:00", "bm"], ["fri", "21:00", "22:00", "eng"],
    ] } },
  { id: "t3", stage: "menengah", level: "f1-3",
    name: { ms: "Tingkatan 3", en: "Form 3" },
    groups: {
      A: [["wed", "20:00", "21:00", "sci"], ["wed", "21:00", "22:00", "math"], ["wed", "21:00", "22:00", "sej"],
          ["fri", "20:00", "21:00", "eng"], ["fri", "21:00", "22:00", "bm"]],
      B: [["wed", "21:00", "22:00", "sej"],
          ["fri", "20:00", "21:00", "eng"], ["fri", "21:00", "22:00", "bm"],
          ["sat", "11:30", "12:30", "sci"], ["sat", "12:30", "13:30", "math"]],
    } },
  { id: "t4", stage: "menengah", level: "f4-5",
    name: { ms: "Tingkatan 4", en: "Form 4" },
    groups: {
      A: [["tue", "20:00", "21:15", "bm"], ["tue", "21:15", "22:30", "eng"],
          ["wed", "20:00", "21:15", "sej"],
          ["thu", "17:00", "18:15", "addm"], ["thu", "18:15", "19:30", "acc"],
          ["thu", "20:00", "21:15", "math"], ["thu", "21:15", "22:30", "sci"]],
      B: [["tue", "20:00", "21:15", "bm"], ["tue", "21:15", "22:30", "eng"],
          ["wed", "17:00", "18:15", "math"], ["wed", "18:15", "19:30", "sci"], ["wed", "20:00", "21:15", "sej"],
          ["thu", "17:00", "18:15", "addm"], ["thu", "18:15", "19:30", "acc"]],
    } },
  { id: "t5", stage: "menengah", level: "f4-5",
    name: { ms: "Tingkatan 5", en: "Form 5" },
    groups: {
      A: [["tue", "20:00", "21:15", "eng"], ["tue", "21:15", "22:30", "bm"],
          ["wed", "21:15", "22:30", "sej"],
          ["thu", "17:00", "18:15", "acc"], ["thu", "18:15", "19:30", "addm"],
          ["thu", "20:00", "21:15", "sci"], ["thu", "21:15", "22:30", "math"]],
      B: [["tue", "20:00", "21:15", "eng"], ["tue", "21:15", "22:30", "bm"],
          ["wed", "17:00", "18:15", "sci"], ["wed", "18:15", "19:30", "math"], ["wed", "21:15", "22:30", "sej"],
          ["thu", "17:00", "18:15", "acc"], ["thu", "18:15", "19:30", "addm"]],
    } },
];

// ---------------------------------------------------------------------------

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_NAMES = {
  ms: { mon: "Isnin", tue: "Selasa", wed: "Rabu", thu: "Khamis", fri: "Jumaat", sat: "Sabtu", sun: "Ahad" },
  en: { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" },
};

const T = {
  ms: {
    pick: "Umur Pelajar", group: "Kumpulan", book: "Join Free Trial Class",
    message: (c) => `Saya berminat dengan kelas ${c}.`,
  },
  en: {
    pick: "Student's Age", group: "Group", book: "Join Free Trial Class",
    message: (c) => `I'm interested in the ${c} class.`,
  },
};

const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const clock = (min) => `${(Math.floor(min / 60) % 12) || 12}.${String(min % 60).padStart(2, "0")}`;

// Malay period words, matching the posters (a range takes the word of its end time):
// 11.30 – 12.30 tengah hari, 12.30 – 1.30 petang, 6.15 – 7.30 petang, 8.00 – 9.00 malam
function msPeriod(min) {
  if (min < 12 * 60) return "pagi";
  if (min <= 13 * 60) return "tengah hari";
  if (min < 20 * 60) return "petang";
  return "malam";
}
const enPeriod = (min) => (min < 12 * 60 ? "am" : "pm");

function timeRange(start, end, lang) {
  const s = toMin(start), e = toMin(end);
  if (lang === "en") {
    return enPeriod(s) === enPeriod(e)
      ? `${clock(s)} – ${clock(e)} ${enPeriod(e)}`
      : `${clock(s)} ${enPeriod(s)} – ${clock(e)} ${enPeriod(e)}`;
  }
  return `${clock(s)} – ${clock(e)} ${msPeriod(e)}`;
}

const className = (cls, group, lang) => (group ? `${cls.name[lang]} · ${T[lang].group} ${group}` : cls.name[lang]);
const findClass = (id) => CLASSES.find((c) => c.id === id);

// ---------------------------------------------------------------------------

const app = document.getElementById("jadual-app");
const view = document.getElementById("jadual-view");
const state = { lang: "ms", classId: CLASSES[0].id, group: Object.keys(CLASSES[0].groups)[0] };

function render() {
  if (!view) return;
  const t = T[state.lang], lang = state.lang;
  const cls = findClass(state.classId);
  const groups = Object.keys(cls.groups);
  const sessions = cls.groups[state.group];

  const options = CLASSES.map((c) =>
    `<option value="${c.id}"${c.id === cls.id ? " selected" : ""}>${c.name[lang]}</option>`).join("");

  const days = DAYS.filter((d) => sessions.some((s) => s[0] === d)).map((d) => {
    const rows = sessions.filter((s) => s[0] === d).sort((a, b) => toMin(a[1]) - toMin(b[1]));
    return `<section class="jv-dayblock">
        <h4>${DAY_NAMES[lang][d]}</h4>
        <ul>${rows.map((s) => {
          const subj = SUBJECTS[s[3]];
          return `<li class="jv-session" style="--c:${subj.color}">
              <span class="jv-subject">${subj[lang]}</span>
              <span class="jv-time">${timeRange(s[1], s[2], lang)}</span>
            </li>`;
        }).join("")}</ul>
      </section>`;
  }).join("");

  view.innerHTML = `
    <div class="jv-controls">
      <label class="jv-select">
        <span>${t.pick}</span>
        <select id="jadual-umur">${options}</select>
      </label>
      ${groups.length > 1 ? `<div class="jv-groups" role="group" aria-label="${t.group}">
        ${groups.map((g) => `<button type="button" data-group="${g}" aria-pressed="${g === state.group}">${t.group} ${g}</button>`).join("")}
      </div>` : ""}
    </div>

    <article class="jv-card"${groups.length > 1 ? ` data-group="${state.group}"` : ""} aria-live="polite">
      <h3>${cls.name[lang]}</h3>
      ${cls.notes ? `<ul class="jv-notes">${groups.map((g) => `
        <li data-group="${g}"${g === state.group ? ' class="is-current"' : ""}><b>${t.group} ${g}</b> ${cls.notes[g][lang]}</li>`).join("")}
      </ul>` : ""}
      <div class="jv-days">${days}</div>
      <a class="btn btn-arrow jv-book" href="#contact" data-book>
        <span>${t.book}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
    </article>`;
}

if (app) {
  app.addEventListener("change", (event) => {
    if (event.target.id !== "jadual-umur") return;
    state.classId = event.target.value;
    state.group = Object.keys(findClass(state.classId).groups)[0];
    render();
    document.getElementById("jadual-umur").focus();
  });

  app.addEventListener("click", (event) => {
    const groupBtn = event.target.closest(".jv-groups button");
    if (groupBtn) { state.group = groupBtn.dataset.group; render(); return; }

    if (event.target.closest("[data-book]")) {
      // Pre-fill the enquiry form with this class, then let the link scroll to it
      const cls = findClass(state.classId);
      const groups = Object.keys(cls.groups);
      const level = document.getElementById("level");
      const message = document.getElementById("message");
      if (level) level.value = cls.level;
      if (message && !message.value.trim()) {
        message.value = T[state.lang].message(className(cls, groups.length > 1 ? state.group : "", state.lang));
      }
      setTimeout(() => document.getElementById("parent-name")?.focus({ preventScroll: true }), 600);
    }
  });
}

// Called by main.js whenever the language changes
window.EduviaJadual = { render(lang) { state.lang = lang === "en" ? "en" : "ms"; render(); } };
