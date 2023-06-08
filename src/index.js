import express  from "express";
import cors from "cors";

const app=express()
const port=3001

app.use(express.json());
app.use(cors());

app.get("/volonteri",(req,res)=>{
    console.log("working");

    let volonteri= [

        {
            ime:'Ivo',
            prezime: 'Ivić',
            email:'iivić@gmail.com',
            godine: '22',
            br_aktivnosti: '5',
            br_sati:'12'
        },

        {
            ime:'Marko',
            prezime: 'Marković',
            email:'mmarković@gmail.com',
            godine:'21',
            br_aktivnosti:'2',
            br_sati:'4'
        }
    ];
    res.send(volonteri);
});

app.listen(port,()=>{
    console.log('listening on port ',port);
})
