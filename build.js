// Збирає dist/index.html із src/template.html, src/*.js і текстів у levels/*.md.
// Запуск: node build.js  (без залежностей, потрібен лише Node.js)
// Формат текстів описано в AGENTS.md.

const fs = require("fs");
const path = require("path");
const { syllabifyText } = require("./src/syllables");

const ROOT = __dirname;
const VOWELS = /[аеєиіїоуюя]/gi;
const KINDS = { "вхід": "entry", "ворог": "enemy", "подія": "event", "бос": "boss" };
const FIELDS = {
  "вид": "kind", "значок": "icon", "сила": "hp", "фон": "bg", "декор": "deco", "місце": "at",
  "вступ": "intro", "мета": "goal", "кінець": "outro", "кіт": "cat", "руна": "rune",
};
const TOP_FIELDS = { "слово": "word", "місцина": "site", "початок": "start", "кіт": "cat", "фінал": "end", "далі": "next" };
const BACKGROUNDS = ["cave", "dark", "door", "web", "gate", "lair", "river", "ice"];
const MAX_JUMP = 3; // на скільки слів може вирости середня підказка між кімнатами
const problems = [];

function parseChapter(file) {
  const chapter = { n: "", R: [] };
  let room = null;
  fs.readFileSync(file, "utf8").split(/\r?\n/).forEach((raw, i) => {
    const line = raw.trim();
    const where = `${path.basename(file)}:${i + 1}`;
    if (!line) return;
    if (line.startsWith("## ")) {
      const m = line.slice(3).match(/^(.*?)\s*\{([^}]+)\}$/);
      if (!m) { problems.push(`${where}: кімнаті бракує {id}`); return; }
      room = { id: m[2].trim(), t: m[1].trim(), T: [], E: [], where };
      chapter.R.push(room);
      return;
    }
    if (line.startsWith("# ")) { chapter.n = line.slice(2).trim(); return; }
    const field = line.match(/^([^\s:|]+):\s*(.+)$/);
    if (!room) {
      if (field && TOP_FIELDS[field[1]]) chapter[TOP_FIELDS[field[1]]] = field[2];
      else problems.push(`${where}: незрозумілий рядок «${line}»`);
    } else if (field && field[1] === "шлях") {
      const [to, s] = field[2].split("|").map(x => x.trim());
      room.E.push({ to, s, where });
    } else if (field && field[1] === "записка") {
      const [id, text] = field[2].split("|").map(x => x.trim());
      room.note = { id, text };
    } else if (field && FIELDS[field[1]]) {
      room[FIELDS[field[1]]] = field[2];
    } else if (line.includes("|")) {
      // [n1] на початку: відповідь лежить у цій записці.
      // картка: «слово 🧀». Картинку гравець бачить лише після вибору.
      const [q0, ...cards] = line.split("|").map(s => s.trim());
      const tag = q0.match(/^\[([^\]]+)\]\s*(.*)$/);
      const parts = cards.map(c => c.match(/^(.*\p{L})\s+(\P{L}+)$/u));
      if (parts.some(p => !p)) problems.push(`${where}: кожній картці потрібна картинка`);
      room.T.push({ q: tag ? tag[2] : q0, note: tag ? tag[1] : undefined, c: parts.map(p => p && p[1]), p: parts.map(p => p && p[2]), where });
    } else {
      problems.push(`${where}: незрозумілий рядок «${line}»`);
    }
  });
  if (!chapter.n) problems.push(`${path.basename(file)}: бракує рядка "# Назва розділу"`);
  for (const f of Object.values(TOP_FIELDS)) if (!chapter[f]) problems.push(`${path.basename(file)}: бракує поля ${f}`);
  return chapter;
}

