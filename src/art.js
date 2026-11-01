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

const board = (x, y, w, h, text) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#7a5230" stroke="#4b3a2c"/><text x="${x + w / 2}" y="${y + h - 3}" fill="#f4e7c8" font-family="sans-serif" font-weight="700" font-size="${h - 3}" text-anchor="middle">${text}</text>`;

const artHouse = (sign, school) => art("hut", "0 0 100 90", `
  <rect x="15" y="40" width="70" height="50" fill="#f0e2c4"/>
  <path d="M5 44L50 6l45 38z" fill="#b5533c"/>
  <rect x="42" y="58" width="16" height="32" fill="#6b4a2f"/>
  <rect x="22" y="52" width="14" height="14" fill="#8fc6e0"/><rect x="64" y="52" width="14" height="14" fill="#8fc6e0"/>
  ${sign ? board(20, 40, 60, 15, school ? "ШКОЛА" : "ХАТА") : ""}`);

// Кузня кам'яна: шви між каменями, дахівка, цегла на димарі й кам'яна арка.
const artForge = (lit, sign) => art("forge", "0 0 110 130", `
  ${lit ? `<g class="flame" fill="#c9c6cc"><circle cx="84" cy="26" r="6"/><circle cx="92" cy="14" r="5"/><circle cx="87" cy="4" r="4"/></g>` : ""}
  <rect x="76" y="36" width="16" height="32" fill="#6b6470"/>
  <rect x="73" y="33" width="22" height="5" fill="#57505c"/>
  <path d="M76 44h16M76 52h16M76 60h16M84 38v6M80 44v8M88 44v8M84 52v8M80 60v8M88 60v8" stroke="#00000038" stroke-width="1"/>
  <rect x="8" y="72" width="94" height="58" fill="#8a8490"/>
  <g fill="#9a95a0"><rect x="10" y="86" width="20" height="10"/><rect x="82" y="74" width="18" height="10"/><rect x="74" y="110" width="20" height="10"/><rect x="18" y="110" width="16" height="10"/></g>
  <g fill="#77717d"><rect x="32" y="74" width="20" height="10"/><rect x="82" y="98" width="18" height="10"/><rect x="10" y="122" width="14" height="8"/></g>
  <path d="M8 84h94M8 96h94M8 108h94M8 120h94M30 72v12M54 72v12M80 72v12M18 84v12M42 84v12M68 84v12M92 84v12M30 96v12M80 96v12M16 108v12M36 108v12M74 108v12M94 108v12M26 120v10M84 120v10" stroke="#00000038" stroke-width="1"/>
  <path d="M0 74l55-30 55 30z" fill="#4f4a58"/>
  <path d="M37 54h36M18 64h74M46 54v10M64 54v10M28 64v10M46 64v10M64 64v10M82 64v10" stroke="#00000045" stroke-width="1"/>
  <path d="M0 74h110" stroke="#3b3743" stroke-width="2"/>
  <path d="M38 130v-28a17 17 0 0 1 34 0v28z" fill="${lit ? "#ffb347" : "#2b2433"}"/>
  <path d="M38 130v-28a17 17 0 0 1 34 0v28" fill="none" stroke="#6b6470" stroke-width="4"/>
  ${lit ? `<path class="flame" d="M55 130c-10-6-8-13 0-24 8 11 10 18 0 24z" fill="#f2761e"/>` : ""}
  ${sign ? board(20, 70, 70, 17, "КУЗНЯ") : ""}`);

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

