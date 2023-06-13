import express from "express";
import cors from "cors";
import connectDB from "./database.js";

const app = express();
const port = 3001;



app.use(express.json());
app.use(cors());


app.post("/login", async(req, res) => {
  console.log("posting");

  let db = await connectDB();
  let volonteri = db.collection("Volonteri");  

  let filter = {
    'email': req.body.email,
    'password':req.body.password
  };
  let projection = {
    '_id': 0, 
    'ime': 1, 
    'prezime': 1, 
    'godine': 1, 
    'broj_aktivnosti': 1, 
    'broj_volonterskih_sati': 1
  };
  

  let volonter = await volonteri.findOne(filter, { projection });


  res.status(201);
  res.send(volonter);


});




app.post("/loginAdmin", async(req, res) => {
  console.log("posting");

  let db = await connectDB();
  let admins = db.collection("Admins");  

  let filter = {
    'email': req.body.email,
    'password':req.body.password
  };
  let projection = {
    '_id': 0, 
    'ime': 1, 
    'prezime': 1, 
    'godine': 1, 
    'email': 1, 
    'pozicija': 1
  };
  

  let admin = await admins.findOne(filter, { projection });


  res.status(201);
  res.send(admin);


});



app.post("/register", async(req, res) => {
  console.log("posting");

  let db = await connectDB();
  let volonteri = db.collection("Volonteri");  


  let volonter = {
    
    'ime': req.body.ime, 
    'prezime': req.body.prezime, 
    'godine': req.body.godine, 
    'email':req.body.email,
    'password':req.body.password,
    'broj_aktivnosti': 0, 
    'broj_volonterskih_sati': 0
  };
  
  let filter={
    'email':req.body.email
  };
let projection={
  'email':1
};
  let exist=await volonteri.findOne(filter,{projection});

if(exist){

  res.status(201);
  res.send("Korisnik već postoji");
}
else{
  await volonteri.insertOne(volonter, function(e,res){
      if(e) throw e

      console.log("uspiješnan upis volontera");
  });

  res.status(201);
  res.send("Volonter registriran");
}

});




app.post("findAll",(req,res)=>{


});



app.get("/findAll", async (req,res)=>{


let db = await connectDB();

let aktivnosti = db.collection("Aktivnosti"); 
let volonteri=db.collection("Volonteri");
let admini=db.collection("Admins");
let oblici=db.collection("Oblici_rada");

const pipeline = [
  {
    $lookup: {
      from: 'Volonteri',
      localField: 'volonteri',
      foreignField: '_id',
      as: 'volonterData'
    }
  },
  {
    $unwind: '$volonterData'
  },
  {
    $lookup: {
      from: 'Volonteri',
      localField: 'volonteri',
      foreignField: '_id',
      as: 'volonterPrez'
    }
  },
  {
    $project: {
      _id: 0,
      datum: 1,
      opis:1,
      sati:1,
      volonterPrez: '$volonterPrez.prezime',
      // Include other fields you need from the "Activities" collection
    }
  }
];

const result = await aktivnosti.aggregate(pipeline).toArray();


res.send(result);


});



app.listen(port, () => {
  console.log('listening on port', port);
});
