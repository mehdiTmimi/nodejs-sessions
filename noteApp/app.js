const express = require("express")
const PORT = 3000

const app = express()

app.listen(PORT,(err)=>{
    if(err)
        return console.log("erreur",err)
    console.log(`server started at PORT ${PORT}`)
})