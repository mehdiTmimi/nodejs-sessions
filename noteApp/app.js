const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const fs = require("fs")
const session = require("express-session")
const { registerCallback, loginCallback, isAuthenticated } = require("./authentification")
const PORT = 3000

const bdPathNotes = "./database/note.json"
const app = express()

app.use(session({ secret: "salut uemf", name: "uemf"
    , cookie : {
        sameSite:"none"
    }
}))
app.use(bodyParser.json())
app.use(cors())
app.post("/register", registerCallback)
app.post("/login", loginCallback)

app.use(express.static("./public"))
app.use(isAuthenticated)
app.use("/app",express.static("./private"))
app.post("/logout",(req,res)=>{
    req.session.destroy()
    res.json({msg:"logged out successfully"})
})
app.delete("/notes/:id",async (req,res)=>{
    let {id} = req.params
    let data = JSON.parse(await fs.promises.readFile(bdPathNotes))
    let notes = data.notes
    let note = notes.find(ele => ele.id == id)
    if (!note) {
        res.status(400)
        return res.json({
            msg: "id does not exist"
        })
    }
    if(note.idUser != req.session.login)
        {
            res.status(403)
            return res.json({
                msg: "it s not your note"
            })
        }
    notes = notes.filter(ele => ele.id != id)
    notes = {
        "notes" : notes
    }
    await fs.promises.writeFile(bdPathNotes, JSON.stringify(notes,null,3))
    res.status(200)
    res.json({"msg":"ressource deleted"})
})
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