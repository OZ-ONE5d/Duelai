const cardList = [
  "Dロータス",
  "ナイトメアスローン",
  "七精の解門",
  "ナイトメアペイン",
  "抹殺の指名者",
  "超融合",
  "Eternal Favorite",
  "スピリットオブユベル",
  "ユベル",
  "その他"
];

const enemyList = ["うらら","泡影","ドロバ","ニビル"];

// ===== UI =====
const container = document.getElementById("cards");
cardList.forEach(card => {
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = card;
  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(card));
  container.appendChild(label);
  container.appendChild(document.createElement("br"));
});

const enemyDiv = document.getElementById("enemy");
enemyList.forEach(card => {
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = card;
  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(card));
  enemyDiv.appendChild(label);
  enemyDiv.appendChild(document.createElement("br"));
});

// ===== メイン =====
function evaluateHand() {

  const hand = Array.from(document.querySelectorAll("#cards input:checked"))
    .map(el => el.value);

  const enemy = Array.from(document.querySelectorAll("#enemy input:checked"))
    .map(el => el.value);

  if (hand.length === 0) {
    result.textContent = "手札を選択してください";
    return;
  }

  const route = generateRoute(hand, enemy);
  const score = evaluateState(hand, enemy);

  result.textContent =
    "展開: " + score.expand + "\n" +
    "妨害: " + score.disrupt + "\n" +
    "総合: " + score.total;

  document.getElementById("route").textContent = route;
}

// ===== 展開 =====
function generateRoute(hand, enemy) {

  let log = "【展開開始】\n";

  let monsters = [];
  let field = [];
  let grave = [];

  const hasPain = hand.includes("ナイトメアペイン");

  // スローン
  if (hand.includes("ナイトメアスローン")) {
    log += "① スローン → Dロータスサーチ\n";
    if (!hand.includes("Dロータス")) hand.push("Dロータス");
  }

  // 解門
  if (hand.includes("七精の解門")) {
    log += "② 解門発動\n";
    log += "　墓地魔法回収 + 手札1枚捨て\n";
    log += "　Dロータス特殊召喚\n";
    monsters.push("Dロータス");
  }

  // 通常召喚
  if (hand.includes("Dロータス") && !monsters.includes("Dロータス")) {
    log += "③ Dロータス通常召喚\n";
    monsters.push("Dロータス");
  }

  // うらら
  if (enemy.includes("うらら")) {
    log += "→ うらら：効果無効\n";
  } else {
    log += "④ Dロータス → スピリット特殊召喚\n";
    monsters.push("スピリット");
  }

  // 泡影
  if (enemy.includes("泡影") && !hasPain) {
    log += "→ 泡影：スピリット無効\n";
  }

  // サーチ
  if (!hasPain) {
    log += "⑤ スピリット → ナイトメアペインサーチ\n";
    hand.push("ナイトメアペイン");
  } else {
    log += "⑤ ナイトメアペインあり → Eternal Favoriteサーチ\n";
    if (!hand.includes("Eternal Favorite")) hand.push("Eternal Favorite");
  }

  // ペイン
  log += "⑥ ナイトメアペイン発動\n";

  // ペイン効果
  log += "⑦ ペイン破壊効果発動\n";
  if (!hand.includes("Eternal Favorite")) {
    log += "　→ Eternal Favoriteサーチ\n";
    hand.push("Eternal Favorite");
  }

  // ユベル展開
  log += "⑧ スピリット破壊 → ユベル特殊召喚\n";
  monsters.push("ユベル");

  log += "⑨ ユベル破壊 → ユベル特殊召喚\n";

  // ニビル
  if (enemy.includes("ニビル")) {
    log += "→ ニビル：盤面リセット\n";
    monsters = ["トークン"];
  }

  // エンド
  log += "\n【エンドフェイズ】\n";

  if (monsters.includes("ユベル")) {
    log += "ユベル効果 → モンスター1体リリース\n";
  }

  log += "墓地からDロータス特殊召喚\n";
  monsters.push("Dロータス");

  // 最終盤面
  log += "\n【最終盤面】\n";
  log += "モンスター：" + monsters.join(", ") + "\n";
  log += "魔法：ナイトメアペイン\n";

  if (hand.includes("超融合")) log += "伏せ：超融合\n";
  if (hand.includes("Eternal Favorite")) log += "伏せ：Eternal Favorite\n";

  return log;
}

// ===== 評価 =====
function evaluateState(hand, enemy) {

  let expand = 80;
  let disrupt = 0;

  if (enemy.includes("うらら")) expand -= 30;
  if (enemy.includes("泡影")) expand -= 20;
  if (enemy.includes("ドロバ")) expand -= 15;
  if (enemy.includes("ニビル")) expand -= 50;

  if (hand.includes("超融合")) disrupt += 40;
  if (hand.includes("Eternal Favorite")) disrupt += 30;

  expand = Math.max(0, expand);

  const total = Math.round(expand * 0.6 + disrupt * 0.4);

  return { expand, disrupt, total };
}
