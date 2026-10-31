// Гра: село → мапа данжу → кімнати → брама з рунами → бос → село оживає.
let DUNGEON, ROOMS, BOSS, RUNES, allNotes;
function useDungeon(i) {
  DUNGEON = CHAPTERS[i];
  ROOMS = DUNGEON.R;
  BOSS = ROOMS[ROOMS.length - 1];
  RUNES = ROOMS.filter(r => r.rune).length;
  allNotes = ROOMS.filter(r => r.note).length;
}
const roomById = id => ROOMS.find(r => r.id === id);
const BASE_LIVES = 3, BASE_SPARKS = 3, CHEST_XP = 5;
// Рівні героя: досвід, новий предмет і що він дає.
const RANKS = [
  { xp: 0, item: "", name: "" },
  { xp: 8, item: "🛡️", name: "Щит: ще одне життя в кожному бою." },
  { xp: 18, item: "🏮", name: "Ліхтар: ще дві іскри в кожному бою." },
  { xp: 30, item: "🗡️", name: "Меч: перший удар у бою б'є двічі." },
];
const $ = id => document.getElementById(id);

// Озвучка слова
let ukVoice = null;
function pickVoice() { ukVoice = speechSynthesis.getVoices().find(v => v.lang && v.lang.toLowerCase().startsWith("uk")) || null; }
if ("speechSynthesis" in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function speak(t) {
  if (!ukVoice) return;
  const u = new SpeechSynthesisUtterance(t);
  u.lang = "uk-UA"; u.voice = ukVoice; u.rate = .8;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

const newRun = () => ({ cleared: [ROOMS[0].id], runes: [], notes: [] });
let store = {};
try { store = JSON.parse(localStorage.getItem("slovo-mech") || "{}"); } catch (e) {}
store = { xp: 0, wins: 0, ...store };
if (store.won === undefined) store.won = store.wins > 0 ? 1 : 0; // скільки данжів пройдено
store.dng = Math.min(store.dng === undefined ? store.won : store.dng, CHAPTERS.length - 1);
useDungeon(store.dng);
if (store.v !== 3) { store.opt = { syl: false }; store.v = 3; } // склади стали необов'язковими
if (!store.run || store.run.cleared[0] !== ROOMS[0].id) store.run = newRun();
const save = () => { try { localStorage.setItem("slovo-mech", JSON.stringify(store)); } catch (e) {} };

const rank = () => RANKS.filter(r => store.xp >= r.xp).length;
const lives0 = () => BASE_LIVES + (rank() >= 2 ? 1 : 0);
const sparks0 = () => BASE_SPARKS + (rank() >= 3 ? 2 : 0);
const cleared = id => store.run.cleared.includes(id);
const notes = () => ROOMS.filter(r => r.note && store.run.notes.includes(r.note.id)).map(r => r.note);

// Текст чистий, поділ на склади вже в розмітці й показується за дотиком до слова.
const esc = c => c.replace(/&/g, "&amp;").replace(/</g, "&lt;");
function textHtml(text, tap) {
  return syllabifyText(text).split(/\s+/).map(tok => {
    const inner = tok.split("-").map(esc).join('<span class="sep">-</span>');
    const word = tok.replace(/-/g, "").replace(/[.,!?:«»]/g, "");
    return tap ? `<span class="w tap" data-say="${word}" tabindex="0">${inner}</span>` : `<span class="w">${inner}</span>`;
  }).join(" ");
}
const para = text => `<p class="txt">${textHtml(text, true)}</p>`;
// Картки й таблички самі натискаються, тому склади на них показує одна спільна кнопка.
const splitBtn = () => store.opt.syl ? "" : `<button class="alt" id="split">🔍 Показати склади</button>`;
const catLine = text => `<div class="cat"><span class="catpic">${ART_CAT}</span><div class="bubble">${para(text)}</div></div>`;

function renderHero() {
  const r = rank(), next = RANKS[r];
  const items = RANKS.slice(1, r).map(x => x.item).join("");
  $("hero").innerHTML = `<span class="gear">${items}</span><span>Рівень ${r}</span>` +
    (next ? `<span class="xp">${store.xp}/${next.xp}</span>` : "") + (store.wins ? `<span>🏆 ${store.wins}</span>` : "");
}

function applyOpts() {
  $("optSyl").checked = store.opt.syl;
  document.body.classList.toggle("syl", store.opt.syl);
}
$("optSyl").onchange = e => { store.opt.syl = e.target.checked; save(); applyOpts(); };

const DECO_SPOTS = ["34%", "46%", "58%"]; // декор стоїть на землі між героєм і ворогом
const gearLine = () => RANKS.slice(1, rank()).map(r => r.item).join("");

// Сцена: герой із котом ліворуч, ворог праворуч.
function sceneHtml(room, foe) {
  return `<div class="scene bg-${room.bg}" id="scene">
    ${artBack(room.bg)}
    ${room.deco.map((d, i) => `<span class="deco" style="left:${DECO_SPOTS[i % 3]}" aria-hidden="true">${d}</span>`).join("")}
    <span class="gearline" aria-hidden="true">${gearLine()}</span>
    <div class="actor me" id="me">${ART_HERO}</div>
    <div class="actor buddy">${ART_CAT}</div>
    ${foe ? `<div class="actor foe" id="pic">${room.icon}</div>` : ""}
    ${room.t ? `<div class="foeinfo">${room.t}<span class="pips" id="pips"></span></div>` : ""}
  </div>`;
}

const pipsText = () => "🟥".repeat(Math.max(F.hp, 0)) + "⬜".repeat(F.room.hp - Math.max(F.hp, 0));
const livesText = () => "❤️".repeat(F.lives) + "🖤".repeat(F.maxLives - F.lives);

const MOVCHUN = "Мовчун високий і темний. Він носить довгий плащ і великий мішок. У мішку сидять украдені слова. У Мовчуна немає рота, тому він не вміє говорити. Він заздрить усім, хто читає.";

// Село: тут видно все, що повернули данжі.
function villageScene() {
  return `<div class="scene bg-village">${artVillage(store.won)}
    <div class="actor me">${ART_HERO}</div><div class="actor buddy">${ART_CAT}</div></div>`;
}

function pickDungeon(i) {
  store.dng = i;
  useDungeon(i);
  store.run = newRun();
  store.fin = undefined;
  save();
  showMap();
}

function showVillage() {
  const done = store.fin === undefined ? null : CHAPTERS[store.fin];
  const allDone = store.won >= CHAPTERS.length, begun = store.run.cleared.length > 1;
  const again = allDone && !begun;
  const buttons = again
    ? CHAPTERS.map((c, i) => `<button class="big" data-d="${i}">Ще раз: ${c.n}</button>`).join("")
    : done ? `<button class="big" id="go">Далі</button>`
    : `<button class="big" id="go">${begun ? "Далі в печеру" : "У печеру"}</button>`;
  $("screen").innerHTML = `<div class="panel center">${villageScene()}
    ${para(done ? `${done.end} ${done.next}` : allDone ? CHAPTERS[CHAPTERS.length - 1].next : DUNGEON.start)}
    ${done || allDone ? "" : catLine(DUNGEON.cat)}
    ${buttons}<button class="alt" id="who">Хто такий Мовчун?</button></div>`;
  document.querySelectorAll("[data-d]").forEach(b => { b.onclick = () => pickDungeon(+b.dataset.d); });
  $("who").onclick = () => result(ART_MOVCHUN, para(MOVCHUN), "До села", showVillage);
  if ($("go")) $("go").onclick = () => {
    if (done) { store.fin = undefined; save(); showVillage(); } else showMap();
  };
  renderHero();
}

// Мапа: відкрито лише те, куди вже веде стежка. Брама боса видна завжди.
function exits() {
  const seen = new Set();
  return ROOMS.filter(r => cleared(r.id)).flatMap(r => r.E)
    .filter(e => !cleared(e.to) && !seen.has(e.to) && seen.add(e.to));
}
const unlocked = () => store.run.runes.length >= RUNES;

// Поля, щоб вузли біля краю мапи не обрізалися.
const mapX = v => 10 + v * .8, mapY = v => 12 + v * .76;

function mapHtml() {
  const open = new Set(exits().map(e => e.to));
  const lines = ROOMS.flatMap(a => a.E.map(e => {
    const b = roomById(e.to);
    if (!cleared(a.id)) return "";
    return `<line x1="${mapX(a.at[0])}" y1="${mapY(a.at[1])}" x2="${mapX(b.at[0])}" y2="${mapY(b.at[1])}" class="${cleared(b.id) ? "walked" : "ahead"}"/>`;
  })).join("");
  const nodes = ROOMS.map(r => {
    const state = cleared(r.id) ? "done" : open.has(r.id) ? "open" : r === BOSS ? "gate" : "fog";
    const pic = state === "fog" ? "☁️" : state === "open" ? (r === BOSS ? "🚪" : "❓") : state === "gate" ? "🔒" : r.icon;
    return `<div class="node ${state}" style="left:${mapX(r.at[0])}%;top:${mapY(r.at[1])}%" data-id="${r.id}">${pic}</div>`;
  }).join("");
  return `<div class="map" role="img" aria-label="Мапа данжу"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>${nodes}</div>`;
}

function runesHtml() {
  const got = ROOMS.filter(r => r.rune).map(r => store.run.runes.includes(r.rune) ? r.rune : "");
  return `<div class="runes" aria-label="Руни">${got.map(g => `<span class="rune ${g ? "got" : ""}">${g || "?"}</span>`).join("")}</div>`;
}

function showMap() {
  const list = exits().map(e => {
    const room = roomById(e.to), shut = room === BOSS && !unlocked();
    return `<button class="sign" data-to="${e.to}" ${shut ? "disabled" : ""}>${shut ? "🔒 " : "➜ "}<span class="txt">${textHtml(e.s)}</span></button>`;
  }).join("");
  $("screen").innerHTML = `<div class="panel">
    <h2 class="dungeon">${DUNGEON.n}</h2>
    ${mapHtml()}
    <div class="toolbar">${runesHtml()}<button class="alt" id="pocket">🎒 Кишеня: ${notes().length} / ${allNotes}</button></div>
    ${exits().some(e => roomById(e.to) === BOSS) && !unlocked() ? `<p class="sub">Брама просить три руни.</p>` : ""}
    <div class="signs">${list}</div>
    <div class="controls">${splitBtn()}<button class="alt" id="home">← До села</button></div></div>`;
  document.querySelectorAll(".sign").forEach(b => { b.onclick = () => enterRoom(b.dataset.to); });
  $("pocket").onclick = openPocket;
  $("home").onclick = showVillage;
  renderHero();
}

// Кишеня: усе знайдене лишається, перечитати можна будь-коли.
function pocketHtml() {
  const list = notes();
  return list.length
    ? `<ul class="notes">${list.map(n => `<li>📜 ${para(n.text)}</li>`).join("")}</ul>`
    : `<p class="sub">Поки що порожньо.</p>`;
}
function openPocket() {
  const box = document.createElement("div");
  box.className = "overlay";
  box.innerHTML = `<div class="panel" role="dialog" aria-label="Кишеня"><h2 class="dungeon">🎒 Кишеня</h2>
    ${runesHtml()}${pocketHtml()}<button class="big" id="closeP">Закрити</button></div>`;
  document.body.append(box);
  $("closeP").onclick = () => box.remove();
}

function enterRoom(id) {
  const room = roomById(id);
  const full = "❤️".repeat(lives0());
  const fights = room.T.length > 0;
  $("screen").innerHTML = `<div class="panel center">
    ${sceneHtml(room, true)}${para(room.intro)}
    ${fights ? `<p class="sub">${full} Життя на цей бій. У новій кімнаті вони знову повні.</p>` : ""}
    <button class="big" id="go">${fights ? "Почати" : "Підійти"}</button></div>`;
  $("go").onclick = () => (fights ? startFight(room) : roomDone(room));
  renderHero();
}

// Бій
let F = null; // стан бою: room, hp, lives, maxLives, sparks, bag, task, cards, right, busy, hinted, boosted
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function startFight(room) {
  F = { room, lives: lives0(), maxLives: lives0(), sparks: sparks0(), bag: [], boosted: rank() >= 4 };
  F.hp = room.hp;
  nextTask();
}

// Щоразу нове завдання: помилка не лишає той самий вибір із меншою кількістю карток.
function nextTask() {
  if (!F.bag.length) {
    F.bag = shuffle(F.room.T);
    if (F.bag[0] === F.task && F.bag.length > 1) F.bag.push(F.bag.shift());
  }
  F.task = F.bag.shift();
  F.cards = shuffle(F.task.c);
  F.right = F.cards.indexOf(F.task.c[0]);
  F.hinted = false;
  F.busy = false;
  renderFight();
}

function renderFight() {
  const voice = !!ukVoice, boss = F.room === BOSS;
  $("screen").innerHTML = `<div class="panel" id="fight">
    ${sceneHtml(F.room, true)}
    ${para(F.task.q)}
    ${boss ? `<div class="pocketbox"><b>🎒 Записки</b>${pocketHtml()}</div>` : ""}
    <div class="goal">${para(F.room.goal)}</div>
    <div class="cards">${F.cards.map((c, i) => {
      return `<div class="holder"><button class="spell" data-i="${i}"><span class="txt">${textHtml(c)}</span></button><button class="say" data-say="${c}" aria-label="Озвучити за іскру" ${store.opt.syl && voice ? "" : "hidden"}>🔊</button></div>`;
    }).join("")}</div>
    <p id="msg" class="sub">Важке слово? Натисни на нього.</p>
    <div class="stats">
      <span class="stat">Життя <b id="lives">${livesText()}</b></span>
      ${voice ? `<span class="stat">Іскрик шепоче 🔊 <b id="sparks">${"✨".repeat(F.sparks) || "—"}</b></span>` : ""}
    </div>
    <div class="controls">
      ${splitBtn()}
      ${boss ? "" : `<button class="alt" id="pocket">🎒 Кишеня</button>`}
      <button class="alt" id="leave">← До мапи</button>
    </div></div>`;
  $("pips").textContent = pipsText();
  document.querySelectorAll("button.spell").forEach(b => { b.onclick = () => cast(+b.dataset.i); });
  if (!boss) $("pocket").onclick = openPocket;
  $("leave").onclick = () => { F = null; showMap(); };
  renderHero();
}

// Озвучка: у бою коштує іскру, поза боєм безплатна.
function hint(word) {
  if (!ukVoice) return;
  if (!F) { speak(word); return; }
  if (F.busy || !F.sparks) return;
  F.sparks--;
  F.hinted = true;
  speak(word);
  $("sparks").textContent = "✨".repeat(F.sparks) || "—";
  document.querySelectorAll(".say").forEach(b => { b.disabled = !F.sparks; });
}

// Перша допомога — склади, безплатно. Друга — озвучка.
function tapWord(w) {
  if (store.opt.syl || w.classList.contains("split")) hint(w.dataset.say);
  else w.classList.add("split");
}
function splitAll(btn) {
  document.querySelectorAll(".spell .w, .sign .w").forEach(w => w.classList.add("split"));
  document.querySelectorAll(".say").forEach(b => { b.hidden = !ukVoice; b.disabled = !!F && !F.sparks; });
  btn.remove();
}
document.addEventListener("click", e => {
  const say = e.target.closest(".say"), word = e.target.closest(".w.tap");
  if (e.target.closest("#split")) splitAll($("split"));
  else if (say) hint(say.dataset.say);
  else if (word) tapWord(word);
});
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.matches(".w.tap")) tapWord(e.target);
});