const sail = (turn, fill) => `<g transform="rotate(${turn} 40 44)"><path d="M41 12h8v28h-8z" fill="${fill}" stroke="#8a6a45"/><path d="M39 44V8h2v36z" fill="#6b4a2f"/></g>`;
// Крила стоять перед вежею. Зламаний млин: одне ціле крило, одне обірване й латки на стінах.
const artMill = (fixed, sign) => art("mill", "0 0 80 124", `
  <path d="M22 124l7-72h22l7 72z" fill="${fixed ? "#d9cdb4" : "#a39a8a"}"/>
  <path d="M25 54l15-20 15 20z" fill="#7a4a30"/>
  <path d="M33 124v-16a7 7 0 0 1 14 0v16z" fill="#6b4a2f"/>
  ${fixed ? `<g class="spin">${[0, 90, 180, 270].map(t => sail(t, "#f4ead2")).join("")}</g>`
    : `<path d="M34 72l5 3-3 6-4-3z" fill="#7d7566"/><path d="M45 92l5 2-2 7-4-2z" fill="#7d7566"/>
       ${sail(35, "#8f8778")}<g transform="rotate(205 40 44)"><path d="M39 44V24l2 3v17z" fill="#6b4a2f"/><path d="M41 28l7 4-3 4 3 4h-7z" fill="#8f8778"/></g>`}
  <circle cx="40" cy="44" r="4" fill="#4b3a2c"/>
  ${sign ? board(14, 76, 52, 16, "МЛИН") : ""}`);

const artBelfry = rung => art("belfry", "0 0 60 150", `
  <rect x="12" y="44" width="36" height="106" fill="#b9b2a6"/>
  <path d="M6 46L30 6l24 40z" fill="#4f6a8a"/>
  <path d="M19 86V66a11 11 0 0 1 22 0v20z" fill="#2b2433"/>
  ${rung ? `<path class="flame" d="M30 62c-6 0-7 6-8 15-1 2-2 3-2 4h20c0-1-1-2-2-4-1-9-2-15-8-15z" fill="#e2a93b"/>` : ""}
  <path d="M22 150v-18a8 8 0 0 1 16 0v18z" fill="#6b4a2f"/>`);

// Дерево стоїть завжди. Поки слова немає, на гілці гойдаються порожні мотузки.
const artTree = cradle => art("tree", "0 0 110 170", `
  <path d="M68 170c3-40-1-80 3-112h17c1 34-3 74 3 112z" fill="#7a5230"/>
  <path d="M74 92Q50 76 16 82" fill="none" stroke="#7a5230" stroke-width="7" stroke-linecap="round"/>
  <circle cx="84" cy="42" r="34" fill="#5f8f4e"/><circle cx="52" cy="54" r="26" fill="#6fa35a"/><circle cx="100" cy="66" r="10" fill="#6fa35a"/>
  <g class="sway"><path d="M24 80v${cradle ? 34 : 16}M48 80v${cradle ? 34 : 16}" stroke="#4b3a2c" stroke-width="2"/>
  ${cradle ? `<path d="M10 114q26 34 52 0z" fill="#a9744a" stroke="#7a5230" stroke-width="2"/><path d="M16 114q20 16 40 0z" fill="#f4e7c8"/><circle cx="30" cy="119" r="6" fill="#f2c9a0"/>` : ""}</g>`);

const ART_SHIP = art("ship", "0 0 60 48", `
  <path d="M4 30h52l-9 16H13z" fill="#7a4a30"/><rect x="28" y="2" width="3" height="30" fill="#4b3a2c"/>
  <path d="M32 4l20 23H32zM27 8L10 27h17z" fill="#f4ead2" stroke="#b9b2a6"/>`);

// Родина: людей не малюємо, спільне свято показують накритий стіл і прапорці.
const ART_TABLE = art("feast", "0 0 150 62", `
  <rect x="24" y="34" width="6" height="24" fill="#6b4a2f"/><rect x="120" y="34" width="6" height="24" fill="#6b4a2f"/>
  <path d="M8 24h134v12l-8 8-8-8-10 8-10-8-10 8-10-8-10 8-10-8-10 8-10-8-10 8-8-8-8 8-8-8z" fill="#f4ead2" stroke="#b5533c" stroke-width="2"/>
  <path d="M0 58h34M116 58h34" stroke="#7a5230" stroke-width="5" stroke-linecap="round"/>
  <path d="M28 24c0-16 30-16 30 0z" fill="#c98b3e"/><path d="M34 16l3 6M43 13l3 8M51 16l2 6" stroke="#8a5a26" stroke-width="2"/>
  <path d="M70 24l-2-14h14l-2 14z" fill="#4f6a8a"/><path d="M82 13q6 2 0 8" fill="none" stroke="#4f6a8a" stroke-width="2"/>
  <circle cx="98" cy="19" r="5" fill="#c9402e"/><circle cx="109" cy="19" r="5" fill="#d09a2e"/><circle cx="103" cy="12" r="5" fill="#c9402e"/>`);
