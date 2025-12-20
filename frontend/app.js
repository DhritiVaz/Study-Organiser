console.log("app.js loaded")
let activeSyllabusCourseIndex = null

const documents = []
const courses = []

function saveState() {
    localStorage.setItem("courses", JSON.stringify(courses))
    localStorage.setItem("documents", JSON.stringify(documents))
}

function loadState() {
    const savedCourses = localStorage.getItem("courses")
    const savedDocuments = localStorage.getItem("documents")

    if (savedCourses) {
        courses.push(...JSON.parse(savedCourses))
    }

    if (savedDocuments) {
        documents.push(...JSON.parse(savedDocuments))
    }
}

async function upload() {
    const courseSelect = document.getElementById("course-select")
const selectedCourse = courseSelect.value

if (!selectedCourse) {
    alert("Please select a course before uploading")
    return
}

    const fileInput = document.getElementById("file")
    const out = document.getElementById("out")

    const file = fileInput.files[0]
    if (!file) {
        out.textContent = "Please select a PDF file"
        return
    }

    out.textContent = "Reading PDF..."

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    let text = ""

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        content.items.forEach(item => {
            text += item.str + " "
        })
        text += "\n\n"
    }

    out.innerHTML = ""
    const docData = {
    name: file.name,
    uploadedAt: new Date().toLocaleString(),
    text,
    course: selectedCourse
}

documents.push(docData)
saveState()
updateDocumentsView()
updateRecentActivity(docData.name)

    text.split("\n\n").forEach(p => {
        if (p.trim().length > 40) {
            const div = document.createElement("div")
            div.className = "paragraph-block"
            div.innerText = p.trim()
            out.appendChild(div)
        }
    })
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("collapsed")
}

function showView(viewId) {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active-view"))
    document.getElementById(viewId).classList.add("active-view")

    document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"))
    document.querySelectorAll(".nav-item").forEach(i => {
        if (i.getAttribute("onclick").includes(viewId)) {
            i.classList.add("active")
        }
    })
}
function updateDocumentsView() {
    const list = document.getElementById("documents-list")
    list.innerHTML = ""

    if (documents.length === 0) {
        list.innerHTML = "<p>No documents uploaded yet.</p>"
        return
    }

    documents.forEach(doc => {
        const div = document.createElement("div")
        div.className = "document-item"

        div.innerHTML = `
            <strong>${doc.name}</strong><br>
            <small>Course: ${doc.course}</small><br>
            <small>Uploaded: ${doc.uploadedAt}</small>
        `

        list.appendChild(div)
    })
}

function updateRecentActivity(fileName) {
    const log = document.getElementById("activity-log")
    log.innerHTML = `<p>Uploaded: <strong>${fileName}</strong></p>`
}
function addCourse() {
    const input = document.getElementById("course-name")
    const name = input.value.trim()

    if (!name) return

    const course = {
        name,
        createdAt: new Date().toLocaleDateString()
    }

    courses.push(course)
    input.value = ""

    saveState()
    updateCoursesView()
    updateCourseDropdown()
}


function updateCourseDropdown() {
    const select = document.getElementById("course-select")
    select.innerHTML = `<option value="">Select course</option>`

    courses.forEach(course => {
        const option = document.createElement("option")
        option.value = course.name
        option.textContent = course.name
        select.appendChild(option)
    })
}
function updateCoursesView() {
    const list = document.getElementById("courses-list")
    list.innerHTML = ""

    if (courses.length === 0) {
        list.innerHTML = "<p>No courses added yet.</p>"
        return
    }

    courses.forEach((course, index) => {
        const count = documents.filter(
            doc => doc.course === course.name
        ).length

        const div = document.createElement("div")
        div.className = "course-item"

        div.innerHTML = `
            <strong>${course.name}</strong><br>
            <small>${count} document${count !== 1 ? "s" : ""}</small><br><br>

           ${
    course.syllabus
        ? `<button onclick="openSyllabusModal(${index})">View / Edit syllabus</button>`
        : `<button onclick="openSyllabusModal(${index})">Add syllabus</button>`
}

        `

        list.appendChild(div)
    })
}


loadState()
updateCoursesView()
function updateDocumentsView() {
    renderDocuments(documents)
    updateDocumentFilter()
}

function renderDocuments(docs) {
    const list = document.getElementById("documents-list")
    list.innerHTML = ""

    if (docs.length === 0) {
        list.innerHTML = "<p>No documents found.</p>"
        return
    }

    docs.forEach(doc => {
        const div = document.createElement("div")
        div.className = "document-item"

        div.innerHTML = `
            <strong>${doc.name}</strong><br>
            <small>Course: ${doc.course}</small><br>
            <small>Uploaded: ${doc.uploadedAt}</small>
        `

        list.appendChild(div)
    })
}

updateCourseDropdown()
function updateDocumentFilter() {
    const select = document.getElementById("doc-course-filter")
    if (!select) return

    select.innerHTML = `<option value="all">All courses</option>`

    courses.forEach(course => {
        const option = document.createElement("option")
        option.value = course.name
        option.textContent = course.name
        select.appendChild(option)
    })
}
function filterDocuments() {
    const filter = document.getElementById("doc-course-filter").value

    let filteredDocs = documents

    if (filter !== "all") {
        filteredDocs = documents.filter(
            doc => doc.course === filter
        )
    }

    renderDocuments(filteredDocs)
}
function updateHomeStats() {
    const courseCount = document.getElementById("course-count")
    const docCount = document.getElementById("doc-count")

    if (courseCount) courseCount.textContent = courses.length
    if (docCount) docCount.textContent = documents.length
}
function addSyllabus(courseIndex) {
    const text = prompt("Paste syllabus text here:")

    if (!text) return

    courses[courseIndex].syllabus = {
        text,
        addedAt: new Date().toLocaleDateString()
    }

    saveState()
    updateCoursesView()
}
function viewSyllabus(courseIndex) {
    const syllabus = courses[courseIndex].syllabus
    if (!syllabus) return

    alert(syllabus.text)
}
function openSyllabusModal(courseIndex) {
    activeSyllabusCourseIndex = courseIndex

    const modal = document.getElementById("syllabus-modal")
    const textarea = document.getElementById("syllabus-text")
    const title = document.getElementById("modal-title")

    const course = courses[courseIndex]

    title.textContent = `Syllabus – ${course.name}`
    textarea.value = course.syllabus?.text || ""

    modal.classList.remove("hidden")
}
function saveSyllabus() {
    if (activeSyllabusCourseIndex === null) return

    const text = document.getElementById("syllabus-text").value.trim()
    if (!text) {
        alert("Syllabus cannot be empty")
        return
    }

    courses[activeSyllabusCourseIndex].syllabus = {
        text,
        addedAt: new Date().toLocaleDateString()
    }

    saveState()
    updateCoursesView()
    closeSyllabusModal()
}
