const express = require("express")

const app = express()

app.listen(3000,(err)=>{
    if(err)
        return console.err(err)
    console.log("server started")
})