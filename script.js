// ParentTeacher Connect
// Student Code: DAS-SCH-002
// Frontend demonstration - no database required.

// Load saved data or create sample records.
function loadData(key, initialData) {
    const saved = localStorage.getItem(key);

    if (saved === null) {
        return initialData;
    }

    try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : initialData;
    } catch {
        return initialData;
    }
}

const parents = loadData("ptc_parents", [
    {
        id: 1,
        name: "Priya Sharma",
        email: "priya@example.com",
        phone: "9876543210",
        child: "Rahul Sharma"
    }
]);

const teachers = loadData("ptc_teachers", [
    {
        id: 1,
        name: "Suresh Kumar",
        email: "suresh@school.edu",
        subject: "Mathematics",
        className: "5-A"
    }
]);

const students = loadData("ptc_students", [
    {
        id: 1,
        name: "Rahul Sharma",
        className: "5-A",
        marks: 88,
        attendance: 95
    },
    {
        id: 2,
        name: "Riya Patel",
        className: "5-B",
        marks: 76,
        attendance: 90
    },
    {
        id: 3,
        name: "Arun Kumar",
        className: "5-A",
        marks: 92,
        attendance: 98
    }
]);

const messages = loadData("ptc_messages", [
    {
        id: 1,
        sender: "Priya Sharma",
        receiver: "Suresh Kumar",
        subject: "Academic Progress",
        body: "Could we discuss Rahul's academic performance?",
        date: new Date().toLocaleString()
    }
]);

const grades = loadData("ptc_grades", [
    {
        id: 1,
        student: "Rahul Sharma",
        subject: "Mathematics",
        marks: 88
    }
]);

const attendanceRecords = loadData("ptc_attendance", [
    {
        id: 1,
        student: "Rahul Sharma",
        date: new Date().toISOString().slice(0, 10),
        status: "Present"
    }
]);

const fees = loadData("ptc_fees", [
    {
        id: 1,
        student: "Rahul Sharma",
        type: "Tuition Fee",
        amount: 5000,
        status: "Pending"
    }
]);

const events = loadData("ptc_events", [
    {
        id: 1,
        title: "Parent-Teacher Meeting",
        date: new Date().toISOString().slice(0, 10),
        description: "Discuss student progress and development."
    }
]);

const meetings = loadData("ptc_meetings", [
    {
        id: 1,
        parent: "Priya Sharma",
        teacher: "Suresh Kumar",
        date: new Date().toISOString().slice(0, 10),
        time: "10:00",
        agenda: "Discuss academic progress."
    }
]);

// Save all data in the browser.
function saveData() {
    localStorage.setItem("ptc_parents", JSON.stringify(parents));
    localStorage.setItem("ptc_teachers", JSON.stringify(teachers));
    localStorage.setItem("ptc_students", JSON.stringify(students));
    localStorage.setItem("ptc_messages", JSON.stringify(messages));
    localStorage.setItem("ptc_grades", JSON.stringify(grades));
    localStorage.setItem("ptc_attendance", JSON.stringify(attendanceRecords));
    localStorage.setItem("ptc_fees", JSON.stringify(fees));
    localStorage.setItem("ptc_events", JSON.stringify(events));
    localStorage.setItem("ptc_meetings", JSON.stringify(meetings));
}

// Generate unique IDs.
function nextId(records) {
    return records.reduce((max, record) => Math.max(max, record.id), 0) + 1;
}

// Safely display user-entered text.
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Create table rows.
function renderTable(elementId, records, columns, deleteAction) {
    const table = document.getElementById(elementId);

    table.innerHTML = records.map(record => {
        const cells = columns.map(column => {
            const value = typeof column.value === "function"
                ? column.value(record)
                : record[column.value];

            return `<td>${escapeHTML(value)}</td>`;
        }).join("");

        const action = deleteAction
            ? `<td><button class="btn-delete"
                 data-delete="${deleteAction}"
                 data-id="${record.id}">Delete</button></td>`
            : "";

        return `<tr>${cells}${action}</tr>`;
    }).join("");

    if (records.length === 0) {
        table.innerHTML =
            `<tr><td colspan="${columns.length + (deleteAction ? 1 : 0)}">
            No records found.</td></tr>`;
    }
}

// Render parent records.
function renderParents() {
    renderTable("parentTable", parents, [
        { value: "name" },
        { value: "email" },
        { value: "phone" },
        { value: "child" }
    ], "parent");
}

// Render teacher records.
function renderTeachers() {
    renderTable("teacherTable", teachers, [
        { value: "name" },
        { value: "email" },
        { value: "subject" },
        { value: "className" }
    ], "teacher");
}

// Render students.
function renderStudents() {
    renderTable("studentTable", students, [
        { value: "name" },
        { value: "className" },
        { value: student => `${student.marks}%` },
        { value: student => `${student.attendance}%` },
        {
            value: student =>
                student.marks >= 85 ? "Excellent" :
                student.marks >= 60 ? "Good" : "Needs Improvement"
        }
    ]);
}

