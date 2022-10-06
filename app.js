const express = require('express')
const app = express()
const bot = require("./bot")

app.get("/", async (req,res)=>{
    const response = await bot()
    res.send(response)
})

app.listen(process.env.PORT, (err)=>{
    if(err)throw err;
    console.log('Server run!')
})