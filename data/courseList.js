if(!(role == "Lecturer")) document.getElementById("addCourse").style.display = "none";
    

loadCourses();


async function loadCourses(){
    var coursesRaw = await dbGet("courses");
    var courses = JSON.parse(coursesRaw);

    courses.forEach(course => {
        addCourseToCourselist(course);
    });
}

function addCourseToCourselist(courseName){
    var zeile = document.createElement("tr");
    var spalte1 = document.createElement("td");
    var htmlContent = "<div style=\"display: grid; grid-template-columns: 1fr auto;\"><a href=\"liveSession.html?role=" + role + "&course=" + courseName + "\" class=\"yCenter\" style=\"grid-column: 1;\">" + courseName + "</a>";
    if(role == "Lecturer") htmlContent += " <button class=\"button right\" style=\"background-color: red; grid-column: 2;\" onclick=\"removeCourse('" + courseName + "')\">Entfernen</button>";
    htmlContent += " </div>";
    spalte1.innerHTML = htmlContent;

    zeile.id = "courseListZeile" + courseName;

    zeile.appendChild(spalte1);

    document.getElementById("courseListTable").appendChild(zeile);
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