const ART_FLAGS = art("flags", "0 0 240 34", `
  <path d="M0 4Q120 30 240 4" fill="none" stroke="#7a5230" stroke-width="1.5"/>
  <path d="M26 9l12 3-8 12zM66 15l13 2-8 13zM108 18h13l-6 13zM150 17l13-2-5 14zM192 13l13-3-5 13z" fill="#c9402e"/>
  <path d="M46 12l12 3-8 12zM87 17l13 1-7 13zM129 18l13-1-6 13zM171 15l13-3-5 14z" fill="#e2a93b"/>`);

// Мовчун читає: плащ, очі без рота й розгорнута книга.
const ART_READER = art("reader", "0 0 70 90", `
  <path d="M8 90C10 50 16 16 34 8c18 8 24 42 26 82z" fill="#2b2140"/>
  <path d="M22 34c0-16 24-16 24 0 0 11-24 11-24 0z" fill="#17112b"/>
  <ellipse cx="29" cy="32" rx="2.5" ry="3.5" fill="#ffd95e"/><ellipse cx="39" cy="32" rx="2.5" ry="3.5" fill="#ffd95e"/>
  <path d="M14 58l20 6 20-6v18l-20 6-20-6z" fill="#f4ead2" stroke="#8a6a45"/><path d="M34 64v18" stroke="#8a6a45"/>
  <path d="M20 66l9 3M20 71l9 3M48 66l-9 3M48 71l-9 3" stroke="#6c6276"/>`);

// Що повернули данжі: порядок збігається з levels/*.md.
function artVillage(won) {
  return `<svg class="back" viewBox="0 0 400 210" preserveAspectRatio="none" aria-hidden="true">
    ${won >= 8 ? `<rect y="96" width="400" height="70" fill="#6fb6d8"/>` : ""}
    <path d="M0 150Q70 90 150 136T300 124T400 142V210H0z" fill="#9cc27a"/>
    <path d="M0 164v-22q40-22 72-6 26 12 44 28z" fill="${won >= 3 ? "#e8c34a" : "#a58a5e"}"/>
    <rect y="164" width="400" height="46" fill="#7f9a55"/>
    ${won >= 5 ? `<path d="M170 210q40-22 110-34t120-30v18q-60 20-120 34t-80 12z" fill="#d9c79a"/>`
      : `<g fill="#f2f2f0" opacity=".75"><ellipse cx="380" cy="150" rx="46" ry="18"/><ellipse cx="340" cy="170" rx="40" ry="12"/></g>`}</svg>` +
    art("sun", "0 0 50 50", `<circle cx="25" cy="25" r="25" fill="#ffe08a"/>`) +
    (won >= 8 ? ART_SHIP : "") + artTree(won >= 6) + artBelfry(won >= 4) + artMill(won >= 3, won >= 7) + artHouse(won >= 7, won >= 10) +
    artForge(won >= 1, won >= 7) + artWell(won >= 2) + (won >= 9 ? ART_TABLE + ART_FLAGS : "") + (won >= 10 ? ART_READER : "");
}

