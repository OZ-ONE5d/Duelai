const cardList = [
  "Dロータス",
  "ナイトメアスローン",
  "七精の解門",
  "ナイトメアペイン",
  "抹殺の指名者",
  "超融合",
  "Eternal Favorite",
  "ファントムオブユベル",
  "その他"
];

const PROB = {
  ash: 0.22,
  imperm: 0.22,
  droll: 0.12,
  nibiru: 0.12,
  none: 0.32
};

// UI生成
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

// メイン
function evaluateHand() {
  const checked = Array.from(document.querySelectorAll("input:checked"))
    .map(el => el.value);

  if (checked.length !== 5) {
    result.textContent = "5枚選んでください";
    route.textContent = "";
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

// ルート生成
function generateRoutes(hand) {
  let routes = [];

  const hasLotus = hand.includes("Dロータス");
  const hasThrone = hand.includes("ナイトメアスローン");
  const hasGate = hand.includes("七精の解門");

  if (hasLotus) {
    routes.push("【安全ルート】\nDロータス温存展開");
    routes.push("【最速ルート】\nDロータス即効果");
  }

  if (hasThrone) {
    routes.push("【スローンルート】\nスローン→ロータス");
  }

  if (hasGate) {
    routes.push("【解門ルート】\n解門→展開");
  }

  if (routes.length === 0) {
    routes.push("初動不可");
  }

  return routes;
}

// 期待値計算
function evaluateExpected(route, hand) {
  let totalExpand = 0;
  let totalDisrupt = 0;

  for (let key in PROB) {
    const prob = PROB[key];
    const state = evaluateStateWithCare(route, hand, key);

    totalExpand += state.expand * prob;
    totalDisrupt += state.disrupt * prob;
  }

  const total = Math.round(totalExpand * 0.6 + totalDisrupt * 0.4);

  return { expand: totalExpand, disrupt: totalDisrupt, total };
}

// ケア処理
function evaluateStateWithCare(route, hand, interruption) {
  const hasCrossout = hand.includes("抹殺の指名者");
  const hasPain = hand.includes("ナイトメアペイン");

  if (interruption === "ash" && hasCrossout) interruption = "none";
  if (interruption === "imperm" && hasPain) interruption = "none";

  return evaluateState(route, hand, interruption);
}

// 状態評価
function evaluateState(route, hand, interruption) {
  let expand = 0;
  let disrupt = 0;

  const hasLotus = hand.includes("Dロータス");
  const hasPain = hand.includes("ナイトメアペイン");

  // 展開
  if (hasLotus) expand += 35;
  if (hasPain) expand += 20;

  if (route.includes("安全")) expand += 20;
  else expand += 10;

  if (hasLotus && hasPain) expand += 20;

  // 誘発影響
  if (interruption === "ash") expand -= 25;
  if (interruption === "imperm") expand -= 20;
  if (interruption === "droll") expand -= 15;
  if (interruption === "nibiru") expand -= 30;

  // 妨害
  if (hand.includes("超融合")) disrupt += 40;
  if (hand.includes("Eternal Favorite")) disrupt += 30;
  if (hand.includes("ファントムオブユベル")) disrupt += 30;

  expand = Math.max(0, Math.min(100, expand));
  disrupt = Math.min(100, disrupt);

  return { expand, disrupt };
}
