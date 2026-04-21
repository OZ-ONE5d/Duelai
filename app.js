function simulate(){

const lotus =
document.getElementById("lotus").checked;

const spirit =
document.getElementById("spirit").checked;

const throne =
document.getElementById("throne").checked;

const ashTarget =
document.getElementById("ashTarget").value;

let log = "";


// 初手確認

if(!lotus && !throne){

log += "初動不足\n";
log += "展開不可\n";

document.getElementById("output").innerText = log;
return;

}


// 基本展開

log += "基本展開:\n";

if(lotus){

log +=
"1. Samsara D Lotus使用\n";

}

if(throne){

log +=
"2. Nightmare Throne使用\n";

}

log +=
"3. Spirit of Yubel展開\n";

log +=
"4. Nightmare Painへ接続\n\n";


// 被弾判定

if(ashTarget==="none"){

log +=
"うららなし\n";

log +=
"最大展開ルート\n";

log +=
"最低保証盤面: 達成\n";

}


else if(ashTarget==="lotus"){

log +=
"Dロータスにうらら被弾\n";

if(throne){

log +=
"代替ルートへ分岐\n";

log +=
"Nightmare Throne経由で継続\n";

log +=
"最低保証盤面: 達成\n";

}
else{

log +=
"継続不可\n";

log +=
"最低保証盤面: 未達\n";

}

}


else if(ashTarget==="throne"){

log +=
"Nightmare Throneにうらら被弾\n";

if(lotus){

log +=
"Dロータス経由で継続\n";

log +=
"最低保証盤面: 達成\n";

}
else{

log +=
"継続不可\n";

log +=
"最低保証盤面: 未達\n";

}

}


document.getElementById("output").innerText = log;

}
