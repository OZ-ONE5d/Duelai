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

const enemyList = ["なし","うらら","泡影","ドロバ","ニビル"];

// ===== UI生成 =====
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
  const radio = document.createElement("input");
  radio.type = "radio";
  radio.name = "enemy";
  radio.value = card;
  if(card==="なし") radio.checked = true;
  label.appendChild(radio);
  label.appendChild(document.createTextNode(card));
  enemyDiv.appendChild(label);
  enemyDiv.appendChild(document.createElement("br"));
});

// ===== メイン =====
function evaluateHand() {

  const hand = Array.from(document.querySelectorAll("#cards input:checked"))
    .map(el => el.value);

  const enemy = document.querySelector("input[name='enemy']:checked").value;

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

// ===== 展開ルート =====
function generateRoute(hand, enemy) {

  let log = "";

  const hasLotus = hand.includes("Dロータス");
  const hasThrone = hand.includes("ナイトメアスローン");
  const hasGate = hand.includes("七精の解門");
  const hasPain = hand.includes("ナイトメアペイン");

  let monsterCount = 0;
  let monsters = [];

  log += "【展開開始】\n";

  // スローン
  if (hasThrone) {
    log += "① ナイトメアスローン発動 → Dロータスサーチ\n";
  }

  // 解門
  if (hasGate) {
    log += "② 七精の解門発動\n";
    log += "　・墓地から永続魔法回収\n";
    log += "　・手札1枚捨て → Dロータス特殊召喚\n";
    monsterCount++;
    monsters.push("Dロータス");
  }

  // 通常召喚
  if (hasLotus && monsterCount === 0) {
    log += "③ Dロータス通常召喚\n";
    monsterCount++;
    monsters.push("Dロータス");
  }

  // 誘発処理
  if (enemy === "うらら") {
    log += "→ うらら発動：展開停止\n";
    return log;
  }

  // 展開
  log += "④ Dロータス効果 → スピリットオブユベル特殊召喚\n";
  monsterCount++;
  monsters.push("スピリット");

  // 泡影
  if (enemy === "泡影" && !hasPain) {
    log += "→ 泡影で無効：展開弱体\n";
  }

  // サーチ
  log += "⑤ スピリット効果 → ナイトメアペイン or Eternal Favoriteサーチ\n";

  log += "⑥ ナイトメアペイン発動\n";

  // ユベル展開
  log += "⑦ スピリット破壊 → ユベル特殊召喚\n";
  monsters.push("ユベル");

  log += "⑧ ユベルが破壊される → ユベルを特殊召喚\n";

  // ニビル
  if (enemy === "ニビル") {
    log += "→ ニビル発動：盤面リセット\n";
    return log;
  }

  // ターンエンド
  log += "\n【ターンエンド】\n";

  // 最終盤面
  log += "\n【最終盤面】\n";
  log += "モンスター数：" + monsters.length + "\n";
  log += "モンスター：" + monsters.join(", ") + "\n";

  log += "魔法：ナイトメアペイン\n";

  if (hand.includes("超融合")) {
    log += "伏せ：超融合\n";
  }

  if (hand.includes("Eternal Favorite")) {
    log += "伏せ：Eternal Favorite\n";
  }

  return log;
}

// ===== 評価 =====
function evaluateState(hand, enemy) {

  let expand = 70;
  let disrupt = 0;

  if (enemy === "うらら") expand -= 40;
  if (enemy === "泡影") expand -= 20;
  if (enemy === "ドロバ") expand -= 15;
  if (enemy === "ニビル") expand -= 50;

  if (hand.includes("超融合")) disrupt += 40;
  if (hand.includes("Eternal Favorite")) disrupt += 30;

  expand = Math.max(0, expand);

  const total = Math.round(expand * 0.6 + disrupt * 0.4);

  return { expand, disrupt, total };
}
