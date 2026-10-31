// Графіка гри: власні SVG, без зовнішніх файлів. Земля в сценах починається на y=164 зі 210.
const art = (cls, box, inner) => `<svg class="${cls}" viewBox="${box}" aria-hidden="true">${inner}</svg>`;

const ART_HERO = art("heroart", "0 0 70 92", `
  <path d="M59 26v62" stroke="#7a5230" stroke-width="4" stroke-linecap="round"/>
  <path d="M59 8l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="#ffd95e"/>
  <path d="M18 86c0-24 3-40 15-40s18 16 18 40z" fill="#4b5fc0"/>
  <path d="M12 90h46l-7-9H19z" fill="#39489a"/>
  <path d="M46 56l13-4" stroke="#4b5fc0" stroke-width="7" stroke-linecap="round"/>
  <circle cx="33" cy="38" r="12" fill="#f2c9a0"/>
  <circle cx="29" cy="38" r="1.8" fill="#2b2433"/><circle cx="38" cy="38" r="1.8" fill="#2b2433"/>
  <path d="M29 44q4 3 8 0" fill="none" stroke="#2b2433" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M33 2L18 30h30z" fill="#39489a"/>
  <path d="M12 31q21-7 42 0l-3 4q-18-5-36 0z" fill="#2b3475"/>`);

const ART_CAT = art("catart", "0 0 44 42", `
  <path d="M6 12v16c0 8 7 12 16 12s16-4 16-12V12l-9 6c-5-1-9-1-14 0z" fill="#f2b01e"/>
  <ellipse cx="16" cy="27" rx="2.6" ry="3.4" fill="#2b2140"/><ellipse cx="28" cy="27" rx="2.6" ry="3.4" fill="#2b2140"/>
  <path d="M20 33h4l-2 2.4z" fill="#2b2140"/>
  <path class="flame" d="M22 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#fff3c4"/>`);

const ART_HOUSE = art("hut", "0 0 100 90", `
  <rect x="15" y="40" width="70" height="50" fill="#f0e2c4"/>
  <path d="M5 44L50 6l45 38z" fill="#b5533c"/>
  <rect x="42" y="58" width="16" height="32" fill="#6b4a2f"/>
  <rect x="22" y="52" width="14" height="14" fill="#8fc6e0"/><rect x="64" y="52" width="14" height="14" fill="#8fc6e0"/>`);

const artForge = lit => art("forge", "0 0 110 130", `
  ${lit ? `<g class="flame" fill="#c9c6cc"><circle cx="84" cy="26" r="6"/><circle cx="92" cy="14" r="5"/><circle cx="87" cy="4" r="4"/></g>` : ""}
  <rect x="76" y="36" width="16" height="32" fill="#6b6470"/>
  <rect x="8" y="72" width="94" height="58" fill="#8a8490"/>
  <path d="M0 74l55-30 55 30z" fill="#4f4a58"/>
  <path d="M38 130v-28a17 17 0 0 1 34 0v28z" fill="${lit ? "#ffb347" : "#2b2433"}"/>
  ${lit ? `<path class="flame" d="M55 130c-10-6-8-13 0-24 8 11 10 18 0 24z" fill="#f2761e"/>` : ""}`);

// Мовчун: темний плащ, очі без рота й мішок украдених слів.
const ART_MOVCHUN = art("movchun", "0 0 150 170", `
  <path d="M104 92c-14 4-20 20-18 42 2 18 12 32 30 32s32-14 30-34c-2-22-14-36-28-40z" fill="#8a6a45"/>
  <path d="M100 96q14 6 24-3l-3-8q-11 6-19 3z" fill="#5f4930"/>
  <g fill="#f4e7c8" font-family="serif" font-weight="700" font-size="17" text-anchor="middle"><text x="114" y="128">А</text><text x="133" y="124">Б</text><text x="124" y="152">В</text></g>
  <path d="M14 170C18 96 22 26 58 12c36 14 38 84 44 158z" fill="#2b2140"/>
  <path d="M58 12C42 20 34 38 36 58c6 16 38 16 44 0 2-20-6-38-22-46z" fill="#40305f"/>
  <path d="M42 56c0-22 32-22 32 0 0 14-32 14-32 0z" fill="#17112b"/>
  <ellipse cx="50" cy="52" rx="3.5" ry="5" fill="#ffd95e"/><ellipse cx="66" cy="52" rx="3.5" ry="5" fill="#ffd95e"/>
  <path d="M88 84q10 2 16 8" stroke="#40305f" stroke-width="9" stroke-linecap="round" fill="none"/>`);

