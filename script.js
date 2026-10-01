// ======================================================
// STUDENT MANAGEMENT SYSTEM - COMPLETE JAVASCRIPT
// MongoDB Backend Version
// ======================================================

const API_URL = "http://localhost:5000/api";


// ======================================================
// GLOBAL DATA
// ======================================================

let allStudents = [];
let allAttendance = [];
let allMarks = [];
let allCourses = [];
let allFees = [];
let allTimetable = [];
let allEvents = [];


// ======================================================
// PAGE NAVIGATION
// ======================================================

const menuItems =
    document.querySelectorAll(".menu-item[data-page]");

const pages =
    document.querySelectorAll(".page");


const pageTitles = {

    dashboard: [
        "Dashboard",
        "Welcome back! Here's your overview."
    ],

    students: [
        "Students",
        "Manage all registered students."
    ],

    attendance: [
        "Attendance",
        "Track student attendance."
    ],

    marks: [
        "Marks",
        "Manage student marks and grades."
    ],

    courses: [
        "Courses",
        "Manage courses."
    ],

    fees: [
        "Fees",
        "Manage student fee records."
    ],

    timetable: [
        "Timetable",
        "View and manage class timetable."
    ],

    events: [
        "Events",
        "Manage upcoming events."
    ],

    profile: [
        "Profile",
        "Manage your profile information."
    ],

    settings: [
        "Settings",
        "Manage application settings."
    ]

};


// ======================================================
// SHOW PAGE
// ======================================================

function showPage(pageName) {

    pages.forEach(page => {

        page.classList.remove("active-page");

    });


    menuItems.forEach(item => {

        item.classList.remove("active");

    });


    const selectedPage =
        document.getElementById(pageName);

    if (selectedPage) {

        selectedPage.classList.add("active-page");

    }


    const selectedMenu =
        document.querySelector(
            `.menu-item[data-page="${pageName}"]`
        );

    if (selectedMenu) {

        selectedMenu.classList.add("active");

    }


    const title =
        document.getElementById("pageTitle");

    const subtitle =
        document.getElementById("pageSubtitle");


    if (title && pageTitles[pageName]) {

        title.textContent =
            pageTitles[pageName][0];

    }


    if (subtitle && pageTitles[pageName]) {

        subtitle.textContent =
            pageTitles[pageName][1];

    }


    // Load page data

    if (pageName === "dashboard") {
        loadDashboard();
    }

    if (pageName === "students") {
        loadStudents();
    }

    if (pageName === "attendance") {
        loadAttendance();
    }

    if (pageName === "marks") {
        loadMarks();
    }

    if (pageName === "courses") {
        loadCourses();
    }

    if (pageName === "fees") {
        loadFees();
    }

    if (pageName === "timetable") {
        loadTimetable();
    }

    if (pageName === "events") {
        loadEvents();
    }

    if (pageName === "profile") {
        loadProfile();
    }

    if (pageName === "settings") {
        loadSettings();
    }

}


// ======================================================
// MENU CLICK
// ======================================================

menuItems.forEach(item => {

    item.addEventListener("click", function () {

        const page =
            this.dataset.page;

        if (page) {

            showPage(page);

        }

    });

});


// ======================================================
// MOBILE SIDEBAR
// ======================================================

function toggleSidebar() {

    const sidebar =
        document.querySelector(".sidebar");

    if (sidebar) {

        sidebar.classList.toggle("show");

    }

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
// ======================================================
// STUDENT MANAGEMENT
// ======================================================


// OPEN STUDENT MODAL
function openModal() {

    const modal =
        document.getElementById("studentModal");

    if (modal) {

        modal.classList.add("show");

    }

}


// CLOSE STUDENT MODAL
function closeModal() {

    const modal =
        document.getElementById("studentModal");

    if (modal) {

        modal.classList.remove("show");

    }

    const form =
        document.getElementById("studentForm");

    if (form) {

        form.reset();

    }

}


// ======================================================
// LOAD STUDENTS FROM MONGODB
// ======================================================

async function loadStudents() {

    try {

        const response =
            await fetch(`${API_URL}/students`);

        if (!response.ok) {

            throw new Error(
                "Failed to fetch students"
            );

        }

        allStudents =
            await response.json();


        renderStudents(allStudents);

        updateStudentCount();

        populateStudentSelects();

        updateDashboardStudentData();


    } catch (error) {

        console.error(
            "LOAD STUDENTS ERROR:",
            error
        );

        showToast(
            "Unable to load students",
            "error"
        );

    }

}


// ======================================================
// RENDER STUDENTS
// ======================================================

function renderStudents(students) {

    const tableBody =
        document.getElementById(
            "studentTableBody"
        );

    if (!tableBody) return;


    tableBody.innerHTML = "";


    if (!students || students.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7"
                    style="text-align:center;">
                    No students found
                </td>
            </tr>
        `;

        return;

    }


    students.forEach(student => {

        tableBody.innerHTML +=
            createStudentRow(student);

    });

}


// ======================================================
// CREATE STUDENT ROW
// ======================================================

function createStudentRow(student) {

    const attendance =
        student.attendance ?? 100;


    return `
        <tr>

            <td>
                <div class="table-student">

                    <div class="mini-avatar">
                        ${escapeHTML(
                            student.name
                                ? student.name
                                    .charAt(0)
                                    .toUpperCase()
                                : "S"
                        )}
                    </div>

                    <div>
                        <strong>
                            ${escapeHTML(student.name)}
                        </strong>

                        <small>
                            ${escapeHTML(student.email)}
                        </small>
                    </div>

                </div>
            </td>


            <td>
                ${escapeHTML(student.department)}
            </td>


            <td>
                ${escapeHTML(student.year)}
            </td>


            <td>
                ${escapeHTML(student.email)}
            </td>


            <td>
                <div class="progress">
                    <span
                        style="width:${attendance}%">
                    </span>
                </div>

                <small>
                    ${attendance}%
                </small>
            </td>


            <td>

                <button
                    class="action-btn"
                    onclick="editStudent('${student._id}')">
                    Edit
                </button>

                <button
                    class="action-btn"
                    onclick="deleteStudent('${student._id}')">
                    Delete
                </button>

            </td>

        </tr>
    `;

}


// ======================================================
// ADD STUDENT
// ======================================================

async function addStudent(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "studentName"
        ).value.trim();


    const department =
        document.getElementById(
            "studentDepartment"
        ).value.trim();


    const year =
        document.getElementById(
            "studentYear"
        ).value.trim();


    const email =
        document.getElementById(
            "studentEmail"
        ).value.trim();


    if (
        !name ||
        !department ||
        !year ||
        !email
    ) {

        showToast(
            "Please fill all fields",
            "error"
        );

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/students`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name,
                        department,
                        year,
                        email

                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Error adding student"
            );

        }


        showToast(
            "Student added successfully"
        );


        closeModal();


        await loadStudents();

        await loadDashboard();


    } catch (error) {

        console.error(
            "ADD STUDENT ERROR:",
            error
        );

        showToast(
            error.message ||
            "Error adding student",
            "error"
        );

    }

}


