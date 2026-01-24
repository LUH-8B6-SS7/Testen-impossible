if(role == "Lecturer"){
    document.getElementById("questionPoolSend").style.display = "none";
}
else{
    
}

updateQuestionPool();
intervalSubscribe(updateQuestionPool);

//on pressing enter
document.getElementById("questionPoolSendText").addEventListener("keydown", (event) => {
    if(event.keyCode === 13){
        event.preventDefault();
        event.stopPropagation();

        addQuestionsToQuestionPool();
    }
});

document.getElementById("questionPoolSendButton").addEventListener("click", () => {
    addQuestionsToQuestionPool();
});



function addQuestionsToQuestionPool(){
    var text = document.getElementById("questionPoolSendText").value;
    if(text == "") return;

    document.getElementById("questionPoolSendText").value = "";

    var obj = {
        "question": text,
        "answered": true,
        "answere": ""
    };

    questionPoolUploadQuestion(JSON.stringify(obj));
}

async function questionPoolUploadQuestion(str){
    await dbAdd("liveSessionQuestions_§VALUE§course§", str);
    updateQuestionPool();
}

async function updateQuestionPool(){
    var questionsRaw = await dbGet("liveSessionQuestions_§VALUE§course§");
    if(questionsRaw == null) return;

    var questions = JSON.parse(questionsRaw);

    document.getElementById("questionPoolTable").innerHTML = "<tr><th>Fragen</th></tr>";

    questions.forEach(element => {
        addQuestionsToList(element);
    });
}

/**
 * @param {obj as string} elementRaw 
 */
function addQuestionsToList(elementRaw){
    var element = JSON.parse(elementRaw);

    var row = document.createElement("tr");

    var col = document.createElement("td");
    col.style.display = "grid";
    col.style.gridTemplateColumns = "1fr auto";

    var text = document.createElement("div");
    text.classList.add("yCenter");
    text.innerHTML = element["question"];
    text.style.gridColumn = "1";
    text.style.gridRow = "1";

    var remove = document.createElement("button");
    remove.innerHTML = "Entfernen";
    remove.classList.add("button");
    remove.classList.add("right");
    remove.classList.add("red");
    remove.style.gridColumn = "2";
    remove.style.gridRow = "1";
    remove.addEventListener("click", () => {
        questionPoolRemoveQuestion(row, elementRaw);
    });

    var answere = document.createElement("div");
    answere.classList.add("yCenter");
    answere.innerHTML = "Antwort:<br>" + element["answere"];
    answere.style.gridColumn = "1";
    answere.style.gridRow = "2";

    var input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Antwort";
    input.style.gridColumn = "1";
    input.style.gridRow = "2";

    var send = document.createElement("button");
    send.innerHTML = "Antworten";
    send.classList.add("button");
    send.classList.add("right");
    send.classList.add("normal");
    send.style.gridColumn = "2";
    send.style.gridRow = "2";
    send.addEventListener("click", () => {
        var answereText = input.value;
        if(answereText !== ""){
            element["answere"] = answereText;
            questionPoolAnswereQuestion(row, elementRaw, element);
        }
    });

    col.appendChild(text);

    if(role == "Lecturer"){
        col.appendChild(remove);
    }
    if(element["answere"] === ""){
        if(role == "Lecturer"){
            col.appendChild(input);
            col.appendChild(send);
        }
    }
    else{
        col.appendChild(answere);
    }

    row.appendChild(col);

    document.getElementById("questionPoolTable").appendChild(row);
}

async function questionPoolRemoveQuestion(row, elementRaw) {
    document.getElementById("questionPoolTable").removeChild(row);
    await dbRemove("liveSessionQuestions_§VALUE§course§", elementRaw);
    updateQuestionPool();
}

async function questionPoolAnswereQuestion(row, elementRaw, element) {
    document.getElementById("questionPoolTable").removeChild(row);
    await dbRemove("liveSessionQuestions_§VALUE§course§", elementRaw);
    await dbAdd("liveSessionQuestions_§VALUE§course§", JSON.stringify(element));
    updateQuestionPool();
}