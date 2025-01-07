const express = require("express")
const bodyParser = require("body-parser")
const PORT = 3000

const app = express()
app.use(bodyParser.json())
app.use(express.static("./public"))
app.post("/register",(req,res)=>{
    console.log(req.body)
    
})
app.listen(PORT,(err)=>{
    if(err)
        return console.log("erreur",err)
    console.log(`server started at PORT ${PORT}`)
})