const express = require("express")
const UserPersistence = require("./persistence.js")
const userPersistence = new UserPersistence("./database.json")

const main = async () => {
    try {
        await userPersistence.load1()
        const app = express()

        app.use((req,res,next)=>{
            let body = ""
            req.on("data",(chunk)=>{
                body+=chunk
            })
            req.on("end",()=>{
                req.body = body
                next()
            })
        })
        // tout url sous le format suivant : /users , /users?..... , /users
        // les query param font partie du url
        app.get("/users", (req, res) => {
            console.log(req.body)
            let users = userPersistence.getAll()
            let limit = req.query.limit || users.list.length
            // il transforme data vers json string puis renvoi une reponse au client
            // rajoute le header content-type:application/json
            res.json({
                users: users.list.filter((ele, index) => index < limit)
            })
        })
        // tout url sous forme de /users/X
        // ppour acceder au X => req.params.X
        app.get("/users/:id", (req, res) => {
            let id = req.params.id
            let user = userPersistence.get(id)
            if (user)
                res.json(user)
            else {
                res.status(404)
                res.json({
                    message: "user not found",
                    id
                })
            }
        })
        app.listen(3000, (err) => {
            if (err)
                return console.err(err)
            console.log("server started")
        })
    }
    catch (e) {
        console.log(e)
    }
}
main()