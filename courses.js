//GLOBALE VARIABLEN

let currentCourseRow = null;


//FUNCTIONS

function addNewCourse() {
  document.getElementById('myModal').style.display = "block";
  document.getElementById("table").classList.add("blurred");
  document.getElementById("header").classList.add("blurred");
  document.getElementById("header2").classList.add("blurred");
}

function closeModal() {
  document.getElementById('myModal').style.display = "none";
  document.getElementById("table").classList.remove("blurred");
  document.getElementById("header").classList.remove("blurred");
  document.getElementById("header2").classList.remove("blurred");
}

function addCourse() {
  var courseName = document.getElementById('newCourseName').value;
  if(courseName) {
    var table = document.getElementById('coursesTable');
    var newRow = table.insertRow();
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    cell1.innerHTML = `<a href="lecture.html#${courseName}">${courseName}</a> 
                      <button class="edit" name="${courseName}" onclick="openCoursConfig(this)">
                        <img src="cog-icon.png">
                      </button>`;
    cell2.innerHTML = "0"; // Default Teilnehmerzahl
    document.getElementById('newCourseName').value = '';
    closeModal();
  } else {
    alert('Bitte geben Sie einen Kursnamen ein.');
  }
}

document.querySelector('#newCourseName').addEventListener('keypress', function (e) {
    if (e.key === "Enter") {
      addCourse();
    }
});


function openCoursConfig(button) {
  currentCourseRow = button.closest("tr");

  document.getElementById("nameOfCourse").textContent = button.name;

  document.getElementById("myConfig").style.display = "block";
  document.getElementById("table").classList.add("blurred");
  document.getElementById("header").classList.add("blurred");
  document.getElementById("header2").classList.add("blurred");
}

function exitCoursConfig() {
  document.getElementById('myConfig').style.display = "none";
  document.getElementById("table").classList.remove("blurred");
  document.getElementById("header").classList.remove("blurred");
  document.getElementById("header2").classList.remove("blurred");
}


function renameCourse() {
  const newName = document.querySelector('#myConfig input').value;

  if (!newName || !currentCourseRow) {
    alert("Bitte geben Sie einen neuen Kursnamen ein.");
    return;
  }

  const link = currentCourseRow.querySelector("a");
  const editButton = currentCourseRow.querySelector("button.edit");

  // Text & Link aktualisieren
  link.textContent = newName;
  link.href = `lecture.html#${newName}`;

  // Button-Name aktualisieren
  editButton.name = newName;

  // Input leeren & Modal schließen
  document.querySelector('#myConfig input').value = "";
  exitCoursConfig();
}
