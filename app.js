function decidePlay(){

const hand = {
starterA: document.getElementById("starterA").checked,
starterB: document.getElementById("starterB").checked,
starterC: document.getElementById("starterC").checked
};

const interrupts = {
ash: document.getElementById("ash").checked,
nibiru: document.getElementById("nibiru").checked,
droll: document.getElementById("droll").checked
};

let route = "";
let guarantee = "";
let reason = "";


// ---- 仮ルールベース ----

// 最強初手
if(hand.starterA && hand.starterB){

if(interrupts.ash){

route = "ケアルート2";

guarantee = "最低保証盤面 到達";

reason =
"うららケア優先。" +
"展開継続を重視し、最大展開ではなく安全ルート選択。";

}
else{

route = "最大展開ルート";

guarantee = "高盤面";

reason =
"主要妨害が薄いため最大展開。";

}

}


// 初動1枚のみ
else if(hand.starterA || hand.starterB){

route = "ケアルート1";

guarantee = "最低保証盤面 到達";

reason =
"初動が弱いため継続優先。";

}


// 初動不足
else{

route = "展開不可";

guarantee = "最低保証盤面 未達";

reason =
"初動不足。";

}


document.getElementById("output").innerHTML =

`
推奨展開: ${route}<br><br>

結果: ${guarantee}<br><br>

理由: ${reason}
`;

}
