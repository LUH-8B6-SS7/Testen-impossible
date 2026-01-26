if(!(role == "Lecturer")){
    document.getElementById("burgerMenuKurslisteQRCodeLink").style.display = "none";
}

checkForValidCourse();

async function checkForValidCourse(){
    var coursesRaw = await dbGet("courses");
    var courses = JSON.parse(coursesRaw);

    var b = false;
    courses.forEach(course => {
        if(course === "§VALUE§course§") b = true;
    });

    if(!b){
        var linkList = document.getElementsByClassName("burgerMenuLinkNotCourseList");
        for(i = 0; i < linkList.length; i++){
            linkList[i].style.display = "none"
        }
    }
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