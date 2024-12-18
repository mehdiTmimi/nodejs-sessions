const express = require("express")
const UserPersistence = require("./persistence.js")
const bodyParser = require("body-parser")
const User = require("./User.js")
const userPersistence = new UserPersistence("./database.json")

const main = async () => {
    try {
        await userPersistence.load1()
        const app = express()

        //app.use(bodyParser.json())
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
        app.post("/users", bodyParser.json(),
            (req, res, next) => {
                let { id, name, city } = req.body
                if (id && name && city)
                    return next()
                res.status(400)
                res.json({
                    message: "please fill all the required fields"
                })
            }, (req, res) => {
                let { id, name, city } = req.body
                let user = new User(id, name, city)
                userPersistence.insert(user)
                    .then(() => {
                        res.status(201)
                        res.json(user)
                    })
                    .catch(e => {
                        console.error(e)
                        res.status(400)
                        res.json({
                            message: "id already exist",
                            id: req.body.id
                        })
                    })
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