//Hide ineligible content
if(role == "Lecturer"){
    document.getElementById("moodGrid").style.display = "none";
    intervalSubscribe(updateLiveSessionMood);
}
else{
    document.getElementById("moodDiagramm").style.display = "none";
}


//--- Student ---
init();

function init(){
    const stimmungsButtons = document.querySelectorAll('.stimmung-btn');

	stimmungsButtons.forEach(button => {
		button.addEventListener('click', () => {
            //all buttons a disabled, but this is still fully visible
            if(button.classList.contains('active')) return;
			stimmungsButtons.forEach(b => { if (b !== button) b.disabled = true; });

			// angeklickten aktivieren
			button.classList.add('active');

            //get timestamp and send selected option
            dbAdd("liveSessionMood_§VALUE§course§", JSON.stringify({
                "timestamp": getTimestamp(),
                "option": button.id
            }));

			// nach 10 Sekunden aktiv-Klasse entfernen und Buttons wieder aktivieren
			setTimeout(() => {
				button.classList.remove('active');
				stimmungsButtons.forEach(b => b.disabled = false);
			}, moodTimeout);
		});
	});
}


async function senden() {
	var input = document.getElementById("frage-input");
	
	if (input.value.trim() === ""){
		return;
	}
	
	dbAdd("questionPool", {
		"question": input.value.trim(),
		"answered": false
	});

	input.value = "";
}


//--- Lecturer ---
var moodList  = null;

async function updateLiveSessionMood(){
    moodList = JSON.parse(await dbGet("liveSessionMood_§VALUE§course§"));

    if(moodList == null) return;

    var result = {
        "tooSlow": 0,
        "tooFast": 0,
        "repeating": 0,
        "repeat": 0
    };

    moodList.forEach(element => {
        var entry = JSON.parse(element);

        if(entry["timestamp"] + moodTimeout < getTimestamp()){ dbRemove("liveSessionMood_§VALUE§course§", JSON.stringify(entry)); }
        else{ result[entry["option"]]++; }
    });

    //15: moodDiagramm correction
    //5*4: 4 * 5px margin
    //-5: min width
    var maxWidth = document.getElementById("moodDiagramm").offsetWidth - 15 - document.getElementsByClassName("moodDiagrammLable")[0].offsetWidth - 5*4 - 5;

    document.getElementById("moodDiagrammBar0").style.width = (result["tooSlow"] < 10 ? result["tooSlow"]/10 * maxWidth : maxWidth) + 5 + "px";
    document.getElementById("moodDiagrammBar1").style.width = (result["tooFast"] < 10 ? result["tooFast"]/10 * maxWidth : maxWidth) + 5 + "px";
    document.getElementById("moodDiagrammBar2").style.width = (result["repeating"] < 10 ? result["repeating"]/10 * maxWidth : maxWidth) + 5 + "px";
    document.getElementById("moodDiagrammBar3").style.width = (result["repeat"] < 10 ? result["repeat"]/10 * maxWidth : maxWidth) + 5 + "px";
}