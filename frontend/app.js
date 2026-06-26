const courses = JSON.parse(localStorage.getItem("courses") || "[]")
const documents = JSON.parse(localStorage.getItem("documents") || "[]")

let activeSyllabusCourseIndex = null

function saveState() {
    localStorage.setItem("courses", JSON.stringify(courses))
    localStorage.setItem("documents", JSON.stringify(documents))
}

function showView(id) {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"))
    document.getElementById(id).classList.add("active")

    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"))
    event.target.classList.add("active")
}

function updateHome() {
    document.getElementById("course-count").textContent = courses.length
    document.getElementById("doc-count").textContent = documents.length
}

function addCourse() {
    const input = document.getElementById("course-name")
    if (!input.value.trim()) return

    courses.push({ name: input.value })
    input.value = ""
    saveState()
    renderCourses()
    updateDropdowns()
    updateHome()
}

function renderCourses() {
    const list = document.getElementById("courses-list")
    list.innerHTML = ""

    courses.forEach((c, i) => {
        const div = document.createElement("div")
        div.className = "course-item"
        div.innerHTML = `
            <strong>${c.name}</strong><br>
            <button onclick="openSyllabusModal(${i})">
                ${c.syllabus ? "Edit syllabus" : "Add syllabus"}
            </button>
        `
        list.appendChild(div)
    })
}

function openSyllabusModal(i) {
    activeSyllabusCourseIndex = i
    document.getElementById("modal-title").textContent = courses[i].name
    document.getElementById("syllabus-text").value = courses[i].syllabus?.text || ""
    document.getElementById("syllabus-modal").classList.remove("hidden")
}

function closeSyllabusModal() {
    document.getElementById("syllabus-modal").classList.add("hidden")
}

function saveSyllabus() {
    const text = document.getElementById("syllabus-text").value.trim()
    if (!text) return

    courses[activeSyllabusCourseIndex].syllabus = { text }
    saveState()
    renderCourses()
    closeSyllabusModal()
}

function updateDropdowns() {
    const cs = document.getElementById("course-select")
    const fs = document.getElementById("doc-course-filter")
    cs.innerHTML = ""
    fs.innerHTML = `<option value="all">All courses</option>`

    courses.forEach(c => {
        cs.innerHTML += `<option>${c.name}</option>`
        fs.innerHTML += `<option>${c.name}</option>`
    })
}

function upload() {
    const file = document.getElementById("file").files[0]
    const course = document.getElementById("course-select").value
    if (!file || !course) return

    documents.push({ name: file.name, course })
    saveState()
    renderDocuments(documents)
    updateHome()
}

function renderDocuments(docs) {
    const list = document.getElementById("documents-list")
    list.innerHTML = ""
    docs.forEach(d => {
        list.innerHTML += `
            <div class="document-item">
                ${d.name} <span class="muted">(${d.course})</span>
            </div>
        `
    })
}

function filterDocuments() {
    const v = document.getElementById("doc-course-filter").value
    renderDocuments(v === "all" ? documents : documents.filter(d => d.course === v))
}

renderCourses()
updateDropdowns()
renderDocuments(documents)
updateHome()
