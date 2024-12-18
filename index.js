const express = require("express")
const UserPersistence = require("./persistence.js")
const userPersistence = new UserPersistence("./database.json")

const main = async () => {
    try {
        await userPersistence.load1()
        const app = express()

        // tout url sous le format suivant : /users , /users?..... , /users
        // les query param font partie du url
        app.get("/users", (req, res) => {
          
            let users = userPersistence.getAll()
            let limit = req.query.limit || users.list.length
            // il transforme data vers json string puis renvoi une reponse au client
            // rajoute le header content-type:application/json
            res.json({
                users: users.list.filter((ele,index)=>index<limit)
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