let students = JSON.parse(localStorage.getItem("students")) || [];

function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
}

document.getElementById("studentForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("studentId").value.trim();
    const name = document.getElementById("studentName").value.trim();
    const age = parseInt(document.getElementById("studentAge").value);
    const gender = document.getElementById("studentGender").value;
    const form = parseInt(document.getElementById("studentFormLevel").value);

    if (!id || !name || !age || !gender || !form) {
        alert("All fields are required!");
        return;
    }

    if (students.some(s => s.id === id)) {
        alert("Student ID must be unique!");
        return;
    }

    const student = {
        id,
        name,
        age,
        gender,
        form,
        performance: []
    };

    students.push(student);
    saveData();
    displayStudents();
    this.reset();
});
function displayStudents(filtered = students) {
    const table = document.getElementById("studentTable");
    table.innerHTML = "";

    filtered.forEach(student => {
        const average = calculateAverage(student);

        table.innerHTML += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>Form ${student.form}</td>
                <td>${average}</td>
                <td>
                    <button onclick="addPerformance('${student.id}')">Add Marks</button>
                    <button onclick="promoteStudent('${student.id}')">Promote</button>
                    <button onclick="deleteStudent('${student.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
}
function calculateAverage(student) {
    const record = student.performance.find(p => p.form === student.form);
    if (!record) return "N/A";

    const scores = Object.values(record.subjects);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return avg.toFixed(1);
}
function addPerformance(id) {
    const student = students.find(s => s.id === id);

    const math = parseInt(prompt("Math score:"));
    const english = parseInt(prompt("English score:"));
    const science = parseInt(prompt("Science score:"));
    const social = parseInt(prompt("Social Studies score:"));

    if ([math, english, science, social].some(score => isNaN(score))) {
        alert("Invalid scores!");
        return;
    }

    const performance = {
        form: student.form,
        subjects: { math, english, science, social }
    };

    const existing = student.performance.find(p => p.form === student.form);
    if (existing) {
        existing.subjects = performance.subjects;
    } else {
        student.performance.push(performance);
    }

    saveData();
    displayStudents();
}


function promoteStudent(id) {
    const student = students.find(s => s.id === id);
    const avg = parseFloat(calculateAverage(student));

    if (student.form === 4) {
        alert("Student completed O-Level!");
        return;
    }

    if (isNaN(avg)) {
        alert("No performance record!");
        return;
    }

    if (avg >= 50) {
        student.form += 1;
        alert("Student promoted!");
    } else {
        alert("Student failed. Cannot promote.");
    }

    saveData();
    displayStudents();
}

function deleteStudent(id) {
    students = students.filter(s => s.id !== id);
    saveData();
    displayStudents();
}

document.getElementById("searchInput").addEventListener("keyup", function () {
    const keyword = this.value.toLowerCase();
    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(keyword) ||
        s.id.toLowerCase().includes(keyword)
    );
    displayStudents(filtered);
});


displayStudents();