// Render messages.
function renderMessages() {
    const list = document.getElementById("messageList");

    list.innerHTML = messages.map(message => `
        <article class="message-card">
            <h3>${escapeHTML(message.subject)}</h3>
            <p><strong>From:</strong> ${escapeHTML(message.sender)}</p>
            <p><strong>To:</strong> ${escapeHTML(message.receiver)}</p>
            <p>${escapeHTML(message.body)}</p>
            <p><small>${escapeHTML(message.date)}</small></p>
            <button class="btn-delete"
                data-delete="message"
                data-id="${message.id}">Delete</button>
        </article>
    `).join("") || '<p class="empty-state">No messages yet.</p>';
}

// Render grades.
function renderGrades() {
    renderTable("gradeTable", grades, [
        { value: "student" },
        { value: "subject" },
        { value: record => `${record.marks}/100` },
        {
            value: record =>
                record.marks >= 90 ? "A+" :
                record.marks >= 80 ? "A" :
                record.marks >= 70 ? "B" :
                record.marks >= 60 ? "C" : "Needs Improvement"
        }
    ], "grade");
}

// Render attendance.
function renderAttendance() {
    renderTable("attendanceTable", attendanceRecords, [
        { value: "student" },
        { value: "date" },
        { value: "status" }
    ], "attendance");
}

// Render fee records.
function renderFees() {
    renderTable("feeTable", fees, [
        { value: "student" },
        { value: "type" },
        { value: fee => `₹${Number(fee.amount).toLocaleString("en-IN")}` },
        {
            value: fee => fee.status,
        }
    ], "fee");
}

// Render events.
function renderEvents() {
    const list = document.getElementById("eventList");

    list.innerHTML = events.map(event => `
        <article class="event-card">
            <h3>${escapeHTML(event.title)}</h3>
            <p><strong>Date:</strong> ${escapeHTML(event.date)}</p>
            <p>${escapeHTML(event.description)}</p>
            <button class="btn-delete"
                data-delete="event"
                data-id="${event.id}">Delete</button>
        </article>
    `).join("") || '<p class="empty-state">No announcements yet.</p>';
}

// Render meetings.
function renderMeetings() {
    const list = document.getElementById("meetingList");

    list.innerHTML = meetings.map(meeting => `
        <article class="event-card">
            <h3>Parent-Teacher Meeting</h3>
            <p><strong>Parent:</strong> ${escapeHTML(meeting.parent)}</p>
            <p><strong>Teacher:</strong> ${escapeHTML(meeting.teacher)}</p>
            <p><strong>Date:</strong> ${escapeHTML(meeting.date)}</p>
            <p><strong>Time:</strong> ${escapeHTML(meeting.time)}</p>
            <p><strong>Agenda:</strong> ${escapeHTML(meeting.agenda)}</p>
            <button class="btn-delete"
                data-delete="meeting"
                data-id="${meeting.id}">Delete</button>
        </article>
    `).join("") || '<p class="empty-state">No meetings scheduled.</p>';
}

// Update dashboard and report counts.
function updateDashboard() {
    document.getElementById("studentCount").textContent = students.length;
    document.getElementById("teacherCount").textContent = teachers.length;
    document.getElementById("messageCount").textContent = messages.length;

    document.getElementById("meetingCount").textContent =
        meetings.filter(meeting => meeting.date >=
            new Date().toISOString().slice(0, 10)).length;

    document.getElementById("announcementCount").textContent = events.length;

    document.getElementById("reportStudents").textContent = students.length;
    document.getElementById("reportTeachers").textContent = teachers.length;
    document.getElementById("reportGrades").textContent = grades.length;

    document.getElementById("reportAttendance").textContent =
        attendanceRecords.length;
}

// Register a parent.
document.getElementById("parentForm").addEventListener("submit", event => {
    event.preventDefault();

    parents.push({
        id: nextId(parents),
        name: document.getElementById("parentName").value.trim(),
        email: document.getElementById("parentEmail").value.trim(),
        phone: document.getElementById("parentPhone").value.trim(),
        child: document.getElementById("childName").value.trim()
    });

    saveData();
    renderParents();
    updateDashboard();
    event.target.reset();
});

// Register a teacher.
document.getElementById("teacherForm").addEventListener("submit", event => {
    event.preventDefault();

    teachers.push({
        id: nextId(teachers),
        name: document.getElementById("teacherName").value.trim(),
        email: document.getElementById("teacherEmail").value.trim(),
        subject: document.getElementById("teacherSubject").value.trim(),
        className: document.getElementById("teacherClass").value.trim()
    });

    saveData();
    renderTeachers();
    updateDashboard();
    event.target.reset();
});