const stones = c => `<rect y="164" width="400" height="46" fill="${c}"/><path d="M0 164l30-5 40 5 60-6 50 6 70-5 60 5 50-4 40 4z" fill="${c}"/>`;
const drips = c => `<path d="M0 0h400v14l-20 32-18-30-30 18-16-20-28 44-22-42-30 22-20-24-26 36-20-34-34 18-22-20-24 40-24-38-24 20-22-22-24 30z" fill="${c}"/>`;
const furrows = `<g fill="none" stroke="#5e4a2a" stroke-width="2"><path d="M0 178h400M0 192h400"/></g>`;
const trunks = c => `<path d="M40 164V0h26v164zM130 164V0h16v164zM250 164V0h22v164zM350 164V0h30v164z" fill="${c}"/>`;
const stars = `<g fill="#fff3c4"><circle cx="60" cy="24" r="1.6"/><circle cx="170" cy="46" r="1.2"/><circle cx="210" cy="16" r="1.6"/><circle cx="300" cy="40" r="1.2"/><circle cx="372" cy="20" r="1.6"/></g>`;
const planks = c => `<g stroke="${c}" stroke-width="2"><path d="M40 0v164M100 0v164M160 0v164M220 0v164M280 0v164M340 0v164"/></g>`;
const BACKS = {
  night: stars + `<circle cx="318" cy="46" r="20" fill="#f4e7c8"/>` + trunks("#141f33") + stones("#111a2c"),
  town: `<path d="M0 164V96l30-24 30 24v68zM70 164V80h60v84zM140 164V100l34-30 34 30v64zM218 164V84h56v84zM284 164V92l32-26 32 26v72zM356 164V82h44v82z" fill="#a39a8a"/><g fill="#efe7d4" stroke="#7a5230" stroke-width="2"><rect x="80" y="96" width="40" height="14"/><rect x="154" y="114" width="40" height="14"/><rect x="228" y="100" width="36" height="14"/><rect x="296" y="108" width="40" height="14"/></g>` + stones("#6f6a66"),
  sea: `<rect y="104" width="400" height="62" fill="#3b86ad"/><g fill="none" stroke="#bfe6f4" stroke-width="2.5" stroke-linecap="round"><path class="flame" d="M20 124q15-7 30 0t30 0M180 136q15-7 30 0t30 0M300 118q15-7 30 0t30 0"/></g>` + stones("#d9c48f"),
  house: planks("#00000040") + `<rect x="168" y="38" width="64" height="62" fill="#14101f"/><path d="M200 38v62M168 69h64" stroke="#3a2c44" stroke-width="4"/><circle cx="216" cy="56" r="7" fill="#f4e7c8"/>` + drips("#1c1620") + stones("#1c1620"),
  sack: `<g stroke="#00000022" stroke-width="2"><path d="M0 20h400M0 44h400M0 68h400M0 92h400M0 116h400M0 140h400M30 0v164M70 0v164M110 0v164M150 0v164M190 0v164M230 0v164M270 0v164M310 0v164M350 0v164"/></g><g fill="#f4e7c866" font-family="serif" font-weight="700" font-size="26"><text x="56" y="62">А</text><text x="150" y="40">Б</text><text x="238" y="74">В</text><text x="320" y="48">Г</text><text x="110" y="118">Д</text><text x="290" y="120">Е</text></g>` + stones("#4a3826"),
  field: `<path d="M0 140Q90 104 200 132T400 122v42H0z" fill="#b09a68"/>` + stones("#7a6238") + furrows,
  tower: `<g fill="none" stroke="#00000030" stroke-width="2"><path d="M0 40h400M0 80h400M0 120h400M50 0v40M170 0v40M290 0v40M110 40v40M230 40v40M350 40v40M50 80v40M170 80v40M290 80v40M110 120v44M230 120v44M350 120v44"/></g><path d="M186 92V44a14 14 0 0 1 28 0v48z" fill="#ffe9a8"/><path d="M0 164h120v-14h-30v-14h-30v-14h-30v-14H0z" fill="#44475a"/>` + stones("#3a3d48"),
  forest: trunks("#26382f") + drips("#1e3d2c") + `<rect y="136" width="400" height="30" fill="#dfe8e0" opacity=".2"/>` + stones("#24372c"),
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
