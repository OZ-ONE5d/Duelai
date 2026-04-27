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

// ===== 抹殺 =====
function useCrossout(hand, enemy, target, log) {
  if (hand.includes("抹殺の指名者") && enemy.includes(target)) {
    log.push("→ 抹殺の指名者発動： " + target + " を無効化");
    hand.splice(hand.indexOf("抹殺の指名者"), 1);
    enemy.splice(enemy.indexOf(target), 1);
    return true;
  }
  return false;
}

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

  const route = generateRoute([...hand], [...enemy]);
  const score = evaluateState(hand, enemy);

  result.textContent =
    "展開: " + score.expand + "\n" +
    "妨害: " + score.disrupt + "\n" +
    "総合: " + score.total;

  document.getElementById("route").textContent = route;
}

// ===== 展開 =====
function generateRoute(hand, enemy) {

  let log = [];
  let monsters = [];
  let hasPain = hand.includes("ナイトメアペイン");
  let usedCrossout = false;

  log.push("【展開開始】");

  // ===== スローン =====
  if (hand.includes("ナイトメアスローン")) {

    if (enemy.includes("うらら") && !usedCrossout) {
      if (useCrossout(hand, enemy, "うらら", log)) {
        usedCrossout = true;
        log.push("① スローン → Dロータスサーチ");
        hand.push("Dロータス");
      } else {
        log.push("① スローン → うららで無効");
      }
    } else {
      log.push("① スローン → Dロータスサーチ");
      hand.push("Dロータス");
    }
  }

  // ===== 解門 =====
  if (hand.includes("七精の解門")) {
    log.push("② 解門発動");
    log.push("　手札1枚捨て → Dロータス特殊召喚");
    monsters.push("Dロータス");
  }

  // ===== 通常召喚 =====
  if (hand.includes("Dロータス") && !monsters.includes("Dロータス")) {
    log.push("③ Dロータス通常召喚");
    monsters.push("Dロータス");
  }

  // ===== ロータス =====
  if (monsters.includes("Dロータス")) {

    if (enemy.includes("うらら") && !usedCrossout) {
      if (useCrossout(hand, enemy, "うらら", log)) {
        usedCrossout = true;
        log.push("④ Dロータス → スピリット特殊召喚");
        monsters.push("スピリット");
      } else {
        log.push("④ Dロータス効果 → うららで無効");
      }
    } else {
      log.push("④ Dロータス → スピリット特殊召喚");
      monsters.push("スピリット");
    }
  }

  // ===== 泡影 =====
  let spiritNegated = false;
  if (enemy.includes("泡影") && monsters.includes("スピリット")) {
    log.push("→ 泡影発動：スピリット無効");
    spiritNegated = true;
  }

  // ===== スピリット =====
  if (monsters.includes("スピリット") && !spiritNegated) {

    if (enemy.includes("うらら") && !usedCrossout) {
      if (useCrossout(hand, enemy, "うらら", log)) {
        usedCrossout = true;
      } else {
        log.push("⑤ スピリット効果 → うららで無効");
      }
    } else {
      if (!hasPain) {
        log.push("⑤ スピリット → ナイトメアペインサーチ");
        hand.push("ナイトメアペイン");
        hasPain = true;
      } else {
        log.push("⑤ ペインあり → Eternal Favoriteサーチ");
        hand.push("Eternal Favorite");
      }
    }
  }

  // ===== ペイン =====
  if (hasPain) {
    log.push("⑥ ナイトメアペイン発動");

    if (monsters.includes("スピリット")) {
      log.push("⑦ ペイン効果：スピリットを破壊 → サーチ");
      monsters = monsters.filter(m => m !== "スピリット");

      if (!hand.includes("Eternal Favorite")) {
        log.push("　→ Eternal Favoriteサーチ");
        hand.push("Eternal Favorite");
      }

      log.push("⑧ ユベル特殊召喚");
      monsters.push("ユベル");
    }
  }

  // ===== ニビル =====
  if (enemy.includes("ニビル")) {
    log.push("→ ニビル発動：盤面リセット");
    monsters = ["トークン"];
  }

  // ===== エンド =====
  log.push("");
  log.push("【エンドフェイズ】");

  if (monsters.includes("ユベル")) {
    log.push("ユベル効果 → モンスター1体リリース");
  }

  log.push("墓地からDロータス特殊召喚");
  monsters.push("Dロータス");

  // ===== 最終盤面 =====
  log.push("");
  log.push("【最終盤面】");
  log.push("モンスター数：" + monsters.length);
  log.push("モンスター：" + monsters.join(", "));
  log.push("魔法：ナイトメアペイン");

  if (hand.includes("超融合")) log.push("伏せ：超融合");
  if (hand.includes("Eternal Favorite")) log.push("伏せ：Eternal Favorite");

  return log.join("\n");
}

// ===== 評価 =====
function evaluateState(hand, enemy) {

  let expand = 80;
  let disrupt = 0;

  if (enemy.includes("うらら")) expand -= 25;
  if (enemy.includes("泡影")) expand -= 20;
  if (enemy.includes("ドロバ")) expand -= 15;
  if (enemy.includes("ニビル")) expand -= 50;

  if (hand.includes("超融合")) disrupt += 40;
  if (hand.includes("Eternal Favorite")) disrupt += 30;

  expand = Math.max(0, expand);

  const total = Math.round(expand * 0.6 + disrupt * 0.4);

  return { expand, disrupt, total };
}
