//Hilfsfunktionen
function toblock() {
    document.getElementById('header').classList.add("blocked");
    document.getElementById('flex-container').classList.add("blocked");
    document.getElementById('foot').classList.add("blocked");
}
function unblock() {
    document.getElementById('header').classList.remove("blocked");
    document.getElementById('flex-container').classList.remove("blocked");
    document.getElementById('foot').classList.remove("blocked");
}
    
//Counter
var id = 3;

//Feedback Hinzufügen
function addfeedback() {
    document.getElementById('addfb').style.display = "flex";
    toblock();
}

function cancelfeedback() {
    document.getElementById('addfb').style.display = "none";
    document.getElementById("feedbackName").value = "";
    document.getElementById("feedbackcontent").value = "";
    unblock();
}

function makefeedback(){
    var divElement = document.createElement("Div");
    divElement.setAttribute('class', 'post');
    var temp = id+'.1';
    var temp2 = id+'.2';
    divElement.addEventListener('click', function() {showFeedback(temp, temp2);});

    var divElement2 = document.createElement("Div");
    divElement2.setAttribute('class', 'container');
    var paragraph = document.createElement("P");
    paragraph.id = id+'.1';
    var name = document.getElementById("feedbackName").value;
    if(!name){
        alert('Bitte geben sie eine Überschrift ein');
        document.getElementById("feedbackName").style = "border: 4px solid red";
    } else {
        document.getElementById("feedbackName").style = "border: 1px solid black";
        var text = document.createTextNode(name);
        var inhalt = document.getElementById("feedbackcontent").value;
        var text2 = document.createTextNode(inhalt);
        var cparagraph = document.createElement("P");
        cparagraph.id = id+'.2';
        cparagraph.setAttribute('class', 'content');
        
        paragraph.appendChild(text);
        cparagraph.appendChild(text2);
        divElement2.appendChild(paragraph);
        divElement2.appendChild(cparagraph);
        divElement.appendChild(divElement2);

        document.getElementById('flex-container').appendChild(divElement);
        id = id + 1;
        cancelfeedback();
    }
}

//Feedback Lesen
function closefeedback() {
    document.getElementById('fb').style.display = "none";
    unblock();
}

function showFeedback(value1, value2) {
    document.getElementById('fb').style.display = "flex";
    toblock();
    
    document.getElementById('popupheader').innerHTML = document.getElementById(value1).innerHTML;
    document.getElementById('popupheader').style.display = "flex";

    document.getElementById('popupcontent').innerHTML = document.getElementById(value2).innerHTML;
    document.getElementById('popupcontent').style.display = "flex";
}