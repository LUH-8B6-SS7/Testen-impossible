intervalSubscribe(updateMood);
intervalSubscribe(updateQuestionPool);

async function updateMood(){
    var moodList = await dbGet("moodList");
    if(moodList == null) return;
    var result = {
        "tooSlow": 0,
        "tooFast": 0,
        "repeating": 0,
        "repeat": 0
    };

    moodList.forEach(mood => {
        if(mood["timestamp"] + moodTimeout < getTimestamp()){ dbRemove("moodList", mood); }
        else{ result[mood["option"]]++; }
    });

    var maxWidth = document.getElementById("diagramm").clientWidth;
    document.getElementById("balken1").style.width = (result["tooSlow"] < 10 ? result["tooSlow"]/10 * maxWidth : maxWidth) + "px";
    document.getElementById("balken2").style.width = (result["tooFast"] < 10 ? result["tooFast"]/10 * maxWidth : maxWidth) + "px";
    document.getElementById("balken3").style.width = (result["repeating"] < 10 ? result["repeating"]/10 * maxWidth : maxWidth) + "px";
    document.getElementById("balken4").style.width = (result["repeat"] < 10 ? result["repeat"]/10 * maxWidth : maxWidth) + "px";

    console.log(result["tooSlow"] < 10 ? result["tooSlow"]/10 * maxWidth : maxWidth);
}

async function updateQuestionPool(){
    var questions = await dbGet("questionPool");
    if(questions === null) return;

    var list = document.getElementById("ziel");
    list.innerHTML = '';

    questions.forEach(question => {
        if(!question["answered"]){
            var div = document.createElement("div");
            div.innerHTML = question["question"];
            div.addEventListener('click', () => {
                selectedQuestion = div;
            });
            list.appendChild(div);
        }
    });
}

var selectedQuestion = null;

async function setQuestionToRead(){
    if(selectedQuestion === null) return;

    var questions = await dbGet("questionPool");
    if(questions === null) return;

    for(i = 0; i < questions.length; i++){
        var question = questions[i];
        if(selectedQuestion.innerHTML == question["question"] && !question["answered"]){
            await dbRemove("questionPool", question);
            question["answered"] = true;
            await dbAdd("questionPool", question);

            selectedQuestion = null;
            break;
        }
    }
}

function erhöheBalken(id){
    const meinElement = document.getElementById(id);
    let aktuelleHoehe = parseInt(meinElement.style.width) || 0;
    let neueHoehe = aktuelleHoehe + 20;

    const diagramm= document.getElementById('diagramm');
    max = diagramm.offsetWidth;
    if (neueHoehe > (max - 130)) {//130 ist ungefähre größe des labels, habe keinen effizienten weg zur berechnung gefunden
        neueHoehe = max;
    }else{
        meinElement.style.width = neueHoehe + "px"; 
    }
}

function verkürzeBalken(id){
    const meinElement = document.getElementById(id);
    let aktuelleHoehe = parseInt(meinElement.style.width);
    let neueHoehe = aktuelleHoehe - 20;
    if (neueHoehe < 0) {
        neueHoehe = 0;
    }
    meinElement.style.width = neueHoehe + "px"; 
}

function anzeigen(){
    const inputFeld = document.getElementById('quelle');
    const anzeigeFeld = document.getElementById('ziel');
    anzeigeFeld.textContent = inputFeld.value;
    inputFeld.value = '';//mit testbereich entfernen
}

function reset(){
    const anzeigeFeld = document.getElementById('ziel');
    if (anzeigeFeld) anzeigeFeld.innerHTML = '';
}

function toggleMenu() { //Skript für das wechseln des Bildes für das Burger-Menu
    		const menu = document.getElementById('burgermenu');
    		const image = document.getElementById('burger').firstElementChild;

    		if (menu.style.display === "none" || menu.style.display === "") {
        		menu.style.display = "block";
        		image.src = "menu-icon-closed.png";
    		} else {
        		menu.style.display = "none";
        		image.src = "menu-icon-open.png";
    		}
		}