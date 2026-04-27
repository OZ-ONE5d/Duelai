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

// ===== ルート生成（詳細版）=====
function generateRoutes(hand) {

  let routes = [];

  const hasLotus = hand.includes("Dロータス");
  const hasThrone = hand.includes("ナイトメアスローン");
  const hasGate = hand.includes("七精の解門");
  const hasPain = hand.includes("ナイトメアペイン");

  // ===== メイン展開 =====
  if (hasLotus || hasThrone || hasGate) {

    let route = "【基本展開ルート】\n";

    // サーチ
    if (hasThrone) {
      route += "① ナイトメアスローン発動 → Dロータスサーチ\n";
    }

    if (hasGate) {
      route += "② 七精の解門発動 → Dロータス回収\n";
    }

    // 召喚
    route += "③ Dロータス召喚\n";

    // 展開
    route += "④ Dロータス効果 → スピリット・オブ・ユベル特殊召喚\n";

    // サーチ
    if (!hasPain) {
      route += "⑤ スピリット効果 → ナイトメアペインサーチ\n";
    } else {
      route += "⑤ ナイトメアペイン既に所持\n";
    }

    route += "⑥ ナイトメアペイン発動\n";

    // ===== 破壊ループ =====
    route += "\n--- 破壊ループ ---\n";
    route += "⑦ スピリット破壊 → ユベル特殊召喚\n";
    route += "⑧ ユベル破壊 → ユベルDas Abscheulich Ritter特殊召喚\n";
    route += "⑨ Ritter離脱 → ユベルDas Extremes Traurig Drachma特殊召喚\n";

    // ===== 最終盤面 =====
    route += "\n--- 最終盤面 ---\n";
    route += "・ユベル系モンスター\n";

    if (hand.includes("超融合")) {
      route += "・超融合セット（妨害）\n";
    }

    if (hand.includes("Eternal Favorite")) {
      route += "・Eternal Favorite構え\n";
    }

    routes.push(route);
  }

  // ===== 初動なし =====
  if (routes.length === 0) {
    routes.push("初動不可（有効カード不足）");
  }

  return routes;
}
