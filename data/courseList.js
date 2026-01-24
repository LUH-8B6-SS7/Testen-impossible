if(!(role == "Lecturer")) document.getElementById("addCourse").style.display = "none";


renameCourseOldName = "";

loadCourses();
//intervalSubscribe(loadCourses);

//on pressing enter
document.getElementById("newCourseName").addEventListener("keydown", (event) => {
    if(event.keyCode === 13){
        event.preventDefault();
        event.stopPropagation();

        addCourse();
    }
});


async function loadCourses(){
    var coursesRaw = await dbGet("courses");
    var courses = JSON.parse(coursesRaw);

    document.getElementById("courseListTable").innerHTML = "<tr><th>Kurse</th></tr>";

    courses.forEach(course => {
        addCourseToCourselist(course);
    });
}

function addCourseToCourselist(courseName){
    var row = document.createElement("tr");
    row.id = "courseListZeile" + courseName;

    var col = document.createElement("td");
    col.style.display = "grid";
    col.style.gridTemplateColumns = "1fr auto auto";

    var link = document.createElement("a");
    link.href = "liveSession.html?role=" + role + "&course=" + courseName;
    link.classList.add("yCenter");
    link.classList.add("textHighlight");
    link.style.gridColumn = "1";
    link.innerHTML = courseName;

    var edit = document.createElement("button");
    edit.classList.add("button");
    edit.classList.add("right");
    edit.classList.add("normal");
    edit.style.gridColumn = "2";
    edit.innerHTML = "Umbenennen";
    edit.addEventListener("click", () => { renameCourseOldName = courseName; renameCourseDialogOpen(); });

    var remove = document.createElement("button");
    remove.classList.add("button");
    remove.classList.add("right");
    remove.classList.add("red");
    remove.style.gridColumn = "3";
    remove.innerHTML = "Entfernen";
    remove.addEventListener("click", () => { removeCourse(courseName); });

    col.appendChild(link);
    if(role == "Lecturer"){
        col.appendChild(edit);
        col.appendChild(remove);
    }

    row.appendChild(col);

    document.getElementById("courseListTable").appendChild(row);
}



async function addCourse(){
    var newName = document.getElementById("newCourseName").value;
    if(newName === "") return;

    dbAdd("courses", newName);
    addCourseToCourselist(newName);
    document.getElementById("newCourseName").value = "";
    addCourseDialogClose();
}

async function removeCourse(name) {
    dbRemove("courses", name);

    var liveSessionQuestions = await dbGet("liveSessionQuestions_" + name);
    var feedback = await dbGet("feedback_" + name);
    var liveSessionMood = await dbGet("liveSessionMood_" + name);

    if(liveSessionQuestions != null){
        JSON.parse(liveSessionQuestions).forEach(element => {
            dbRemove("liveSessionQuestions_" + name, element);
        });
    }
    
    if(feedback != null){
        JSON.parse(feedback).forEach(element => {
            dbRemove("feedback_" + name, element);
        });
    }
    
    if(liveSessionMood != null){
        JSON.parse(liveSessionMood).forEach(element => {
            dbRemove("liveSessionMood_" + name, element);
        });
    }

    document.getElementById("courseListTable").removeChild(document.getElementById("courseListZeile" + name));
}

function addCourseDialogOpen(){
    var divList = document.getElementsByTagName("div");
    for(i = 0; i < divList.length; i++){
        if(!divList[i].classList.contains("unblurred")) divList[i].classList.add("blurred");
    }

    document.getElementById("addCourseDialog").style.display = "grid";
}

function addCourseDialogClose(){
    var divList = document.getElementsByTagName("div");
    for(i = 0; i < divList.length; i++){
        divList[i].classList.remove("blurred");
    }

    document.getElementById("addCourseDialog").style.display = "none";
}



async function renameCourse(){
    var newName = document.getElementById("renameCourseName").value;
    if(newName === "") return;
    if(renameCourseOldName === "") return;

    //add new course
    dbAdd("courses", newName);
    addCourseToCourselist(newName);
    
    //copy data
    var liveSessionQuestions = await dbGet("liveSessionQuestions_" + renameCourseOldName);
    var feedback = await dbGet("feedback_" + renameCourseOldName);
    var liveSessionMood = await dbGet("liveSessionMood_" + renameCourseOldName);

    if(liveSessionQuestions != null){
        JSON.parse(liveSessionQuestions).forEach(element => {
            dbAdd("liveSessionQuestions_" + newName, element);
        });
    }
    
    if(feedback != null){
        JSON.parse(feedback).forEach(element => {
            dbAdd("feedback_" + newName, element);
        });
    }
    
    if(liveSessionMood != null){
        JSON.parse(liveSessionMood).forEach(element => {
            dbAdd("liveSessionMood_" + newName, element);
        });
    }

    //remove old course
    removeCourse(renameCourseOldName);


    document.getElementById("renameCourseName").value = "";
    renameCourseOldName = "";

    renameCourseDialogClose();
}

function renameCourseDialogOpen(){
    var divList = document.getElementsByTagName("div");
    for(i = 0; i < divList.length; i++){
        if(!divList[i].classList.contains("unblurred")) divList[i].classList.add("blurred");
    }

    document.getElementById("renameCourseDialog").style.display = "grid";
}

function renameCourseDialogClose(){
    var divList = document.getElementsByTagName("div");
    for(i = 0; i < divList.length; i++){
        divList[i].classList.remove("blurred");
    }

    document.getElementById("renameCourseDialog").style.display = "none";
}