// ======================================================
// EDIT STUDENT
// ======================================================

async function editStudent(studentId) {

    const student =
        allStudents.find(
            item => item._id === studentId
        );


    if (!student) {

        showToast(
            "Student not found",
            "error"
        );

        return;

    }


    document.getElementById(
        "studentName"
    ).value =
        student.name || "";


    document.getElementById(
        "studentDepartment"
    ).value =
        student.department || "";


    document.getElementById(
        "studentYear"
    ).value =
        student.year || "";


    document.getElementById(
        "studentEmail"
    ).value =
        student.email || "";


    openModal();


    const form =
        document.getElementById(
            "studentForm"
        );


    form.onsubmit = async function(event) {

        event.preventDefault();


        const updatedData = {

            name:
                document.getElementById(
                    "studentName"
                ).value.trim(),

            department:
                document.getElementById(
                    "studentDepartment"
                ).value.trim(),

            year:
                document.getElementById(
                    "studentYear"
                ).value.trim(),

            email:
                document.getElementById(
                    "studentEmail"
                ).value.trim()

        };


        try {

            const response =
                await fetch(
                    `${API_URL}/students/${studentId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                updatedData
                            )
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Error updating student"
                );

            }


            showToast(
                "Student updated successfully"
            );


            closeModal();


            form.onsubmit =
                addStudent;


            await loadStudents();

            await loadDashboard();


        } catch (error) {

            console.error(
                "UPDATE STUDENT ERROR:",
                error
            );

            showToast(
                error.message ||
                "Error updating student",
                "error"
            );

        }

    };

}


// ======================================================
// DELETE STUDENT
// ======================================================

async function deleteStudent(studentId) {

    const student =
        allStudents.find(
            item => item._id === studentId
        );


    const studentName =
        student
            ? student.name
            : "this student";


    const confirmed =
        confirm(
            `Are you sure you want to delete ${studentName}?`
        );


    if (!confirmed) return;


    try {

        const response =
            await fetch(
                `${API_URL}/students/${studentId}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Error deleting student"
            );

        }


        showToast(
            "Student deleted successfully"
        );


        await loadStudents();

        await loadAttendance();

        await loadMarks();

        await loadFees();

        await loadDashboard();


    } catch (error) {

        console.error(
            "DELETE STUDENT ERROR:",
            error
        );

        showToast(
            error.message ||
            "Error deleting student",
            "error"
        );

    }

}


// ======================================================
// STUDENT COUNT
// ======================================================

function updateStudentCount() {

    const totalStudents =
        document.getElementById(
            "totalStudents"
        );


    if (totalStudents) {

        totalStudents.textContent =
            allStudents.length;

    }

}


// ======================================================
// SEARCH STUDENTS
// ======================================================

function searchStudents() {

    const searchInput =
        document.getElementById(
            "studentSearch"
        );


    const searchText =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const filtered =
        allStudents.filter(student => {

            return (

                student.name
                    .toLowerCase()
                    .includes(searchText)

                ||

                student.department
                    .toLowerCase()
                    .includes(searchText)

                ||

                student.email
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    renderStudents(filtered);

}


// ======================================================
// FILTER BY DEPARTMENT
// ======================================================

function filterByDepartment() {

    const filter =
        document.getElementById(
            "departmentFilter"
        );


    const value =
        filter
            ? filter.value
            : "all";


    if (value === "all" || value === "") {

        renderStudents(allStudents);

        return;

    }


    const filtered =
        allStudents.filter(student => {

            return student.department === value;

        });


    renderStudents(filtered);

}


// ======================================================
// POPULATE STUDENT SELECT BOXES
// ======================================================

function populateStudentSelects() {

    const selects = [

        document.getElementById(
            "marksStudent"
        ),

        document.getElementById(
            "feeStudent"
        )

    ];


    selects.forEach(select => {

        if (!select) return;


        select.innerHTML =
            `<option value="">
                Select Student
            </option>`;


        allStudents.forEach(student => {

            const option =
                document.createElement(
                    "option"
                );


            // IMPORTANT:
            // MongoDB ObjectId is used as value

            option.value =
                student._id;


            option.textContent =
                student.name;


            select.appendChild(option);

        });

    });

}


// ======================================================
// UPDATE DASHBOARD STUDENT DATA
// ======================================================

function updateDashboardStudentData() {

    const totalStudents =
        document.getElementById(
            "totalStudents"
        );


    if (totalStudents) {

        totalStudents.textContent =
            allStudents.length;

    }

}
// ======================================================
// ATTENDANCE MANAGEMENT
// ======================================================


// LOAD ATTENDANCE

async function loadAttendance() {

    try {

        const response =
            await fetch(
                `${API_URL}/attendance`
            );

        if (!response.ok) {

            throw new Error(
                "Failed to fetch attendance"
            );

        }

        allAttendance =
            await response.json();


        renderAttendance();

        updateAttendanceCounts();


    } catch (error) {

        console.error(
            "LOAD ATTENDANCE ERROR:",
            error
        );

        showToast(
            "Unable to load attendance",
            "error"
        );

    }

}


// ======================================================
// RENDER ATTENDANCE
// ======================================================

function renderAttendance() {

    const tableBody =
        document.getElementById("attendanceTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (!allStudents || allStudents.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">
                    No students found
                </td>
            </tr>
        `;

        return;
    }

    allStudents.forEach(student => {

        const attendanceRecord =
            allAttendance.find(record => {

                return (
                    record.studentId &&
                    record.studentId._id === student._id
                );

            });

        const status =
            attendanceRecord
                ? attendanceRecord.status
                : "Present";


        const statusClass =
            status === "Present"
                ? "present"
                : "absent";


        // Selected button class
        const presentActive =
            status === "Present"
                ? "active"
                : "";

        const absentActive =
            status === "Absent"
                ? "active"
                : "";


        tableBody.innerHTML += `

            <tr>

                <td>
                    <div class="table-student">

                        <div class="mini-avatar">
                            ${escapeHTML(
                                student.name
                                    ? student.name
                                        .charAt(0)
                                        .toUpperCase()
                                    : "S"
                            )}
                        </div>

                        <div>
                            <strong>
                                ${escapeHTML(student.name)}
                            </strong>

                            <small>
                                ${escapeHTML(student.department)}
                            </small>
                        </div>

                    </div>
                </td>


                <td>
                    ${escapeHTML(student.year)}
                </td>


                <td>

                    <span
                        class="attendance-status ${statusClass}">
                        ${status}
                    </span>

                </td>


                <td>

                    <button
                        class="attendance-btn ${presentActive}"
                        onclick="changeAttendance(
                            '${student._id}',
                            'Present'
                        )">
                        Present
                    </button>


                    <button
                        class="attendance-btn ${absentActive}"
                        onclick="changeAttendance(
                            '${student._id}',
                            'Absent'
                        )">
                        Absent
                    </button>

                </td>

            </tr>

        `;

    });

}
// ======================================================
// MARK ATTENDANCE
// ======================================================

async function markAttendance(
    studentId,
    status
) {

    await changeAttendance(
        studentId,
        status
    );

}


// ======================================================
// CHANGE ATTENDANCE
// ======================================================

async function changeAttendance(
    studentId,
    status
) {

    try {

        const response =
            await fetch(
                `${API_URL}/attendance/${studentId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: status
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Error updating attendance"
            );

        }


        showToast(
            `Attendance marked ${status}`
        );


        await loadAttendance();

        await loadDashboard();


    } catch (error) {

        console.error(
            "ATTENDANCE ERROR:",
            error
        );

        showToast(
            error.message ||
            "Error updating attendance",
            "error"
        );

    }

}


