// Запуск: node test.js  (без залежностей)
const assert = require("assert");

// Шанс здолати боса: потрібно hits влучань раніше, ніж закінчаться lives життів.
function winChance(p, hits, lives, runs = 200000) {
  let wins = 0;
  for (let r = 0; r < runs; r++) {
    let h = hits, l = lives;
    while (h && l) Math.random() < p ? h-- : l--;
    if (!h) wins++;
  }
  return wins / runs;
}
const guess = winChance(1 / 3, 5, 3), reader = winChance(.7, 5, 3), good = winChance(.9, 5, 3);
console.log(`Бос: навмання ${(guess * 100).toFixed(1)}%, читає 70% ${(reader * 100).toFixed(1)}%, читає 90% ${(good * 100).toFixed(1)}%`);
assert(guess < .07, "вгадування не має перемагати боса");
assert(reader > .55, "упевнений читач перемагає за кілька спроб");
assert(good > .95);

console.log("Усі перевірки пройдено.");