const artWell = full => art("well", "0 0 80 104", `
  <path d="M6 42L40 26l34 16z" fill="#7a4a30"/>
  <rect x="14" y="42" width="5" height="26" fill="#6b4a2f"/><rect x="61" y="42" width="5" height="26" fill="#6b4a2f"/>
  <rect x="38.5" y="42" width="3" height="6" fill="#4b3a2c"/><rect x="33" y="48" width="14" height="9" fill="#a9abb3"/>
  <ellipse cx="40" cy="70" rx="29" ry="6" fill="${full ? "#5db7e8" : "#6b5a45"}"/>
  ${full ? `<path class="flame" d="M40 58c2 3 3 4.5 3 6a3 3 0 0 1-6 0c0-1.5 1-3 3-6z" fill="#5db7e8"/><ellipse cx="40" cy="71" rx="9" ry="2" fill="none" stroke="#d6f0fb" stroke-width="1.5"/>` : ""}
  <path d="M11 70v30c0 2 13 4 29 4s29-2 29-4V70c0 3-13 6-29 6s-29-3-29-6z" fill="#8a8490"/>`);

// Що повернули данжі: порядок збігається з levels/*.md.
function artVillage(won) {
  return `<svg class="back" viewBox="0 0 400 210" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 150Q70 90 150 136T300 124T400 142V210H0z" fill="#9cc27a"/>
    <rect y="164" width="400" height="46" fill="#7f9a55"/></svg>` +
    art("sun", "0 0 50 50", `<circle cx="25" cy="25" r="25" fill="#ffe08a"/>`) + ART_HOUSE + artForge(won >= 1) + artWell(won >= 2);
}

const stones = c => `<rect y="164" width="400" height="46" fill="${c}"/><path d="M0 164l30-5 40 5 60-6 50 6 70-5 60 5 50-4 40 4z" fill="${c}"/>`;
const drips = c => `<path d="M0 0h400v14l-20 32-18-30-30 18-16-20-28 44-22-42-30 22-20-24-26 36-20-34-34 18-22-20-24 40-24-38-24 20-22-22-24 30z" fill="${c}"/>`;
const BACKS = {
  cave: drips("#3f342b") + stones("#3b3026"),
  dark: drips("#111027") + `<circle cx="120" cy="70" r="2" fill="#ffd95e"/><circle cx="128" cy="70" r="2" fill="#ffd95e"/><circle cx="270" cy="96" r="2" fill="#ffd95e"/><circle cx="278" cy="96" r="2" fill="#ffd95e"/>` + stones("#16152b"),
  door: `<g fill="none" stroke="#00000030" stroke-width="2"><path d="M0 50h400M0 100h400M0 150h400M60 0v50M180 0v50M300 0v50M120 50v50M240 50v50M360 50v50M60 100v50M180 100v50M300 100v50"/></g>` + stones("#2c2436"),
  web: drips("#1f332e") + `<g fill="none" stroke="#ffffff55" stroke-width="1.5"><path d="M0 0l90 110M0 0l130 60M0 0l150 10M0 0l40 130M34 42q18-16 40-10M60 72q26-26 66-20M18 80q16 4 34-12M400 0l-90 110M400 0l-130 60M400 0l-40 130M366 42q-18-16-40-10M340 72q-26-26-66-20"/></g>` + stones("#1b2c28"),
  gate: `<rect x="40" y="30" width="46" height="134" fill="#2f3743"/><rect x="314" y="30" width="46" height="134" fill="#2f3743"/><path d="M30 30h340v30H30z" fill="#252c35"/><path d="M86 164V90a114 60 0 0 1 228 0v74z" fill="#1a2028"/>` + stones("#252c35"),
  lair: drips("#2c1216") + `<path d="M0 150q60-30 120 0t130 0 150 0v14H0z" fill="#d9592a" opacity=".55"/>` + stones("#2c1216"),
  river: drips("#1e3a4a") + `<rect y="150" width="400" height="60" fill="#1f4a5e"/><g fill="none" stroke="#8fd0e8" stroke-width="2.5" stroke-linecap="round"><path class="flame" d="M20 170q15-7 30 0t30 0M170 182q15-7 30 0t30 0M300 168q15-7 30 0t30 0M90 196q15-7 30 0t30 0"/></g>`,
  ice: `<path d="M0 0h400v18l-24 56-20-52-28 34-18-38-34 66-24-60-30 34-22-36-30 54-24-50-30 30-20-32-30 58-24-54-26 30z" fill="#e8f5fb"/><path d="M30 164l20-70 22 70zM320 164l26-92 24 92zM250 164l12-46 16 46z" fill="#9fd0e6"/>` + `<rect y="164" width="400" height="46" fill="#dcecf4"/>`,
};
const artBack = bg => `<svg class="back" viewBox="0 0 400 210" preserveAspectRatio="none" aria-hidden="true">${BACKS[bg]}</svg>`;
