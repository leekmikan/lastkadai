player = {
    clear: 0,
}
let ans = "";
let trans = "";
let loading = false;
function load_q(){
  return new Promise((resolve, reject) => {
    var url = 'https://icanhazdadjoke.com/'; 
    fetch(url, {
    headers: {
      "Accept": "application/json",
    },})
    .then(function (data) {
      return data.json();
    })
    .then(function (json) {
      ans =  json.joke;
      resolve();
    });
  });
}
function load_trans(){
  return new Promise((resolve, reject) => {
    var url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(ans)}&langpair=en|ja`; 
    fetch(url)
    .then(function (data) {
      return data.json();
    })
    .then(function (json) {
      trans = json.responseData.translatedText;
      resolve();
    });
  });
}
async function create_q(hold){
    if(loading) return;
    if(!hold) {
        loading = true;
        await load_q();
        await load_trans();
        document.getElementById("trans").innerText = trans;
        loading = false;
    }
    let tmp = sfl(ans.replace("  "," ").split(" "));
    document.getElementById("jd").innerText = "判定";
        document.getElementById("lk").innerHTML = "";
    document.getElementById("sel").innerHTML = "";
    document.getElementById("p_ans").innerHTML = "";
    for(let i = 0;i < tmp.length;i++){
        let newElement = document.createElement("button");
        let newContent = document.createTextNode(tmp[i]);
        newElement.appendChild(newContent);
        newElement.setAttribute("id","child-p3");
        newElement.setAttribute("onclick","move_obj(this)");
        var parentDiv = document.getElementById("sel");
        parentDiv.appendChild(newElement);
    }
}

function move_obj(obj){
    if(document.getElementById("jd").innerText == "次" || loading) return;
    if(obj.parentElement.id == "sel"){
        let newElement = document.createElement("button");
        let newContent = document.createTextNode(obj.innerText);
        newElement.appendChild(newContent);
        newElement.setAttribute("id","child-p3");
        newElement.setAttribute("onclick","move_obj(this)");
        var parentDiv = document.getElementById("p_ans");
        parentDiv.appendChild(newElement);
    }else{
        let newElement = document.createElement("button");
        let newContent = document.createTextNode(obj.innerText);
        newElement.appendChild(newContent);
        newElement.setAttribute("id","child-p3");
        newElement.setAttribute("onclick","move_obj(this)");
        var parentDiv = document.getElementById("sel");
        parentDiv.appendChild(newElement);
    }
    obj.remove();
}
function ans_j(ret){
    if(loading) return;
    if(document.getElementById("jd").innerText == "次" || ret) {
        create_q(false);
        return;
    }
    let tmp = ans.replace("  "," ").split(" ");
    let objs = document.getElementById("p_ans").children;
    let clear = true;
    for(let i = 0;i < objs.length;i++){
        if(tmp[i] == objs[i].innerText){
            objs[i].className = "crr";
        }else{
            clear = false;
            objs[i].className = "icrr";
        }
    }
    if (clear && objs.length == tmp.length) {
        alert("正解！！");
        player.clear++;
        document.getElementById("clear").innerText = player.clear;
        Save();
        document.getElementById("jd").innerText = "次";
        document.getElementById("lk").innerHTML = "<a href='https://www.google.com/search?q=" + ans + "'>この文を検索</a>";
    }

}
function Wipe(){
    player = {
        clear: 0,
    }
    document.location.reload();
    Save();
}
function Save(){
    if (window.localStorage) {
		let tmp = JSON.stringify(player, undefined, 1);
		localStorage.setItem('english_q', tmp);
	}
}
function sfl(arr){
    if(arr.length == 0) return arr;
    for (const [index, num] of arr.entries()) {
        const tempIndex = Math.floor(Math.random() * arr.length); // ランダムなインデックス
        const tempNum = arr[index]; // 現在の要素を一時的に保存
        arr[index] = arr[tempIndex]; // 現在の要素とランダムな要素を交換
        arr[tempIndex] = tempNum; // 一時的に保存した要素をランダムな位置に配置
    }
    return arr;
}
if (window.localStorage) {
	let data = localStorage.getItem('english_q');
	if(data){
		player = JSON.parse(data);
	}
}
document.getElementById("clear").innerText = player.clear;
create_q(false);