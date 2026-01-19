if(!(role == "Lecturer")){
    document.getElementById("burgerMenuKurslisteQRCodeLink").style.display = "none";
}


var burgerMenuExtended = false;

document.getElementById("burgerMenuOpen").addEventListener("click", (e) => { e.stopPropagation(); toggleBurgerMenu(); });
document.getElementById("burgerMenuClose").addEventListener("click", (e) => { e.stopPropagation(); toggleBurgerMenu(); });
document.getElementById("burgerMenuDropdown").addEventListener("click", (e) => { e.stopPropagation(); });
document.addEventListener('click', () => { burgerMenuExtended = false; updateBurgerMenuState(); });

updateBurgerMenuState();

function toggleBurgerMenu(){
    burgerMenuExtended = !burgerMenuExtended;
    updateBurgerMenuState();
}

function updateBurgerMenuState(){
    if(burgerMenuExtended){
        document.getElementById("burgerMenuOpen").style.display = "none";
        document.getElementById("burgerMenuClose").style.display = "";
        document.getElementById("burgerMenuDropdown").style.display = "";
    }
    else{
        document.getElementById("burgerMenuOpen").style.display = "";
        document.getElementById("burgerMenuClose").style.display = "none";
        document.getElementById("burgerMenuDropdown").style.display = "none";
    }
}