// Слово оживає: його картинка летить у ворога.
function fx(cls, pic) {
  const s = document.createElement("span");
  s.className = cls;
  s.textContent = pic;
  s.setAttribute("aria-hidden", "true");
  $("scene").append(s);
}

function cast(i) {
  if (!F || F.busy) return;
  F.busy = true;
  const fight = F, good = i === F.right;
  const pic = F.task.p[F.task.c.indexOf(F.cards[i])];
  const later = (ms, fn) => setTimeout(() => { if (F === fight) fn(); }, ms);
  document.querySelector(`.spell[data-i="${i}"]`).classList.add(good ? "ok" : "no");
  document.querySelectorAll("button.spell").forEach(b => { b.disabled = true; });
  fx("shot " + (good ? "hit" : "miss"), pic);
  if (good) {
    F.hp -= F.boosted ? Math.min(2, F.hp) : 1;
    F.boosted = false;
    if (!F.hinted) store.xp++;
    save();
    $("msg").textContent = "Влучно!";
    later(420, () => { fx("boom onfoe", "💥"); $("pic").classList.add("shake"); $("pips").textContent = pipsText(); });
    later(1200, () => { F.hp <= 0 ? foeGone() : nextTask(); });
  } else {
    F.lives--;
    $("msg").textContent = "Не те слово! Ворог б'є!";
    later(700, () => { $("pic").classList.add("lunge"); });
    later(950, () => { fx("boom onme", "💢"); $("me").classList.add("shake"); $("lives").textContent = livesText(); });
    later(1700, () => { F.lives <= 0 ? roomLost() : nextTask(); });
  }
  renderHero();
}