// ======================================================
// UPDATE ATTENDANCE COUNTS
// ======================================================

function updateAttendanceCounts() {

    let present = 0;

    let absent = 0;


    allStudents.forEach(student => {

        const record =
            allAttendance.find(item => {

                return (
                    item.studentId &&
                    item.studentId._id ===
                    student._id
                );

            });


        const status =
            record
                ? record.status
                : "Present";


        if (status === "Present") {

            present++;

        } else {

            absent++;

        }

    });


    const total =
        present + absent;


    const percentage =
        total > 0
            ? Math.round(
                (present / total) * 100
            )
            : 0;


    const overall =
        document.getElementById(
            "overallAttendance"
        );


    const progress =
        document.getElementById(
            "attendanceProgress"
        );


    const presentCount =
        document.getElementById(
            "presentCount"
        );


    const absentCount =
        document.getElementById(
            "absentCount"
        );


    if (overall) {

        overall.textContent =
            `${percentage}%`;

    }


    if (progress) {

        progress.style.width =
            `${percentage}%`;

    }


    if (presentCount) {

        presentCount.textContent =
            present;

    }


    if (absentCount) {

        absentCount.textContent =
            absent;

    }

}
// ======================================================
// MARKS MANAGEMENT
// ======================================================


// LOAD MARKS

async function loadMarks() {

    try {

        const response =
            await fetch(
                `${API_URL}/marks`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch marks"
            );

        }


        allMarks =
            await response.json();


        renderMarks();

        updateMarksSummary();


    } catch (error) {

        console.error(
            "LOAD MARKS ERROR:",
            error
        );

        showToast(
            "Unable to load marks",
            "error"
        );

    }

}


// ======================================================
// RENDER MARKS
// ======================================================

function renderMarks() {

    const tableBody =
        document.getElementById(
            "marksTableBody"
        );


    if (!tableBody) return;


    tableBody.innerHTML = "";


    if (
        !allMarks ||
        allMarks.length === 0
    ) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5"
                    style="text-align:center;">
                    No marks records found
                </td>
            </tr>
        `;

        return;

    }


    allMarks.forEach(record => {

        const student =
            record.studentId;


        const studentName =
            student
                ? student.name
                : "Unknown Student";


        const studentDepartment =
            student
                ? student.department
                : "";


        const grade =
            calculateGrade(
                Number(record.marks)
            );


        tableBody.innerHTML += `

            <tr>

                <td>

                    <div class="table-student">

                        <div class="mini-avatar">
                            ${escapeHTML(
                                studentName
                                    .charAt(0)
                                    .toUpperCase()
                            )}
                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(
                                    studentName
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    studentDepartment
                                )}
                            </small>

                        </div>

                    </div>

                </td>


                <td>
                    ${escapeHTML(
                        record.subject
                    )}
                </td>


                <td>
                    ${record.marks}
                </td>


                <td>

                    <span class="grade">
                        ${grade}
                    </span>

                </td>


                <td>

                    <button
                        class="action-btn"
                        onclick="
                            deleteMarks(
                                '${record._id}'
                            )
                        ">
                        Delete
                    </button>

                </td>

            </tr>

        `;

    });

}


// ======================================================
// CALCULATE GRADE
// ======================================================

function calculateGrade(marks) {

    if (marks >= 90) {

        return "A+";

    }

    if (marks >= 80) {

        return "A";

    }

    if (marks >= 70) {

        return "B";

    }

    if (marks >= 60) {

        return "C";

    }

    if (marks >= 50) {

        return "D";

    }

    return "F";

}


// ======================================================
// UPDATE MARKS SUMMARY
// ======================================================

function updateMarksSummary() {

    const total =
        allMarks.length;


    let totalMarks = 0;

    let passed = 0;


    allMarks.forEach(record => {

        const marks =
            Number(record.marks);


        totalMarks += marks;


        if (marks >= 50) {

            passed++;

        }

    });


    const average =
        total > 0
            ? Math.round(
                totalMarks / total
            )
            : 0;


    const passPercentage =
        total > 0
            ? Math.round(
                (passed / total) * 100
            )
            : 0;


    const totalElement =
        document.getElementById(
            "totalMarksRecords"
        );


    const averageElement =
        document.getElementById(
            "averageMarks"
        );


    const passElement =
        document.getElementById(
            "passPercentage"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (averageElement) {

        averageElement.textContent =
            average;

    }


    if (passElement) {

        passElement.textContent =
            `${passPercentage}%`;

    }

}


// ======================================================
// OLD FUNCTION NAME SUPPORT
// ======================================================

function updateMarksStatistics() {

    updateMarksSummary();

}


// ======================================================
// OPEN MARKS MODAL
// ======================================================

function openMarksModal() {

    const modal =
        document.getElementById(
            "marksModal"
        );


    if (modal) {

        modal.classList.add("show");

    }


    populateStudentSelects();

}


// ======================================================
// CLOSE MARKS MODAL
// ======================================================

function closeMarksModal() {

    const modal =
        document.getElementById(
            "marksModal"
        );


    if (modal) {

        modal.classList.remove("show");

    }


    const form =
        document.getElementById(
            "marksForm"
        );


    if (form) {

        form.reset();

    }

}


// ======================================================
// ADD MARKS
// ======================================================

async function addMarks(event) {

    event.preventDefault();


    const studentId =
        document.getElementById(
            "marksStudent"
        ).value;


    const subject =
        document.getElementById(
            "marksSubject"
        ).value.trim();


    const marks =
        Number(
            document.getElementById(
                "marksValue"
            ).value
        );


    if (!studentId) {

        showToast(
            "Please select a student",
            "error"
        );

        return;

    }


    if (!subject) {

        showToast(
            "Please enter subject",
            "error"
        );

        return;

    }


    if (
        isNaN(marks) ||
        marks < 0 ||
        marks > 100
    ) {

        showToast(
            "Marks must be between 0 and 100",
            "error"
        );

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/marks`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        studentId:
                            studentId,

                        subject:
                            subject,

                        marks:
                            marks

                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Error adding marks"
            );

        }


        showToast(
            "Marks added successfully"
        );


        closeMarksModal();


        await loadMarks();


        // Refresh student dropdowns
        populateStudentSelects();


    } catch (error) {

        console.error(
            "ADD MARKS ERROR:",
            error
        );

        showToast(
            error.message ||
            "Error adding marks",
            "error"
        );

    }

}


