function addNewCourse() {
  document.getElementById('myModal').style.display = "block";
  document.getElementById("courses").classList.add("blurred");
}

function closeModal() {
  document.getElementById('myModal').style.display = "none";
  document.getElementById("courses").classList.remove("blurred");
}

function addCourse() {
  var courseName = document.getElementById('newCourseName').value;
  if(courseName) {
    var table = document.querySelector("#courses table");
    var newRow = table.insertRow();
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    cell1.innerHTML = `<a href="lecture.html">${courseName}</a>`;
    cell2.innerHTML = "0"; // Default Teilnehmerzahl
    document.getElementById('newCourseName').value = '';
    closeModal();
  } else {
    alert('Bitte geben Sie einen Kursnamen ein.');
  }
}

document.querySelector('#newCourseName').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      addCourse();
    }
});