function checkText(text, where) {
  for (const word of syllabifyText(text).split(/\s+/)) {
    const clean = word.replace(/[.,!?:;"«»()…]/g, "");
    if (!clean) { problems.push(`${where}: окремий розділовий знак «${word}»`); continue; }
    if (/\d/.test(clean)) problems.push(`${where}: цифри в «${word}»`);
    if (!(clean.match(VOWELS) || []).length) continue; // прийменники в, з, й
    clean.split("-").forEach(p => {
      const v = (p.match(VOWELS) || []).length;
      if (v !== 1) problems.push(`${where}: склад «${p}» у слові «${word}» має ${v} голосних`);
    });
  }
}

function checkRoom(r) {
  const kind = KINDS[r.kind];
  if (!kind) problems.push(`${r.where}: невідомий вид «${r.kind}»`);
  r.kind = kind;
  const fights = kind === "enemy" || kind === "boss";
  const need = ["icon", "at", ...(kind === "entry" ? [] : ["bg", "deco", "intro", "outro"]), ...(fights ? ["hp", "goal"] : [])];
  for (const f of need) if (!r[f]) problems.push(`${r.where}: кімнаті «${r.t}» бракує поля ${f}`);
  if (r.bg && !BACKGROUNDS.includes(r.bg)) problems.push(`${r.where}: невідомий фон «${r.bg}»`);
  r.deco = (r.deco || "").split(/\s+/);
  r.at = (r.at || "0 0").split(/\s+/).map(Number);
  r.hp = +r.hp || 0;
  if (fights && r.T.length < r.hp + 2) problems.push(`${r.where}: завдань ${r.T.length}, треба щонайменше ${r.hp + 2}`);
  [r.intro, r.goal, r.outro, r.cat, r.note && r.note.text].filter(Boolean).forEach(t => checkText(t, r.where));
  r.E.forEach(e => checkText(e.s, e.where));
  r.T.forEach(t => {
    if (t.c.length !== 3) problems.push(`${t.where}: має бути три картки`);
    if (new Set(t.c).size !== t.c.length) problems.push(`${t.where}: картки повторюються`);
    checkText(t.q, t.where);
    t.c.filter(Boolean).forEach(c => checkText(c, t.where));
  });
}

// Усі кімнати досяжні, а бос можливий: руни складаються в слово, записки існують,
// і неправильна картка боса не збігається з правильною відповіддю із записок.
function checkDungeon(c) {
  const byId = new Map(c.R.map(r => [r.id, r]));
  c.R.forEach(r => r.E.forEach(e => { if (!byId.has(e.to)) problems.push(`${e.where}: немає кімнати «${e.to}»`); }));
  const seen = new Set(), todo = [c.R[0]];
  while (todo.length) {
    const r = todo.pop();
    if (!r || seen.has(r.id)) continue;
    seen.add(r.id);
    r.E.forEach(e => todo.push(byId.get(e.to)));
  }
  c.R.forEach(r => { if (!seen.has(r.id)) problems.push(`${r.where}: до кімнати «${r.t}» немає шляху`); });

  if (c.R[0].kind !== "entry") problems.push(`Розділ «${c.n}» має починатися входом`);
  const boss = c.R[c.R.length - 1];
  if (boss.kind !== "boss") { problems.push(`Розділ «${c.n}» має закінчуватися босом`); return; }
  const runes = c.R.filter(r => r.rune).map(r => r.rune).join("").toLowerCase();
  if (runes !== c.word) problems.push(`Руни складаються в «${runes}», а слово «${c.word}»`);
  const notes = new Set(c.R.filter(r => r.note).map(r => r.note.id));
  const rights = new Set(boss.T.map(t => t.c[0]));
  boss.T.forEach(t => {
    if (!notes.has(t.note)) problems.push(`${t.where}: немає записки «${t.note}»`);
    t.c.slice(1).forEach(w => { if (rights.has(w)) problems.push(`${t.where}: «${w}» — правильна відповідь іншого завдання`); });
  });
}

const fighting = rooms => rooms.filter(r => r.T.length);
const avgWords = r => r.T.reduce((a, t) => a + t.q.split(/\s+/).length, 0) / r.T.length;

function checkSteps(rooms) {
  rooms.forEach((r, i) => {
    if (i && avgWords(r) - avgWords(rooms[i - 1]) > MAX_JUMP) {
      problems.push(`${r.where}: стрибок складності, підказки ${avgWords(rooms[i - 1]).toFixed(1)} → ${avgWords(r).toFixed(1)} слів`);
    }
  });
}

const files = fs.readdirSync(path.join(ROOT, "levels"))
  .filter(f => f.endsWith(".md"))
  .sort((a, b) => parseInt(a) - parseInt(b) || a.localeCompare(b));
const chapters = files.map(f => parseChapter(path.join(ROOT, "levels", f)));

const ids = new Map();
chapters.forEach(c => {
  [c.start, c.cat, c.end, c.next].filter(Boolean).forEach(t => checkText(t, c.n));
  c.R.forEach(r => {
    checkRoom(r);
    if (ids.has(r.id)) problems.push(`${r.where}: id «${r.id}» вже є в ${ids.get(r.id)}`);
    ids.set(r.id, r.where);
  });
  checkDungeon(c);
  c.site = (c.site || "").split("|").map(s => s.trim());
  if (c.site.length !== 3) problems.push(`Розділ «${c.n}»: місцина має три значки: місце, без слова, зі словом`);
});
checkSteps(chapters.flatMap(c => fighting(c.R))); // складність росте й між данжами

if (problems.length) {
  console.error("Знайдено проблеми:\n- " + problems.join("\n- "));
  process.exit(1);
}

const data = chapters.map(({ n, word, site, start, cat, end, next, R }) => ({
  n, word, site, start, cat, end, next,
  R: R.map(({ where, E, T, ...r }) => ({
    ...r,
    E: E.map(({ to, s }) => ({ to, s })),
    T: T.map(({ q, note, c, p }) => ({ q, note, c, p })),
  })),
}));
const scripts = ["syllables", "game"]
  .map(f => fs.readFileSync(path.join(ROOT, "src", f + ".js"), "utf8"))
  .join("\n");
const js = `const CHAPTERS=${JSON.stringify(data).replace(/</g, "\\u003c")};\n${scripts}`;
const tpl = fs.readFileSync(path.join(ROOT, "src", "template.html"), "utf8");
if (!tpl.includes("/*SCRIPTS*/")) { console.error("У шаблоні немає /*SCRIPTS*/"); process.exit(1); }

fs.mkdirSync(path.join(ROOT, "dist"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "dist", "index.html"), tpl.replace("/*SCRIPTS*/", () => js));
const steps = chapters.flatMap(c => fighting(c.R).map(r => avgWords(r).toFixed(1))).join(" → ");
console.log(`Готово: ${data.length} данж(ів), кімнат: ${ids.size}. Слів у підказці: ${steps}`);
