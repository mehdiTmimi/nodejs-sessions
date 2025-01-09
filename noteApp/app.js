const express = require("express")
const bodyParser = require("body-parser")

const fs = require("fs")
const session = require("express-session")
const { registerCallback, loginCallback, isAuthenticated } = require("./authentification")
const PORT = 3000

const bdPathNotes = "./database/note.json"
const app = express()

app.use(session({ secret: "salut uemf", name: "uemf" }))
app.use(bodyParser.json())

app.post("/register", registerCallback)
app.post("/login", loginCallback)

app.use(express.static("./public"))
app.use(isAuthenticated)
app.use(express.static("./private"))

app.get("/notes", async (req, res) => {
    let data = JSON.parse(await fs.promises.readFile(bdPathNotes))
    let notes = data.notes
    notes = notes.filter(ele => ele.idUser == req.session.login)
    res.json(notes)
})
app.post("/notes", async (req, res) => {
    let { id, value } = req.body
    let data = JSON.parse(await fs.promises.readFile(bdPathNotes))
    let notes = data.notes
    if (notes.find(ele => ele.id == id)) {
        res.status(400)
        return res.json({
            msg: "id already exist"
        })
    }
    const newNote = {
        id, value, idUser: req.session.login
    }
    notes.push(newNote)
    notes = {
        "notes" : notes
    }
    await fs.promises.writeFile(bdPathNotes, JSON.stringify(notes,null,3))
    res.status(201)
    res.json(newNote)
})
app.delete("/notes", (req, res) => {

})
app.listen(PORT, (err) => {
    if (err)
        return console.log("erreur", err)
    console.log(`server started at PORT ${PORT}`)
})