// Send a message.
document.getElementById("messageForm").addEventListener("submit", event => {
    event.preventDefault();

    messages.push({
        id: nextId(messages),
        sender: document.getElementById("messageSender").value.trim(),
        receiver: document.getElementById("messageReceiver").value.trim(),
        subject: document.getElementById("messageSubject").value.trim(),
        body: document.getElementById("messageBody").value.trim(),
        date: new Date().toLocaleString()
    });

    saveData();
    renderMessages();
    updateDashboard();
    event.target.reset();
});

// Record a grade.
document.getElementById("gradeForm").addEventListener("submit", event => {
    event.preventDefault();

    grades.push({
        id: nextId(grades),
        student: document.getElementById("gradeStudent").value.trim(),
        subject: document.getElementById("gradeSubject").value.trim(),
        marks: Number(document.getElementById("gradeMarks").value)
    });

    saveData();
    renderGrades();
    updateDashboard();
    event.target.reset();
});

// Record attendance.
document.getElementById("attendanceForm").addEventListener("submit", event => {
    event.preventDefault();

    attendanceRecords.push({
        id: nextId(attendanceRecords),
        student: document.getElementById("attendanceStudent").value.trim(),
        date: document.getElementById("attendanceDate").value,
        status: document.getElementById("attendanceStatus").value
    });

    saveData();
    renderAttendance();
    updateDashboard();
    event.target.reset();
});

// Add fee record.
document.getElementById("feeForm").addEventListener("submit", event => {
    event.preventDefault();

    fees.push({
        id: nextId(fees),
        student: document.getElementById("feeStudent").value.trim(),
        type: document.getElementById("feeType").value.trim(),
        amount: Number(document.getElementById("feeAmount").value),
        status: document.getElementById("feeStatus").value
    });

    saveData();
    renderFees();
    event.target.reset();
});

// Publish an event.
document.getElementById("eventForm").addEventListener("submit", event => {
    event.preventDefault();

    events.push({
        id: nextId(events),
        title: document.getElementById("eventTitle").value.trim(),
        date: document.getElementById("eventDate").value,
        description: document.getElementById("eventDescription").value.trim()
    });

    saveData();
    renderEvents();
    updateDashboard();
    event.target.reset();
});

// Schedule a meeting.
document.getElementById("meetingForm").addEventListener("submit", event => {
    event.preventDefault();

    meetings.push({
        id: nextId(meetings),
        parent: document.getElementById("meetingParent").value.trim(),
        teacher: document.getElementById("meetingTeacher").value.trim(),
        date: document.getElementById("meetingDate").value,
        time: document.getElementById("meetingTime").value,
        agenda: document.getElementById("meetingAgenda").value.trim()
    });

    saveData();
    renderMeetings();
    updateDashboard();
    event.target.reset();
});

// Delete records.
document.addEventListener("click", event => {
    const button = event.target.closest("[data-delete]");

    if (!button) {
        return;
    }

    const id = Number(button.dataset.id);
    const type = button.dataset.delete;

    const collections = {
        parent: [parents, renderParents],
        teacher: [teachers, renderTeachers],
        message: [messages, renderMessages],
        grade: [grades, renderGrades],
        attendance: [attendanceRecords, renderAttendance],
        fee: [fees, renderFees],
        event: [events, renderEvents],
        meeting: [meetings, renderMeetings]
    };

    const collection = collections[type];

    if (!collection) {
        return;
    }

    if (!confirm("Are you sure you want to delete this record?")) {
        return;
    }

    const [records, render] = collection;
    const index = records.findIndex(record => record.id === id);

    if (index !== -1) {
        records.splice(index, 1);
        saveData();
        render();
        updateDashboard();
    }
});

// Export summary records as CSV.
document.getElementById("exportReport").addEventListener("click", () => {
    const rows = [
        ["Report", "Count"],
        ["Students", students.length],
        ["Teachers", teachers.length],
        ["Messages", messages.length],
        ["Grades", grades.length],
        ["Attendance Records", attendanceRecords.length],
        ["Fee Records", fees.length],
        ["Meetings", meetings.length],
        ["Events", events.length]
    ];

    const csv = rows.map(row =>
        row.map(value =>
            `"${String(value).replace(/"/g, '""')}"`
        ).join(",")
    ).join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "parent-teacher-report.csv";
    link.click();

    URL.revokeObjectURL(url);
});

// Display current date.
document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

// Render all records on startup.
function initialiseApp() {
    renderParents();
    renderTeachers();
    renderStudents();
    renderMessages();
    renderGrades();
    renderAttendance();
    renderFees();
    renderEvents();
    renderMeetings();
    updateDashboard();

    // Set date fields to today's date.
    document.getElementById("attendanceDate").value =
        new Date().toISOString().slice(0, 10);

    document.getElementById("eventDate").value =
        new Date().toISOString().slice(0, 10);

    document.getElementById("meetingDate").value =
        new Date().toISOString().slice(0, 10);
}

initialiseApp();