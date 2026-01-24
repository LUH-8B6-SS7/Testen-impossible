//Hide ineligible content
if(role == "Lecturer"){
    document.getElementById("liveSessionQuestionsSend").style.display = "none";
    intervalSubscribe(updateLiveSessionQuestions);
}
else{
    document.getElementById("liveSessionQuestionsTableDiv").style.display = "none";
}


//--- Student ---
document.getElementById("liveSessionQuestionsSendButton").addEventListener("click", () => {
    liveSessionQuestionsSend()
});

//on pressing enter
document.getElementById("liveSessionQuestionsSendText").addEventListener("keydown", (event) => {
    if(event.keyCode === 13){
        event.preventDefault();
        event.stopPropagation();

        liveSessionQuestionsSend();
    }
});

function liveSessionQuestionsSend(){
    var text = document.getElementById("liveSessionQuestionsSendText").value;
    if(text == "") return;

    document.getElementById("liveSessionQuestionsSendText").value = "";

    var obj = {
        "question": text,
        "answered": false,
        "answere": ""
    };

    dbAdd("liveSessionQuestions_§VALUE§course§", JSON.stringify(obj));
}



//--- Lecturer ---
updateLiveSessionQuestions();

//JSON-Array von strings
var questions  = null;

async function updateLiveSessionQuestions(){
    questions = JSON.parse(await dbGet("liveSessionQuestions_§VALUE§course§"));

    if(questions == null) return;

    updateLiveSessionQuestionsTable();
}

function updateLiveSessionQuestionsTable(){
    var table = document.getElementById("liveSessionQuestionsTable");
    table.innerHTML = "";

    questions.forEach(element => {
        var entry = JSON.parse(element);

        if(entry["answered"] != true){
            var div = document.createElement("div");
            div.classList.add("yCenter");
            div.innerHTML = entry["question"];
            div.style.gridColumn = "1";

            var bt1 = document.createElement("button");
            bt1.classList.add("button");
            bt1.innerHTML = "Beantwortet";
            bt1.style.backgroundColor = "green"
            bt1.style.gridColumn = "2";
            bt1.addEventListener("click", () =>{
                dbRemove("liveSessionQuestions_§VALUE§course§", JSON.stringify(entry));
                entry["answered"] = true;
                dbAdd("liveSessionQuestions_§VALUE§course§", JSON.stringify(entry));
                updateLiveSessionQuestionsTable();
            });

            var bt2 = document.createElement("button");
            bt2.classList.add("button");
            bt2.innerHTML = "Entfernen";
            bt2.style.backgroundColor = "red"
            bt2.style.gridColumn = "3";
            bt2.addEventListener("click", () =>{
                dbRemove("liveSessionQuestions_§VALUE§course§", JSON.stringify(entry));

                //remove local entry
                var index = -1;
                for(i = 0; i < questions.length; i++){
                    if(questions[i] === element){ index = i; break; }
                }
                if(index == -1) return null;

                questions = questions.splice(index, 1);

                updateLiveSessionQuestionsTable();
            });

            var td = document.createElement("td");
            td.style.display = "grid";
            td.style.gridTemplateColumns = "1fr auto auto";
            td.appendChild(div);
            td.appendChild(bt1);
            td.appendChild(bt2);

            var tr = document.createElement("tr");
            tr.appendChild(td);

            table.appendChild(tr);
            //table.insertBefore(tr, table.firstChild);  //reverse order
        }
    });
}