// ======================================================
// DELETE MARKS
// ======================================================

async function deleteMarks(markId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this marks record?"
        );


    if (!confirmed) return;


    try {

        const response =
            await fetch(
                `${API_URL}/marks/${markId}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Error deleting marks"
            );

        }


        showToast(
            "Marks deleted successfully"
        );


        await loadMarks();


    } catch (error) {

        console.error(
            "DELETE MARKS ERROR:",
            error
        );

        showToast(
            error.message ||
            "Error deleting marks",
            "error"
        );

    }

}
// ======================================================
// COURSES MANAGEMENT
// ======================================================

async function loadCourses() {
    try {
        const response = await fetch(`${API_URL}/courses`);

        if (!response.ok) {
            throw new Error("Failed to fetch courses");
        }

        allCourses = await response.json();

        renderCourses();
        updateCourseCount();

    } catch (error) {
        console.error("LOAD COURSES ERROR:", error);
        showToast("Unable to load courses", "error");
    }
}


// ======================================================
// RENDER COURSES
// ======================================================

function renderCourses() {

    const courseGrid = document.getElementById("courseGrid");

    if (!courseGrid) return;

    courseGrid.innerHTML = "";

    if (!allCourses || allCourses.length === 0) {

        courseGrid.innerHTML = `
            <div style="text-align:center; padding:30px;">
                <h3>No courses found</h3>
                <p>Add a new course to get started.</p>
            </div>
        `;

        return;
    }


    allCourses.forEach(course => {

        courseGrid.innerHTML += `
            <div class="course-card">

                <div class="course-icon">
                    ${escapeHTML(course.icon || "📚")}
                </div>

                <div class="course-info">

                    <h3>
                        ${escapeHTML(course.name)}
                    </h3>

                    <p>
                        Department:
                        ${escapeHTML(course.department)}
                    </p>

                    <p>
                        Students:
                        <strong>
                            ${course.students || 0}
                        </strong>
                    </p>

                </div>

                <div class="course-actions">

                    <button
                        class="action-btn"
                        onclick="deleteCourse('${course._id}')">
                        Delete
                    </button>

                </div>

            </div>
        `;
    });
}


// ======================================================
// OPEN COURSE MODAL
// ======================================================

function openCourseModal() {

    const modal = document.getElementById("courseModal");

    if (modal) {
        modal.classList.add("show");
    }

}


// ======================================================
// CLOSE COURSE MODAL
// ======================================================

function closeCourseModal() {

    const modal = document.getElementById("courseModal");

    if (modal) {
        modal.classList.remove("show");
    }

    const form = document.querySelector("#courseModal form");

    if (form) {
        form.reset();
    }

}


// ======================================================
// ADD COURSE
// ======================================================

async function addCourse(event) {

    event.preventDefault();


    const nameElement =
        document.getElementById("courseName");

    const departmentElement =
        document.getElementById("courseDepartment");

    const studentsElement =
        document.getElementById("courseStudents");


    const name =
        nameElement ? nameElement.value.trim() : "";

    const department =
        departmentElement ? departmentElement.value.trim() : "";

    const students =
        studentsElement
            ? Number(studentsElement.value)
            : 0;


    if (!name) {

        showToast("Please enter course name", "error");

        return;
    }


    if (!department) {

        showToast("Please enter department", "error");

        return;
    }


    if (isNaN(students) || students < 0) {

        showToast(
            "Student count cannot be negative",
            "error"
        );

        return;
    }


    try {

        const response = await fetch(`${API_URL}/courses`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                name: name,

                department: department,

                students: students

            })

        });


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || "Error adding course"
            );

        }


        showToast("Course added successfully");


        closeCourseModal();


        await loadCourses();


        await loadDashboard();


    } catch (error) {

        console.error(
            "ADD COURSE ERROR:",
            error
        );

        showToast(
            error.message || "Error adding course",
            "error"
        );

    }

}


// ======================================================
// DELETE COURSE
// ======================================================

async function deleteCourse(courseId) {

    const course =
        allCourses.find(
            item => item._id === courseId
        );


    const courseName =
        course
            ? course.name
            : "this course";


    const confirmed =
        confirm(
            `Are you sure you want to delete ${courseName}?`
        );


    if (!confirmed) return;


    try {

        const response =
            await fetch(
                `${API_URL}/courses/${courseId}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Error deleting course"
            );

        }


        showToast(
            "Course deleted successfully"
        );


        await loadCourses();


        await loadDashboard();


    } catch (error) {

        console.error(
            "DELETE COURSE ERROR:",
            error
        );


        showToast(
            error.message ||
            "Error deleting course",
            "error"
        );

    }

}


// ======================================================
// UPDATE COURSE COUNT
// ======================================================

function updateCourseCount() {

    const courseCount =
        document.getElementById(
            "dashboardCourses"
        );


    if (courseCount) {

        courseCount.textContent =
            allCourses.length;

    }

}
// ======================================================
// FEES MANAGEMENT
// ======================================================

