const express = require("express")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const fs = require("fs")
const PORT = 3000
const bdPathUsers = "./database/user.json"
const app = express()
app.use(bodyParser.json())
app.use(express.static("./public"))
app.post("/register", async (req, res) => {
    // extracter data depuis le body
    const { login, pwd } = req.body

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
                fs.promises.writeFile(bdPathUsers,JSON.stringify(data,null,3))
                .then(()=>{
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
   

   
 

app.listen(PORT, (err) => {
    if (err)
        return console.log("erreur", err)
    console.log(`server started at PORT ${PORT}`)
})