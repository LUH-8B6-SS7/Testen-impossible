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