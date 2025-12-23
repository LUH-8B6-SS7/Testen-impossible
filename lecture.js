intervalSubscribe(updateMood);

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

    //ToDo: set diagram acording to result
    console.log(result);
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
    anzeigeFeld.textContent = '';
}