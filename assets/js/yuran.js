// Eduvia — Yuran 2027 (fee calculator)
//
// To change the fees, edit REGISTRATION and LEVELS below. Each level lists the
// subjects a student can take and the monthly fee for each number of subjects.
// When a level has only one choice (Asas 3M), its subjects are ticked for the visitor.

(() => {
  const REGISTRATION = 300; // RM, yearly, paid with the first month

  // Subject names are the same in Bahasa Melayu and English, except 3M
  const SUBJECTS = {
    "3m": { ms: "3M · Membaca, Menulis, Mengira", en: "3M · Reading, Writing, Arithmetic" },
    bm: "Bahasa Melayu", eng: "English", sej: "Sejarah", math: "Mathematics",
    sci: "Science", addm: "Add Maths", acc: "Accounting",
  };

  const subjectName = (key, lang) => (typeof SUBJECTS[key] === "string" ? SUBJECTS[key] : SUBJECTS[key][lang]);

  // fees: { number of subjects: RM per month }
  const LEVELS = [
    { id: "asas-3m", name: { ms: "Asas 3M", en: "3M Foundations" },
      subjects: ["3m"],
      fees: { 1: 250 } },
    { id: "rendah", name: { ms: "Darjah 2 – 6", en: "Standard 2 – 6" },
      subjects: ["bm", "eng", "math", "sci"],
      fees: { 2: 200, 3: 260, 4: 300 } },
    { id: "menengah-rendah", name: { ms: "Tingkatan 1 – 3", en: "Form 1 – 3" },
      subjects: ["bm", "eng", "sej", "math", "sci"],
      fees: { 2: 220, 3: 300, 4: 360, 5: 400 } },
    { id: "menengah-atas", name: { ms: "Tingkatan 4 – 5", en: "Form 4 – 5" },
      subjects: ["bm", "eng", "sej", "math", "sci", "addm", "acc"],
      fees: { 2: 250, 3: 330, 4: 400, 5: 450, 6: 500, 7: 530 } },
  ];

  const T = {
    ms: {
      level: "Peringkat", subjects: "Subjek",
      range: (min, max) => `Pilih ${min} hingga ${max}`,
      first: "Bayaran bulan pertama", monthly: "Bulan Ke-2 & Seterusnya", perMonth: "/ bulan",
      registration: "Pendaftaran (Tahunan)", fee: "Yuran bulanan",
      need: (min) => `Pilih sekurang-kurangnya ${min} subjek.`,
      book: "Join Free Trial Class",
      message: (level, subjects, first, fee) =>
        `Hai Eduvia, saya nak daftar kelas percubaan percuma.\n\nPeringkat: ${level}\nSubjek: ${subjects}\n` +
        `Bayaran bulan pertama: RM${first}\nBulan ke-2 & seterusnya: RM${fee}`,
      messageLevel: (level) => `Hai Eduvia, saya nak daftar kelas percubaan percuma untuk ${level}.`,
    },
    en: {
      level: "Level", subjects: "Subjects",
      range: (min, max) => `Choose ${min} to ${max}`,
      first: "First month", monthly: "Month 2 Onwards", perMonth: "/ month",
      registration: "Registration (Yearly)", fee: "Monthly fee",
      need: (min) => `Choose at least ${min} subjects.`,
      book: "Join Free Trial Class",
      message: (level, subjects, first, fee) =>
        `Hi Eduvia, I'd like to book a free trial class.\n\nLevel: ${level}\nSubjects: ${subjects}\n` +
        `First month: RM${first}\nMonth 2 onwards: RM${fee}`,
      messageLevel: (level) => `Hi Eduvia, I'd like to book a free trial class for ${level}.`,
    },
  };

  // Keeps "2 – 6" together when a level button wraps onto two lines
  const keepRange = (name) => name.replace(/\d+ – \d+/, (range) => `<span class="fc-range">${range}</span>`);

  const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  const view = document.getElementById("fee-calc");
  const state = { lang: "ms", levelId: LEVELS[0].id, picked: new Set() };

  // focus: selector of the control to focus again after re-drawing
  function render(focus) {
    if (!view) return;
    const t = T[state.lang], lang = state.lang;
    const level = LEVELS.find((l) => l.id === state.levelId);
    const counts = Object.keys(level.fees).map(Number);
    const min = Math.min(...counts), max = Math.max(...counts);
    const fixed = level.subjects.length === min; // nothing to choose: all subjects are ticked
    const picked = fixed ? level.subjects : level.subjects.filter((s) => state.picked.has(s));
    const fee = level.fees[picked.length]; // undefined until enough subjects are picked
    const first = fee && fee + REGISTRATION;

    const message = fee
      ? t.message(level.name[lang], picked.map((s) => subjectName(s, lang)).join(", "), first, fee)
      : t.messageLevel(level.name[lang]);
    const link = window.EduviaContact ? window.EduviaContact.link(message) : 'href="#contact"';

    view.innerHTML = `
      <div class="fc-inputs">
        <div class="fc-field">
          <span class="fc-label" id="fc-level-label">${t.level}</span>
          <div class="fc-levels" role="group" aria-labelledby="fc-level-label">
            ${LEVELS.map((l) => `<button type="button" data-level="${l.id}" aria-pressed="${l.id === level.id}">${keepRange(l.name[lang])}</button>`).join("")}
          </div>
        </div>
        <div class="fc-field">
          <span class="fc-label" id="fc-subject-label">${t.subjects}${fixed ? "" : ` <span class="fc-hint">${t.range(min, max)}</span>`}</span>
          <div class="fc-subjects" role="group" aria-labelledby="fc-subject-label">
            ${level.subjects.map((s) => `<button type="button" class="fc-subject" data-subject="${s}" aria-pressed="${picked.includes(s)}"${fixed ? " disabled" : ""}>
              <span class="fc-check">${CHECK}</span>${subjectName(s, lang)}</button>`).join("")}
          </div>
        </div>
      </div>

      <div class="fc-result on-dark" aria-live="polite">
        <div class="fc-total">
          <span class="mono-label">${t.first}</span>
          <p class="fc-amount">${fee ? `RM${first}` : "RM —"}</p>
          ${fee ? `<dl class="fc-breakdown">
            <div><dt>${t.registration}</dt><dd>RM${REGISTRATION}</dd></div>
            <div><dt>${t.fee}</dt><dd>RM${fee}</dd></div>
          </dl>` : `<p class="fc-note">${t.need(min)}</p>`}
        </div>
        <div class="fc-total">
          <span class="mono-label">${t.monthly}</span>
          <p class="fc-amount fc-amount-sm">${fee ? `RM${fee}` : "RM —"} <em>${t.perMonth}</em></p>
        </div>
        <a class="btn btn-arrow btn-block" ${link}><span>${t.book}</span>${ARROW}</a>
      </div>`;

    if (focus) view.querySelector(focus)?.focus();
  }

  if (view) {
    view.addEventListener("click", (event) => {
      const levelBtn = event.target.closest("[data-level]");
      if (levelBtn) {
        state.levelId = levelBtn.dataset.level;
        render(`[data-level="${state.levelId}"]`);
        return;
      }
      const subjectBtn = event.target.closest("[data-subject]");
      if (subjectBtn) {
        const key = subjectBtn.dataset.subject;
        if (state.picked.has(key)) state.picked.delete(key);
        else state.picked.add(key);
        render(`[data-subject="${key}"]`);
      }
    });
  }

  // Called by main.js whenever the language changes
  window.EduviaYuran = { render(lang) { state.lang = lang === "en" ? "en" : "ms"; render(); } };
})();
