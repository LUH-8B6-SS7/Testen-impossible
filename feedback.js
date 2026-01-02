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


//Feedback Hinzufügen
function addfeedback() {
    document.getElementById('addfb').style.display = "flex";
    toblock();
}
function closefeedback() {
    document.getElementById('addfb').style.display = "none";
    document.getElementById("feedbackName").value = "";
    document.getElementById("feedbackcontent").value = "";
    unblock();
}

function makefeedback(){
    var divElement = document.createElement("Div");
    divElement.setAttribute('class', 'post');
    divElement.onclick = showFeedback;

    var divElement2 = document.createElement("Div");
    divElement2.setAttribute('class', 'container');
    var paragraph = document.createElement("P");
    var name = document.getElementById("feedbackName").value;
    if(!name){
        alert('Bitte geben sie eine Überschrift ein');
        document.getElementById("feedbackName").style = "border: 4px solid red";
    } else {
        document.getElementById("feedbackName").style = "border: 1px solid black";
        var text = document.createTextNode(name)
        
        paragraph.appendChild(text);
        divElement2.appendChild(paragraph);
        divElement.appendChild(divElement2);

        document.getElementById('flex-container').appendChild(divElement);
        closefeedback();
    }
}

//Feedback Lesen
function showFeedback() {
    toblock();
    unblock();
}