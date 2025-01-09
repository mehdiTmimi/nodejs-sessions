const express = require("express")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const fs = require("fs")
const session = require("express-session")
const { registerCallback, loginCallback, isAuthenticated } = require("./authentification")
const PORT = 3000
const bdPathUsers = "./database/user.json"
const app = express()

app.use(session({ secret: "salut uemf", name: "uemf"}))
app.use(bodyParser.json())

app.post("/register", registerCallback)
app.post("/login", loginCallback)

app.use(express.static("./public"))
app.use(isAuthenticated)
app.use(express.static("./private"))

app.listen(PORT, (err) => {
    if (err)
        return console.log("erreur", err)
    console.log(`server started at PORT ${PORT}`)
})