async function loadFees() {
    try {
        const response = await fetch(`${API_URL}/fees`);

        if (!response.ok) {
            throw new Error("Failed to fetch fees");
        }

        allFees = await response.json();

        renderFees();
        updateFeesSummary();

    } catch (error) {
        console.error("LOAD FEES ERROR:", error);
        showToast("Unable to load fees", "error");
    }
}


// ======================================================
// RENDER FEES
// ======================================================

function renderFees() {

    const tableBody =
        document.getElementById("feesTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (!allFees || allFees.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No fee records found
                </td>
            </tr>
        `;

        return;
    }


    allFees.forEach(fee => {

        const student = fee.studentId;

        const studentName =
            student
                ? student.name
                : "Unknown Student";


        const statusClass =
            fee.status === "Paid"
                ? "present"
                : "absent";


        tableBody.innerHTML += `

            <tr>

                <td>
                    <div class="table-student">

                        <div class="mini-avatar">
                            ${escapeHTML(
                                studentName
                                    .charAt(0)
                                    .toUpperCase()
                            )}
                        </div>

                        <div>
                            <strong>
                                ${escapeHTML(studentName)}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    fee.course || ""
                                )}
                            </small>
                        </div>

                    </div>
                </td>


                <td>
                    ${escapeHTML(
                        fee.course || ""
                    )}
                </td>


                <td>
                    ₹${Number(fee.amount || 0).toLocaleString("en-IN")}
                </td>


                <td>
                    <span class="attendance-status ${statusClass}">
                        ${escapeHTML(fee.status)}
                    </span>
                </td>


                <td>

                    <button
                        class="action-btn"
                        onclick="deleteFee('${fee._id}')">

                        Delete

                    </button>

                </td>

            </tr>

        `;
    });
}


// ======================================================
// OPEN FEE MODAL
// ======================================================

function openFeeModal() {

    const modal =
        document.getElementById("feeModal");

    if (modal) {
        modal.classList.add("show");
    }

    populateStudentSelects();
}


// ======================================================
// CLOSE FEE MODAL
// ======================================================

function closeFeeModal() {

    const modal =
        document.getElementById("feeModal");

    if (modal) {
        modal.classList.remove("show");
    }


    const form =
        document.querySelector("#feeModal form");

    if (form) {
        form.reset();
    }
}


// ======================================================
// ADD FEE
// ======================================================

async function addFee(event) {

    event.preventDefault();


    const studentId =
        document.getElementById("feeStudent").value;


    const course =
        document.getElementById("feeCourse").value.trim();


    const amount =
        Number(
            document.getElementById("feeAmount").value
        );


    const status =
        document.getElementById("feeStatus").value;


    if (!studentId) {

        showToast(
            "Please select a student",
            "error"
        );

        return;
    }


    if (!course) {

        showToast(
            "Please enter course",
            "error"
        );

        return;
    }


    if (
        isNaN(amount) ||
        amount <= 0
    ) {

        showToast(
            "Please enter a valid amount",
            "error"
        );

        return;
    }


    if (!status) {

        showToast(
            "Please select fee status",
            "error"
        );

        return;
    }


    try {

        const response =
            await fetch(`${API_URL}/fees`, {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    studentId: studentId,

                    course: course,

                    amount: amount,

                    status: status

                })

            });


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Error adding fee"
            );

        }


        showToast(
            "Fee record added successfully"
        );


        closeFeeModal();


        await loadFees();


        await loadDashboard();


    } catch (error) {

        console.error(
            "ADD FEE ERROR:",
            error
        );


        showToast(
            error.message ||
            "Error adding fee",
            "error"
        );

    }
}


// ======================================================
// DELETE FEE
// ======================================================

async function deleteFee(feeId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this fee record?"
        );


    if (!confirmed) return;


    try {

        const response =
            await fetch(
                `${API_URL}/fees/${feeId}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Error deleting fee"
            );

        }


        showToast(
            "Fee record deleted successfully"
        );


        await loadFees();


        await loadDashboard();


    } catch (error) {

        console.error(
            "DELETE FEE ERROR:",
            error
        );


        showToast(
            error.message ||
            "Error deleting fee",
            "error"
        );

    }
}


// ======================================================
// FEES SUMMARY
// ======================================================

function updateFeesSummary() {

    let collected = 0;
    let pending = 0;


    allFees.forEach(fee => {

        const amount =
            Number(fee.amount || 0);


        if (fee.status === "Paid") {

            collected += amount;

        } else {

            pending += amount;

        }

    });


    const collectedElement =
        document.getElementById("feesCollected");


    const pendingElement =
        document.getElementById("feesPending");


    if (collectedElement) {

        collectedElement.textContent =
            `₹${collected.toLocaleString("en-IN")}`;

    }


    if (pendingElement) {

        pendingElement.textContent =
            `₹${pending.toLocaleString("en-IN")}`;

    }

}
// ======================================================
// TIMETABLE MANAGEMENT
// ======================================================

async function loadTimetable() {
    try {
        const response = await fetch(`${API_URL}/timetable`);

        if (!response.ok) {
            throw new Error("Failed to fetch timetable");
        }

        allTimetable = await response.json();

        renderTimetable();

    } catch (error) {
        console.error("LOAD TIMETABLE ERROR:", error);
        showToast("Unable to load timetable", "error");
    }
}


// ======================================================
// RENDER TIMETABLE
// ======================================================

