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

// ===== 確率 =====
const PROB = {
  ash: 0.22,
  imperm: 0.22,
  droll: 0.12,
  nibiru: 0.12,
  none: 0.32
};

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

// ===== メイン =====
function evaluateHand() {

  const checked = Array.from(document.querySelectorAll("input:checked"))
    .map(el => el.value);

  if (checked.length === 0) {
    result.textContent = "カードを選択してください";
    return;
  }

  const routes = generateRoutes(checked);

  let best = null;
  let bestScore = -1;

  routes.forEach(r => {
    const expected = evaluateExpected(r, checked);

    if (expected.total > bestScore) {
      bestScore = expected.total;
      best = { route: r, ...expected };
    }
  });

  result.textContent =
    "展開(期待値): " + Math.round(best.expand) + "\n" +
    "妨害: " + Math.round(best.disrupt) + "\n" +
    "総合: " + best.total;

  route.textContent = best.route;
}

// ===== 展開ルート（詳細）=====
function generateRoutes(hand) {

  let routes = [];

  const hasLotus = hand.includes("Dロータス");
  const hasThrone = hand.includes("ナイトメアスローン");
  const hasGate = hand.includes("七精の解門");
  const hasPain = hand.includes("ナイトメアペイン");

  if (hasLotus || hasThrone || hasGate) {

    let route = "【詳細展開ルート】\n";

    // サーチ
    if (hasThrone) {
      route += "① ナイトメアスローン発動 → Dロータスをサーチ\n";
    }

    if (hasGate) {
      route += "② 七精の解門発動 → Dロータスを回収\n";
    }

    // 通常召喚
    route += "③ Dロータスを通常召喚\n";

    // 展開
    route += "④ Dロータス効果 → スピリットオブユベルを特殊召喚\n";

    // サーチ
    if (!hasPain) {
      route += "⑤ スピリット効果 → ナイトメアペインをサーチ\n";
    } else {
      route += "⑤ ナイトメアペインは既に手札\n";
    }

    route += "⑥ ナイトメアペイン発動\n";

    // ===== 破壊進化 =====
    route += "\n--- ユベル進化 ---\n";
    route += "⑦ スピリット破壊 → ユベル特殊召喚\n";
    route += "⑧ ユベル破壊 → ユベルDas Abscheulich Ritter特殊召喚\n";
    route += "⑨ Ritterが場を離れる → ユベルDas Extremes Traurig Drachma特殊召喚\n";

    // ===== 最終盤面 =====
    route += "\n--- 最終盤面 ---\n";
    route += "・ユベル系モンスターが場に存在\n";

    if (hand.includes("超融合")) {
      route += "・超融合セット（チェーン不可妨害）\n";
    }

    if (hand.includes("Eternal Favorite")) {
      route += "・Eternal Favorite構え\n";
    }

    routes.push(route);
  }

  if (routes.length === 0) {
    routes.push("初動不可（展開カードなし）");
  }

  return routes;
}

// ===== 期待値 =====
function evaluateExpected(route, hand) {

  let totalExpand = 0;
  let totalDisrupt = 0;

  for (let key in PROB) {
    const prob = PROB[key];
    const state = evaluateState(route, hand, key);

    totalExpand += state.expand * prob;
    totalDisrupt += state.disrupt * prob;
  }

  const total = Math.round(totalExpand * 0.6 + totalDisrupt * 0.4);

  return { expand: totalExpand, disrupt: totalDisrupt, total };
}

// ===== 状態評価 =====
function evaluateState(route, hand, interruption) {

  let expand = 0;
  let disrupt = 0;

  const hasLotus = hand.includes("Dロータス");
  const hasPain = hand.includes("ナイトメアペイン");

  if (hasLotus) expand += 35;
  if (hasPain) expand += 20;
  if (hasLotus && hasPain) expand += 20;

  // 誘発影響
  if (interruption === "ash") expand -= 25;
  if (interruption === "imperm") expand -= 20;
  if (interruption === "droll") expand -= 15;
  if (interruption === "nibiru") expand -= 30;

  // 妨害
  if (hand.includes("超融合")) disrupt += 40;
  if (hand.includes("Eternal Favorite")) disrupt += 30;

  expand = Math.max(0, Math.min(100, expand));
  disrupt = Math.min(100, disrupt);

  return { expand, disrupt };
}
