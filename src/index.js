import express  from "express";

const app=express()
const port=3000

app.get('/',(req,res) =>{
    console.log("working")
    res.send('Hello world');
})


app.listen(port,()=>{
    console.log('app listening on port',port);
})