function renderTimetable() {

    const tableBody =
        document.getElementById("timetableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (!allTimetable || allTimetable.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">
                    No timetable records found
                </td>
            </tr>
        `;

        return;
    }


    allTimetable.forEach(item => {

        tableBody.innerHTML += `
            <tr>

                <td>
                    <strong>
                        ${escapeHTML(item.time)}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(item.day)}
                </td>

                <td>
                    ${escapeHTML(item.subject)}
                </td>

                <td>

                    <button
                        class="action-btn"
                        onclick="deleteTimetable('${item._id}')">

                        Delete

                    </button>

                </td>

            </tr>
        `;
    });
}


// ======================================================
// OPEN TIMETABLE MODAL
// ======================================================

function openTimetableModal() {

    const modal =
        document.getElementById("timetableModal");

    if (modal) {
        modal.classList.add("show");
    }
}


// ======================================================
// CLOSE TIMETABLE MODAL
// ======================================================

function closeTimetableModal() {

    const modal =
        document.getElementById("timetableModal");

    if (modal) {
        modal.classList.remove("show");
    }


    const form =
        document.querySelector("#timetableModal form");

    if (form) {
        form.reset();
    }
}


// ======================================================
// ADD TIMETABLE
// ======================================================

async function addTimetable(event) {

    event.preventDefault();


    const time =
        document.getElementById("timeSlot").value.trim();


    const day =
        document.getElementById("timetableDay").value;


    const subject =
        document.getElementById("timetableSubject").value.trim();


    if (!time) {

        showToast(
            "Please enter time slot",
            "error"
        );

        return;
    }


    if (!day) {

        showToast(
            "Please select a day",
            "error"
        );

        return;
    }


    if (!subject) {

        showToast(
            "Please enter subject",
            "error"
        );

        return;
    }


    try {

        const response =
            await fetch(`${API_URL}/timetable`, {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    time: time,

                    day: day,

                    subject: subject

                })

            });


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Error adding timetable"
            );

        }


        showToast(
            "Timetable added successfully"
        );


        closeTimetableModal();


        await loadTimetable();


    } catch (error) {

        console.error(
            "ADD TIMETABLE ERROR:",
            error
        );


        showToast(
            error.message ||
            "Error adding timetable",
            "error"
        );

    }
}


// ======================================================
// DELETE TIMETABLE
// ======================================================

async function deleteTimetable(timetableId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this timetable record?"
        );


    if (!confirmed) return;


    try {

        const response =
            await fetch(
                `${API_URL}/timetable/${timetableId}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Error deleting timetable"
            );

        }


        showToast(
            "Timetable deleted successfully"
        );


        await loadTimetable();


    } catch (error) {

        console.error(
            "DELETE TIMETABLE ERROR:",
            error
        );


        showToast(
            error.message ||
            "Error deleting timetable",
            "error"
        );

    }
}
// ======================================================
// EVENTS MANAGEMENT
// ======================================================

async function loadEvents() {
    try {
        const response = await fetch(`${API_URL}/events`);

        if (!response.ok) {
            throw new Error("Failed to fetch events");
        }

        allEvents = await response.json();

        renderEvents();

    } catch (error) {
        console.error("LOAD EVENTS ERROR:", error);
        showToast("Unable to load events", "error");
    }
}


// ======================================================
// RENDER EVENTS
// ======================================================

function renderEvents() {

    const eventGrid =
        document.getElementById("eventGrid");

    if (!eventGrid) return;

    eventGrid.innerHTML = "";

    if (!allEvents || allEvents.length === 0) {

        eventGrid.innerHTML = `
            <div style="text-align:center; padding:30px;">
                <h3>No events found</h3>
                <p>Add a new event to get started.</p>
            </div>
        `;

        return;
    }


    allEvents.forEach(event => {

        const eventDate = event.date
            ? new Date(event.date)
            : null;

        const day = eventDate
            ? eventDate.getDate()
            : "";

        const month = eventDate
            ? eventDate.toLocaleString("en-US", {
                month: "short"
            })
            : "";


        eventGrid.innerHTML += `
            <div class="large-event-card">

                <div class="date-box">

                    <strong>
                        ${day}
                    </strong>

                    <span>
                        ${month}
                    </span>

                </div>


                <div class="event-content">

                    <h3>
                        ${escapeHTML(event.name)}
                    </h3>

                    <p>
                        Type:
                        ${escapeHTML(event.type || "Event")}
                    </p>

                    <p>
                        📍
                        ${escapeHTML(event.location || "Not specified")}
                    </p>

                    <p>
                        Registered:
                        <strong>
                            ${event.registered || 0}
                        </strong>
                    </p>

                </div>


                <div class="event-actions">

                    <button
                        class="action-btn"
                        onclick="deleteEvent('${event._id}')">

                        Delete

                    </button>

                </div>

            </div>
        `;
    });
}


// ======================================================
// OPEN EVENT MODAL
// ======================================================

function openEventModal() {

    const modal =
        document.getElementById("eventModal");

    if (modal) {
        modal.classList.add("show");
    }
}


// ======================================================
// CLOSE EVENT MODAL
// ======================================================

function closeEventModal() {

    const modal =
        document.getElementById("eventModal");

    if (modal) {
        modal.classList.remove("show");
    }


    const form =
        document.querySelector("#eventModal form");

    if (form) {
        form.reset();
    }
}


// ======================================================
// ADD EVENT
// ======================================================

async function addEvent(event) {

    event.preventDefault();


    const name =
        document.getElementById("eventName").value.trim();


    const type =
        document.getElementById("eventType").value.trim();


    const date =
        document.getElementById("eventDate").value;


    const location =
        document.getElementById("eventLocation").value.trim();


    if (!name) {

        showToast(
            "Please enter event name",
            "error"
        );

        return;
    }


    if (!type) {

        showToast(
            "Please enter event type",
            "error"
        );

        return;
    }


    if (!date) {

        showToast(
            "Please select event date",
            "error"
        );

        return;
    }


    if (!location) {

        showToast(
            "Please enter event location",
            "error"
        );

        return;
    }


    try {

        const response =
            await fetch(`${API_URL}/events`, {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    name: name,

                    type: type,

                    date: date,

                    location: location

                })

            });


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Error adding event"
            );

        }


        showToast(
            "Event added successfully"
        );


        closeEventModal();


        await loadEvents();


        await loadDashboard();


    } catch (error) {

        console.error(
            "ADD EVENT ERROR:",
            error
        );


        showToast(
            error.message ||
            "Error adding event",
            "error"
        );

    }
}


// ======================================================
// DELETE EVENT
// ======================================================

