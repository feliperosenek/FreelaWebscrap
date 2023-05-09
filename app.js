const express = require('express')
const app = express()
const bot = require("./bot")

async function start(){
//app.get("/", async (req,res)=>{
    const response = await bot()
    res.send(response)
//})
}

start()

app.listen(process.env.PORT || 3000, (err)=>{
    if(err)throw err;
    console.log('Server run!')
})