function foeGone() {
  $("pic").classList.add("flee");
  const room = F.room;
  setTimeout(() => { F = null; room === BOSS ? bossWon() : roomDone(room); }, 700);
}

function confetti() {
  const box = document.createElement("div");
  box.className = "confetti";
  box.setAttribute("aria-hidden", "true");
  box.innerHTML = Array.from({ length: 24 }, (_, i) =>
    `<span style="left:${Math.random() * 100}%;animation-delay:${Math.random() * .8}s">${["🪙", "⭐", "✨", "💎"][i % 4]}</span>`).join("");
  document.body.append(box);
  setTimeout(() => box.remove(), 3500);
}

function result(icon, body, label, next) {
  $("screen").innerHTML = `<div class="panel center"><div class="big-pic pop">${icon}</div>${body}<button class="big" id="go">${label}</button></div>`;
  $("go").onclick = next;
  renderHero();
}

// Кімнату пройдено: знахідки лягають у кишеню одразу.
function roomDone(room) {
  const run = store.run;
  if (!cleared(room.id)) run.cleared.push(room.id);
  if (room.rune && !run.runes.includes(room.rune)) run.runes.push(room.rune);
  if (room.note && !run.notes.includes(room.note.id)) run.notes.push(room.note.id);
  save();
  const finds = [
    room.rune ? `<div class="find">Руна ${runesHtml()}</div>` : "",
    room.note ? `<div class="find">📜 Записка в кишені${para(room.note.text)}</div>` : "",
  ].join("");
  if (finds) confetti();
  result(room.note || room.rune ? "🎁" : "🎉", para(room.outro) + finds + (room.cat ? catLine(room.cat) : ""), "До мапи", showMap);
}

const newItem = before => {
  const r = rank();
  return r > before ? `<p class="reward">Новий рівень! ${RANKS[r - 1].item} ${RANKS[r - 1].name}</p>` : "";
};

function bossWon() {
  const before = rank();
  const body = `${para(BOSS.outro)}<p class="word">${DUNGEON.word}</p>`, icon = DUNGEON.site[2];
  store.xp += CHEST_XP;
  store.wins++;
  store.fin = CHAPTERS.indexOf(DUNGEON);
  store.won = Math.max(store.won, store.fin + 1);
  store.dng = Math.min(store.won, CHAPTERS.length - 1);
  useDungeon(store.dng);
  store.run = newRun();
  save();
  confetti();
  result(icon, body + newItem(before), "До села", showVillage);
}

// Програш нічого не забирає: знахідки й досвід лишаються.
function roomLost() {
  F = null;
  result("🛡️", para("Життя закінчилися. Руни й записки лишаються."), "До мапи", showMap);
}

$("reset").onclick = () => {
  if (!confirm("Стерти весь прогрес і почати спочатку?")) return;
  try { localStorage.removeItem("slovo-mech"); } catch (e) {}
  location.reload();
};

applyOpts();
showVillage();
