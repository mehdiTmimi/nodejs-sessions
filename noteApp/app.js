const express = require("express")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const fs = require("fs")
const session = require("express-session")
const PORT = 3000
const bdPathUsers = "./database/user.json"
const app = express()
// localhost:3000/ok
// localhost:3000/ok2
// localhost:3000/ok/20
//app.use("/ok",session({ secret: "salut uemf", name: "uemf"}))
app.use(session({ secret: "salut uemf", name: "uemf"}))
app.use(bodyParser.json())
app.post("/register", async (req, res) => {
    // extracter data depuis le body
    const { login, pwd } = req.body
    if (!login || !pwd) {
        res.status(400)
        return res.json({
            msg: "login and pwd are required!!!!!!!"
        })
    }
    // lire le fichier et le convertir en objet
    let data = await fs.promises.readFile(bdPathUsers)
        .then(data => JSON.parse(data))
    // rechercher le user par login
    let resultat = data.users.find(ele => ele.login == login)

    if (!resultat) // different de undefined
    {
        // on genere le salt, puis on genere le hash, rajouter user en memoire
        // ecrire data dans le fichier et renvoyer un msg de succes
        bcrypt.genSalt()
            .then(salt => bcrypt.hash(pwd, salt))
            .then(hash => {
                let newUser = {
                    login, hash
                }
                data.users.push(newUser)
                fs.promises.writeFile(bdPathUsers, JSON.stringify(data, null, 3))
                    .then(() => {
                        res.status(201)
                        res.json({
                            msg: "user successefully added"
                        })
                    })
            })
    }
    else {
        res.status(400)
        res.json({
            msg: "login already exist",
            login
        })
    }
})
app.post("/login", async (req, res) => {
    // verifier les donnees
    const { login, pwd } = req.body
    if (!login || !pwd) {
        res.status(400)
        return res.json({
            msg: "login and pwd are required!"
        })
    }
    let data = await fs.promises.readFile(bdPathUsers)
        .then(data => JSON.parse(data))
    // rechercher le user par login
    let resultat = data.users.find(ele => ele.login == login)
    if (!resultat) {
        res.status(400)
        return res.json({
            msg: "invalid credentiels"
        })
    }
    if (await bcrypt.compare(pwd, resultat.hash) == true) {
        res.status(200)
        req.session.isConnected = true
        return res.json({
            msg: "successful login"
        })
    }
    else {
        res.status(400)
        return res.json({
            msg: "invalid credentiels"
        })
    }

})

app.use(express.static("./public"))
app.use((req,res,next)=>{
   if(req.session.isConnected)
        next()
    else{
        res.status(401)
        res.json({
            msg:"you need to login first"
        })
    }
},express.static("./private"))





app.listen(PORT, (err) => {
    if (err)
        return console.log("erreur", err)
    console.log(`server started at PORT ${PORT}`)
})