async function deleteEvent(eventId) {

    const event =
        allEvents.find(
            item => item._id === eventId
        );


    const eventName =
        event
            ? event.name
            : "this event";


    const confirmed =
        confirm(
            `Are you sure you want to delete ${eventName}?`
        );


    if (!confirmed) return;


    try {

        const response =
            await fetch(
                `${API_URL}/events/${eventId}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Error deleting event"
            );

        }


        showToast(
            "Event deleted successfully"
        );


        await loadEvents();


        await loadDashboard();


    } catch (error) {

        console.error(
            "DELETE EVENT ERROR:",
            error
        );


        showToast(
            error.message ||
            "Error deleting event",
            "error"
        );

    }
}
// ======================================================
// PROFILE MANAGEMENT
// ======================================================

async function loadProfile() {
    try {
        const response = await fetch(`${API_URL}/profile`);

        if (!response.ok) {
            throw new Error("Failed to fetch profile");
        }

        const data = await response.json();

        const profileName =
            document.getElementById("profileName");

        const profileRole =
            document.getElementById("profileRole");

        const profileEmail =
            document.getElementById("profileEmail");

        const profileDepartment =
            document.getElementById("profileDepartment");

        if (profileName) {
            profileName.textContent =
                data.name || "Admin";
        }

        if (profileRole) {
            profileRole.textContent =
                data.role || "Administrator";
        }

        if (profileEmail) {
            profileEmail.textContent =
                data.email || "";
        }

        if (profileDepartment) {
            profileDepartment.textContent =
                data.department || "";
        }

    } catch (error) {

        console.error(
            "LOAD PROFILE ERROR:",
            error
        );

        showToast(
            "Unable to load profile",
            "error"
        );
    }
}


// ======================================================
// OPEN PROFILE MODAL
// ======================================================

function openProfileModal() {

    const modal =
        document.getElementById("profileModal");

    if (modal) {
        modal.classList.add("show");
    }


    loadProfileIntoForm();
}


// ======================================================
// CLOSE PROFILE MODAL
// ======================================================

function closeProfileModal() {

    const modal =
        document.getElementById("profileModal");

    if (modal) {
        modal.classList.remove("show");
    }
}


// ======================================================
// LOAD PROFILE INTO FORM
// ======================================================

async function loadProfileIntoForm() {

    try {

        const response =
            await fetch(`${API_URL}/profile`);

        if (!response.ok) {
            throw new Error("Failed to fetch profile");
        }

        const data =
            await response.json();


        const nameInput =
            document.getElementById(
                "profileNameInput"
            );

        const emailInput =
            document.getElementById(
                "profileEmailInput"
            );

        const departmentInput =
            document.getElementById(
                "profileDepartmentInput"
            );


        if (nameInput) {
            nameInput.value =
                data.name || "";
        }

        if (emailInput) {
            emailInput.value =
                data.email || "";
        }

        if (departmentInput) {
            departmentInput.value =
                data.department || "";
        }

    } catch (error) {

        console.error(
            "PROFILE FORM ERROR:",
            error
        );
    }
}


// ======================================================
// UPDATE PROFILE
// ======================================================

async function updateProfile(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "profileNameInput"
        ).value.trim();


    const email =
        document.getElementById(
            "profileEmailInput"
        ).value.trim();


    const department =
        document.getElementById(
            "profileDepartmentInput"
        ).value.trim();


    if (!name) {

        showToast(
            "Please enter your name",
            "error"
        );

        return;
    }


    if (!email) {

        showToast(
            "Please enter your email",
            "error"
        );

        return;
    }


    if (!department) {

        showToast(
            "Please enter your department",
            "error"
        );

        return;
    }


    try {

        const response =
            await fetch(`${API_URL}/profile`, {

                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    name: name,

                    email: email,

                    department: department

                })

            });


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Error updating profile"
            );
        }


        showToast(
            "Profile updated successfully"
        );


        closeProfileModal();


        await loadProfile();


    } catch (error) {

        console.error(
            "UPDATE PROFILE ERROR:",
            error
        );


        showToast(
            error.message ||
            "Error updating profile",
            "error"
        );
    }
}


// ======================================================
// SETTINGS MANAGEMENT
// ======================================================

async function loadSettings() {

    try {

        const response =
            await fetch(`${API_URL}/settings`);


        if (!response.ok) {
            throw new Error(
                "Failed to fetch settings"
            );
        }


        const data =
            await response.json();


        const notificationToggle =
            document.getElementById(
                "notificationToggle"
            );


        const emailToggle =
            document.getElementById(
                "emailToggle"
            );


        if (notificationToggle) {

            notificationToggle.checked =
                data.notifications !== false;

        }


        if (emailToggle) {

            emailToggle.checked =
                data.emailAlerts !== false;

        }


    } catch (error) {

        console.error(
            "LOAD SETTINGS ERROR:",
            error
        );


        showToast(
            "Unable to load settings",
            "error"
        );
    }
}


// ======================================================
// SAVE SETTINGS
// ======================================================

async function saveSettings() {

    const notificationToggle =
        document.getElementById(
            "notificationToggle"
        );


    const emailToggle =
        document.getElementById(
            "emailToggle"
        );


    const notifications =
        notificationToggle
            ? notificationToggle.checked
            : true;


    const emailAlerts =
        emailToggle
            ? emailToggle.checked
            : true;


    try {

        const response =
            await fetch(`${API_URL}/settings`, {

                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    notifications:
                        notifications,

                    emailAlerts:
                        emailAlerts

                })

            });


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Error saving settings"
            );
        }


        showToast(
            "Settings saved successfully"
        );


    } catch (error) {

        console.error(
            "SAVE SETTINGS ERROR:",
            error
        );


        showToast(
            error.message ||
            "Error saving settings",
            "error"
        );
    }
}
// ======================================================
// DASHBOARD MANAGEMENT
// ======================================================

async function loadDashboard() {

    try {

        const response =
            await fetch(`${API_URL}/dashboard`);

        if (!response.ok) {
            throw new Error("Failed to load dashboard");
        }

        const data =
            await response.json();


        // -------------------------------
        // DASHBOARD COUNTS
        // -------------------------------

        const totalStudents =
            document.getElementById("totalStudents");

        const dashboardPresent =
            document.getElementById("dashboardPresent");

        const dashboardCourses =
            document.getElementById("dashboardCourses");

        const dashboardFees =
            document.getElementById("dashboardFees");


        if (totalStudents) {
            totalStudents.textContent =
                data.totalStudents ?? 0;
        }


        if (dashboardPresent) {
            dashboardPresent.textContent =
                data.presentCount ?? 0;
        }


        if (dashboardCourses) {
            dashboardCourses.textContent =
                data.totalCourses ?? 0;
        }


        if (dashboardFees) {

            dashboardFees.textContent =
                `₹${Number(
                    data.feesCollected || 0
                ).toLocaleString("en-IN")}`;

        }


        // -------------------------------
        // RECENT STUDENTS
        // -------------------------------

        await loadRecentStudents();


        // -------------------------------
        // DASHBOARD EVENTS
        // -------------------------------

        await loadDashboardEvents();


    } catch (error) {

        console.error(
            "LOAD DASHBOARD ERROR:",
            error
        );

        showToast(
            "Unable to load dashboard",
            "error"
        );
    }
}


// ======================================================
// RECENT STUDENTS
// ======================================================

async function loadRecentStudents() {

    const container =
        document.getElementById(
            "recentStudents"
        );

    if (!container) return;


    try {

        const response =
            await fetch(`${API_URL}/students`);

        if (!response.ok) {
            throw new Error(
                "Failed to load students"
            );
        }


        const students =
            await response.json();


        if (!students || students.length === 0) {

            container.innerHTML = `
                <p style="text-align:center;">
                    No students found
                </p>
            `;

            return;
        }


        const recent =
            students.slice(-5).reverse();


        container.innerHTML = "";


        recent.forEach(student => {

            container.innerHTML += `

                <div class="student-row">

                    <div class="mini-avatar">
                        ${escapeHTML(
                            student.name
                                ? student.name
                                    .charAt(0)
                                    .toUpperCase()
                                : "S"
                        )}
                    </div>

                    <div>
                        <strong>
                            ${escapeHTML(
                                student.name
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                student.department
                            )}
                        </small>
                    </div>

                </div>

            `;
        });


    } catch (error) {

        console.error(
            "RECENT STUDENTS ERROR:",
            error
        );

    }
}


// ======================================================
// DASHBOARD EVENTS
// ======================================================

async function loadDashboardEvents() {

    const container =
        document.getElementById(
            "dashboardEvents"
        );

    if (!container) return;


    try {

        const response =
            await fetch(`${API_URL}/events`);

        if (!response.ok) {
            throw new Error(
                "Failed to load events"
            );
        }


        const events =
            await response.json();


        if (!events || events.length === 0) {

            container.innerHTML = `
                <p style="text-align:center;">
                    No upcoming events
                </p>
            `;

            return;
        }


        const recentEvents =
            events.slice(-4).reverse();


        container.innerHTML = "";


        recentEvents.forEach(event => {

            const eventDate =
                event.date
                    ? new Date(event.date)
                    : null;


            const day =
                eventDate
                    ? eventDate.getDate()
                    : "";


            const month =
                eventDate
                    ? eventDate.toLocaleString(
                        "en-US",
                        {
                            month: "short"
                        }
                    )
                    : "";


            container.innerHTML += `

                <div class="event-item">

                    <div class="date-box">

                        <strong>
                            ${day}
                        </strong>

                        <span>
                            ${month}
                        </span>

                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(
                                event.name
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                event.location || ""
                            )}
                        </small>

                    </div>

                </div>

            `;
        });


    } catch (error) {

        console.error(
            "DASHBOARD EVENTS ERROR:",
            error
        );

    }
}


// ======================================================
// GLOBAL SEARCH
// ======================================================

function globalSearch() {

    const searchInput =
        document.getElementById(
            "globalSearch"
        );


    if (!searchInput) return;


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    if (!searchText) return;


    const studentMatch =
        allStudents.find(student =>

            student.name
                .toLowerCase()
                .includes(searchText)

            ||

            student.department
                .toLowerCase()
                .includes(searchText)

            ||

            student.email
                .toLowerCase()
                .includes(searchText)

        );


    if (studentMatch) {

        showPage("students");


        const studentSearch =
            document.getElementById(
                "studentSearch"
            );


        if (studentSearch) {

            studentSearch.value =
                searchText;

            searchStudents();

        }


        return;
    }


    const courseMatch =
        allCourses.find(course =>

            course.name
                .toLowerCase()
                .includes(searchText)

            ||

            course.department
                .toLowerCase()
                .includes(searchText)

        );


    if (courseMatch) {

        showPage("courses");

        return;
    }


    const eventMatch =
        allEvents.find(event =>

            event.name
                .toLowerCase()
                .includes(searchText)

            ||

            event.type
                .toLowerCase()
                .includes(searchText)

        );


    if (eventMatch) {

        showPage("events");

        return;
    }


    showToast(
        "No matching result found",
        "error"
    );
}


// ======================================================
// DARK MODE
// ======================================================

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark-mode"
    );


    const isDark =
        document.body.classList.contains(
            "dark-mode"
        );


    localStorage.setItem(
        "darkMode",
        isDark ? "true" : "false"
    );
}


// ======================================================
// LOAD DARK MODE
// ======================================================

function loadDarkMode() {

    const savedMode =
        localStorage.getItem(
            "darkMode"
        );


    if (savedMode === "true") {

        document.body.classList.add(
            "dark-mode"
        );


        const toggle =
            document.getElementById(
                "darkToggle"
            );


        if (toggle) {
            toggle.checked = true;
        }
    }
}


// ======================================================
// NOTIFICATIONS
// ======================================================

function showNotifications() {

    showToast(
        "You have new notifications"
    );
}


// ======================================================
// LOGOUT
// ======================================================

function logout() {

    const confirmed =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmed) return;


    localStorage.removeItem(
        "isLoggedIn"
    );


    window.location.href =
        "login.html";
}


// ======================================================
// TOAST MESSAGE
// ======================================================

function showToast(
    message,
    type = "success"
) {

    const toast =
        document.getElementById("toast");


    const toastText =
        document.getElementById(
            "toastText"
        );


    if (!toast || !toastText) return;


    toastText.textContent =
        message;


    toast.classList.remove(
        "success",
        "error",
        "show"
    );


    toast.classList.add(
        type
    );


    setTimeout(() => {

        toast.classList.add(
            "show"
        );

    }, 10);


    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 3000);
}


// ======================================================
// STUDENT SEARCH EVENTS
// ======================================================

const studentSearchInput =
    document.getElementById(
        "studentSearch"
    );


if (studentSearchInput) {

    studentSearchInput.addEventListener(
        "input",
        searchStudents
    );
}


// ======================================================
// DEPARTMENT FILTER
// ======================================================

const departmentFilter =
    document.getElementById(
        "departmentFilter"
    );


if (departmentFilter) {

    departmentFilter.addEventListener(
        "change",
        filterByDepartment
    );
}


// ======================================================
// GLOBAL SEARCH ENTER KEY
// ======================================================

const globalSearchInput =
    document.getElementById(
        "globalSearch"
    );


if (globalSearchInput) {

    globalSearchInput.addEventListener(
        "keypress",
        function(event) {

            if (event.key === "Enter") {

                globalSearch();

            }

        }
    );
}


// ======================================================
// LOAD EVERYTHING WHEN PAGE OPENS
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        loadDarkMode();

        await loadStudents();

        await loadAttendance();

        await loadMarks();

        await loadCourses();

        await loadFees();

        await loadTimetable();

        await loadEvents();

        await loadProfile();

        await loadSettings();

        await loadDashboard();

    }
);