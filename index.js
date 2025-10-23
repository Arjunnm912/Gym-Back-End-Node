const port = 6500;
const express = require("express");

const app = express();
app.get("/",(req,res)=>{
    //console.log("api fetch")
    return res.send("its ok yaar");

})


app.listen(port, ()=>{console.log("Server Connected")})