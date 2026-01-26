const burgerBtn = document.getElementById('burger');
const burgerMenu = document.getElementById('burgermenu');

burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    burgerMenu.classList.toggle('open');
});

document.addEventListener('click', () => {
    burgerMenu.classList.remove('open');
});

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