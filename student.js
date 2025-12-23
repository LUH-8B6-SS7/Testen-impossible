init();

function init(){
    const stimmungsButtons = document.querySelectorAll('.stimmung-btn');

	stimmungsButtons.forEach(button => {
		button.addEventListener('click', () => {
            //all buttons a disabled, but this is still fully visible
            if(button.classList.contains('active')) return;
			stimmungsButtons.forEach(b => { console.log(b !== button); if (b !== button) b.disabled = true; });

			// angeklickten aktivieren
			button.classList.add('active');

            //get timestamp and send selected option
            dbAdd("moodList", {
                "timestamp": getTimestamp(),
                "option": button.id
            });

			// nach 10 Sekunden aktiv-Klasse entfernen und Buttons wieder aktivieren
			setTimeout(() => {
				button.classList.remove('active');
				stimmungsButtons.forEach(b => b.disabled = false);
			}, moodTimeout);
		});
	});
}


function senden() {
	var input = document.getElementById("frage-input");
	var button = document.getElementById("frage-senden");
	if (input.value.trim() === ""){
		return;
	}
	// frage senden einfügen
	input.value = "";
}