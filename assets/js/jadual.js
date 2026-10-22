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
const DAY_SHORT = {
  ms: { mon: "Isn", tue: "Sel", wed: "Rab", thu: "Kha", fri: "Jum", sat: "Sab", sun: "Ahd" },
  en: { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" },
};

const T = {
  ms: {
    pickClass: "Pilih kelas", rendah: "Prasekolah & Sekolah Rendah", menengah: "Sekolah Menengah",
    group: "Kumpulan", today: "Hari ini", now: "Sedang berlangsung", next: "Seterusnya", off: "Tiada kelas",
    days: (n) => `${n} hari seminggu`, classes: (n) => `${n} kelas`, hours: (h) => `${h} seminggu`,
    all: "Semua", noClasses: "Tiada kelas pada hari ini.", openClass: "Lihat jadual kelas ini",
    book: "Join Free Trial Class", sameTime: "Pada masa yang sama",
    message: (c) => `Saya berminat dengan kelas ${c}.`,
  },
  en: {
    pickClass: "Choose a class", rendah: "Preschool & Primary", menengah: "Secondary",
    group: "Group", today: "Today", now: "On now", next: "Up next", off: "No classes",
    days: (n) => `${n} day${n > 1 ? "s" : ""} a week`, classes: (n) => `${n} class${n > 1 ? "es" : ""}`, hours: (h) => `${h} a week`,
    all: "All", noClasses: "No classes on this day.", openClass: "See this class's timetable",
    book: "Join Free Trial Class", sameTime: "At the same time",
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
const timePoint = (t, lang) => {
  const m = toMin(t);
  return `${clock(m)} ${lang === "en" ? enPeriod(m) : msPeriod(m)}`;
};

function duration(mins, lang) {
  const h = Math.floor(mins / 60), m = mins % 60;
  if (lang === "en") return [h && `${h} hr`, m && `${m} min`].filter(Boolean).join(" ");
  return [h && `${h} jam`, m && `${m} min`].filter(Boolean).join(" ");
}

// Total time of a set of sessions, counting overlapping sessions once
function totalMinutes(sessions) {
  let total = 0;
  for (const day of DAYS) {
    const spans = sessions.filter((s) => s[0] === day).map((s) => [toMin(s[1]), toMin(s[2])]).sort((a, b) => a[0] - b[0]);
    let curS = -1, curE = -1;
    for (const [s, e] of spans) {
      if (s > curE) { if (curE > curS) total += curE - curS; curS = s; curE = e; }
      else curE = Math.max(curE, e);
    }
    if (curE > curS) total += curE - curS;
  }
  return total;
}

// Current day and minute in Malaysia
function nowInMalaysia() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kuala_Lumpur", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  return { day: get("weekday").slice(0, 3).toLowerCase(), min: Number(get("hour")) % 24 * 60 + Number(get("minute")) };
}

const className = (cls, group, lang) => (group ? `${cls.name[lang]} · ${T[lang].group} ${group}` : cls.name[lang]);

// ---------------------------------------------------------------------------

const app = document.getElementById("jadual-app");
const view = document.getElementById("jadual-view");
const today = nowInMalaysia();

const state = {
  lang: "ms",
  mode: "class",
  classId: CLASSES[0].id,
  group: Object.keys(CLASSES[0].groups)[0],
  day: today.day === "sun" ? "mon" : today.day,
  filter: "all",
};

const findClass = (id) => CLASSES.find((c) => c.id === id);

function sessionStatus(day, start, end) {
  if (day !== today.day) return "";
  const s = toMin(start), e = toMin(end);
  if (today.min >= s && today.min < e) return "now";
  return "";
}

function renderClassView() {
  const t = T[state.lang], lang = state.lang;
  const cls = findClass(state.classId);
  const groups = Object.keys(cls.groups);
  const sessions = cls.groups[state.group];
  const activeDays = DAYS.filter((d) => sessions.some((s) => s[0] === d));
  const nextToday = sessions
    .filter((s) => s[0] === today.day && toMin(s[1]) > today.min)
    .sort((a, b) => toMin(a[1]) - toMin(b[1]))[0];

  const chips = (stage) => CLASSES.filter((c) => c.stage === stage).map((c) => `
      <button type="button" class="jv-chip" data-class="${c.id}" aria-pressed="${c.id === cls.id}">${c.name[lang]}</button>`).join("");

  const week = DAYS.map((d) => {
    const n = sessions.filter((s) => s[0] === d).length;
    return `<li class="jv-weekday${n ? " has" : ""}${d === today.day ? " is-today" : ""}">
        <span>${DAY_SHORT[lang][d]}</span><i aria-hidden="true">${n ? n : "–"}</i>
      </li>`;
  }).join("");

  const days = activeDays.map((d) => {
    const rows = sessions.filter((s) => s[0] === d).sort((a, b) => toMin(a[1]) - toMin(b[1]));
    return `<section class="jv-dayblock${d === today.day ? " is-today" : ""}">
        <h4>${DAY_NAMES[lang][d]}${d === today.day ? ` <span class="jv-badge">${t.today}</span>` : ""}</h4>
        <ul>${rows.map((s) => {
          const subj = SUBJECTS[s[3]];
          const status = sessionStatus(...s.slice(0, 3)) || (s === nextToday ? "next" : "");
          const same = rows.filter((r) => r !== s && r[1] === s[1] && r[2] === s[2]).length > 0;
          return `<li class="jv-session" style="--c:${subj.color}">
              <span class="jv-subject">${subj[lang]}${same ? ` <em class="jv-note">${t.sameTime}</em>` : ""}</span>
              <span class="jv-time">${timeRange(s[1], s[2], lang)}</span>
              <span class="jv-dur">${duration(toMin(s[2]) - toMin(s[1]), lang)}</span>
              ${status ? `<span class="jv-status ${status}">${status === "now" ? t.now : t.next}</span>` : ""}
            </li>`;
        }).join("")}</ul>
      </section>`;
  }).join("");

  return `
    <div class="jv-class">
      <div class="jv-picker">
        <p class="jv-picker-label">${t.rendah}</p>
        <div class="jv-chips">${chips("rendah")}</div>
        <p class="jv-picker-label">${t.menengah}</p>
        <div class="jv-chips">${chips("menengah")}</div>
      </div>

      <article class="jv-card" aria-live="polite">
        <header class="jv-card-head">
          <div>
            <span class="mono-label">Jadual 2027</span>
            <h3>${cls.name[lang]}</h3>
          </div>
          ${groups.length > 1 ? `<div class="jv-groups" role="group" aria-label="${t.group}">
            ${groups.map((g) => `<button type="button" data-group="${g}" aria-pressed="${g === state.group}">${t.group} ${g}</button>`).join("")}
          </div>` : ""}
        </header>

        <ol class="jv-week" aria-label="${activeDays.map((d) => DAY_NAMES[lang][d]).join(", ")}">${week}</ol>

        <p class="jv-stats">
          <span>${t.days(activeDays.length)}</span>
          <span>${t.classes(sessions.length)}</span>
          <span>${t.hours(duration(totalMinutes(sessions), lang))}</span>
        </p>

        <div class="jv-days">${days}</div>

        <a class="btn btn-arrow jv-book" href="#contact" data-book>
          <span>${t.book}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
      </article>
    </div>`;
}

function renderDayView() {
  const t = T[state.lang], lang = state.lang;
  const all = [];
  for (const cls of CLASSES) {
    if (state.filter !== "all" && cls.stage !== state.filter) continue;
    for (const [group, sessions] of Object.entries(cls.groups)) {
      for (const s of sessions) all.push({ cls, group, s });
    }
  }
  const tabDays = DAYS.filter((d) => d !== "sun");
  const tabs = tabDays.map((d) => {
    const n = all.filter((x) => x.s[0] === d).length;
    return `<button type="button" data-day="${d}" aria-pressed="${d === state.day}"${d === today.day ? ' class="is-today"' : ""}>
        <span class="jv-tab-day">${DAY_SHORT[lang][d]}</span><span class="jv-tab-count">${n}</span>
      </button>`;
  }).join("");

  const items = all.filter((x) => x.s[0] === state.day);
  const slots = [...new Set(items.map((x) => x.s[1]))].sort((a, b) => toMin(a) - toMin(b));
  const upcoming = state.day === today.day ? slots.find((st) => toMin(st) > today.min) : null;

  const timeline = slots.length ? slots.map((start) => {
    const here = items.filter((x) => x.s[1] === start);
    const live = here.some((x) => sessionStatus(...x.s.slice(0, 3)) === "now");
    return `<div class="jv-slot${live ? " is-now" : ""}">
        <div class="jv-slot-time">
          <strong>${timePoint(start, lang)}</strong>
          ${live ? `<span class="jv-status now">${t.now}</span>` : start === upcoming ? `<span class="jv-status next">${t.next}</span>` : ""}
        </div>
        <div class="jv-slot-cards">${here.map((x) => {
          const subj = SUBJECTS[x.s[3]];
          return `<button type="button" class="jv-mini" style="--c:${subj.color}" data-open="${x.cls.id}" data-open-group="${x.group}" title="${t.openClass}">
              <span class="jv-subject">${subj[lang]}</span>
              <span class="jv-mini-class">${className(x.cls, x.group, lang)}</span>
              <span class="jv-time">${timeRange(x.s[1], x.s[2], lang)}</span>
            </button>`;
        }).join("")}</div>
      </div>`;
  }).join("") : `<p class="jv-empty">${t.noClasses}</p>`;

  const filters = [["all", t.all], ["rendah", t.rendah], ["menengah", t.menengah]]
    .map(([k, label]) => `<button type="button" data-filter="${k}" aria-pressed="${k === state.filter}">${label}</button>`).join("");

  return `
    <div class="jv-day">
      <div class="jv-daytabs" role="group" aria-label="${lang === "en" ? "Day" : "Hari"}">${tabs}</div>
      <div class="jv-filters" role="group">${filters}</div>
      <h3 class="jv-day-title">${DAY_NAMES[lang][state.day]}${state.day === today.day ? ` <span class="jv-badge">${t.today}</span>` : ""}</h3>
      <div class="jv-timeline">${timeline}</div>
    </div>`;
}

function render() {
  if (!view) return;
  app.querySelectorAll("[data-mode]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === state.mode)));
  view.innerHTML = state.mode === "class" ? renderClassView() : renderDayView();
  const picked = view.querySelector('.jv-chip[aria-pressed="true"]');
  if (picked && picked.parentElement.scrollWidth > picked.parentElement.clientWidth) {
    picked.parentElement.scrollLeft = picked.offsetLeft - 16;
  }
}

if (app) {
  app.addEventListener("click", (event) => {
    const el = event.target.closest("button, a[data-book]");
    if (!el || !app.contains(el)) return;

    if (el.dataset.mode) state.mode = el.dataset.mode;
    else if (el.dataset.class) {
      state.classId = el.dataset.class;
      state.group = Object.keys(findClass(state.classId).groups)[0];
    }
    else if (el.dataset.group !== undefined && el.closest(".jv-groups")) state.group = el.dataset.group;
    else if (el.dataset.day) state.day = el.dataset.day;
    else if (el.dataset.filter) state.filter = el.dataset.filter;
    else if (el.dataset.open) {
      state.mode = "class"; state.classId = el.dataset.open; state.group = el.dataset.openGroup;
    }
    else if (el.hasAttribute("data-book")) {
      // Pre-fill the enquiry form with this class, then let the link scroll to it
      const cls = findClass(state.classId);
      const level = document.getElementById("level");
      const message = document.getElementById("message");
      if (level) level.value = cls.level;
      if (message && !message.value.trim()) message.value = T[state.lang].message(className(cls, state.group, state.lang));
      setTimeout(() => document.getElementById("parent-name")?.focus({ preventScroll: true }), 600);
      return;
    }
    else return;
    render();
  });
}

// Called by main.js whenever the language changes
window.EduviaJadual = { render(lang) { state.lang = lang === "en" ? "en" : "ms"; render(); } };
