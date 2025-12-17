async function upload() {
    const f = document.getElementById("file").files[0];
    if (!f) {
        alert("Please select a file");
        return;
    }

    const fd = new FormData();
    fd.append("file", f);

    try {
        const r = await fetch("http://127.0.0.1:8000/upload", {
            method: "POST",
            body: fd
        });

        const result = await r.json();
        document.getElementById("out").textContent = JSON.stringify(result, null, 2);
    } catch (error) {
        document.getElementById("out").textContent = "Error: " + error.message;
    }
}

