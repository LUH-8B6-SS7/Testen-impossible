if(role == "Lecturer") document.getElementById("addFeedback").style.display = "none";
    

loadFeedback();
intervalSubscribe(loadFeedback);


async function loadFeedback(){
    var feedbackRaw = await dbGet("feedback_§VALUE§course§");
    var feedback = JSON.parse(feedbackRaw);

    document.getElementById("feedbackTable").innerHTML = "<tr><th>Feedback</th></tr>";

    feedback.forEach(element => {
        addfeedbackToList(element);
    });
}

/**
 * @param {string} feedback 
 */
function addfeedbackToList(feedback){
    var row = document.createElement("tr");

    var col = document.createElement("td");
    col.style.display = "grid";
    col.style.gridTemplateColumns = "1fr auto";

    var text = document.createElement("div");
    text.classList.add("yCenter");
    text.innerHTML = feedback;
    text.style.gridColumn = "1";

    var remove = document.createElement("button");
    remove.innerHTML = "Entfernen";
    remove.classList.add("button");
    remove.classList.add("right");
    remove.style.backgroundColor = "red"
    remove.style.gridColumn = "2";
    remove.addEventListener("click", () => {
        dbRemove("feedback_§VALUE§course§", feedback);
        document.getElementById("feedbackTable").removeChild(row);
    });

    col.appendChild(text);
    if(role == "Lecturer") col.appendChild(remove);

    row.appendChild(col);

    document.getElementById("feedbackTable").appendChild(row);
}

async function addFeedback(){
    var text = document.getElementById("newFeedback").value;
    if(text === "") return;

    dbAdd("feedback_§VALUE§course§", text);
    addfeedbackToList(text);
    document.getElementById("newFeedback").value = "";
    addFeedbackDialogClose();
}

function addFeedbackDialogOpen(){
    var divList = document.getElementsByTagName("div");
    for(i = 0; i < divList.length; i++){
        if(!divList[i].classList.contains("unblurred")) divList[i].classList.add("blurred");
    }

    document.getElementById("addFeedbackDialog").style.display = "grid";
}

function addFeedbackDialogClose(){
    var divList = document.getElementsByTagName("div");
    for(i = 0; i < divList.length; i++){
        divList[i].classList.remove("blurred");
    }

    document.getElementById("addFeedbackDialog").style.display = "none";
}