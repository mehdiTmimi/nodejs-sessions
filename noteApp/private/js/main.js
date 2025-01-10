const urlRestApi = "http://localhost:3000/notes"
saveBtn.addEventListener("click", async () => {
    // verification des donnees
    const id = idInput.value
    const value = valueInput.value
    if (!id || !value)
        return alert("tous les champs sont obligatoires")

    loadingDiv.classList.remove("hidden")
    const newNote = {
        id, value
    }
    try {
        const response = await fetch(urlRestApi, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newNote)
        })
        if (response.status >= 200 && response.status < 300) {
            addNoteToTable(newNote)
            idInput.value = ""
            valueInput.value = ""
        }
        else {
            let body = await response.json()
            alert(body.msg)
        }
    }
    catch (e) {
        console.error(e)
        alert("error")
    }
    loadingDiv.classList.add("hidden")
})
const loadData = () => {
    // affichez un loading
    loadingDiv.classList.remove("hidden")
    tbody.innerHTML = ""
    // fetch data from server
    fetch(urlRestApi)
        .then(response => response.json())  // parse data from json to object
        .then(body => {
            body.forEach(note => {
                addNoteToTable(note)
            });
        })
        .catch(e => {
            console.error(e)
            alert("erreur")
        })
        .finally(() => loadingDiv.classList.add("hidden"))


    // parcourir data for each note => creer tr + 3 td + button ...
    // cacher le loading
}
const addNoteToTable = note => {
    const ligne = document.createElement("tr")
    const td1 = document.createElement("td")
    const td2 = document.createElement("td")
    const td3 = document.createElement("td")
    const button = document.createElement("button")

    ligne.appendChild(td1)
    ligne.appendChild(td2)
    ligne.appendChild(td3)
    td3.appendChild(button)
    tbody.appendChild(ligne)

    td1.textContent = note.id
    td2.innerHTML = note.value
    button.textContent = "delete"
    button.addEventListener("click", () => {
        if (!confirm("voulez vous vraiment supprimer la note ?"))
            return
        loadingDiv.classList.remove("hidden")
        fetch("http://localhost:3000/notes/" + note.id, {
            method: "DELETE"
        }).then(async response => {
            if (response.status == 200) {
                ligne.remove()
            }
            else {
                let body = await response.json()
                alert(body.msg)
            }
        })
            .catch(e => {
                console.error(e)
                alert("erreur")
            })
            .finally(() => loadingDiv.classList.add("hidden"))

    })
}
loadData()