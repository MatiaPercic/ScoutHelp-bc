import express from "express";
import cors from "cors";
import connectDB from "./database.js";

const app = express();
const port = 3001;



app.use(express.json());
app.use(cors());



// -----LOGIN -----

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



// ----- loginAdmin -----

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


// REGISTER

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



// -----register admin-----

app.post("/registerAdmin", async (req,res)=>{

  console.log("posting");
  
  let db=await connectDB();
  let admini=db.collection("Admins");
  
  let newAdmin ={
  
    'ime':req.body.ime,
    'prezime':req.body.prezime,
    'godine':req.body.godine,
    'email':req.body.email,
    'pozicija':req.body.pozicija,
    'password':'admin1234'
  
  };
  
  let filter={
    'email':req.body.email
  };
  let projection={
  'email':1
  };
  let exist=await admini.findOne(filter,{projection});
  
  if(exist){
  
  res.status(201);
  res.send("Administrator već postoji");
  }
  else{
  await admini.insertOne(newAdmin, function(e,res){
      if(e) throw e
  
      console.log("uspiješnan upis admin");
  });
  
  res.status(201);
  res.send("Administrator registriran");
  }
  
  });
  


// find volonter by email
app.post("/volonterInfo", async (req,res)=>{
  

  let db = await connectDB();
  let volonteri = db.collection("Volonteri");  

  let filter = {
    'email': req.body.email,
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





// update volonter 

app.put("/updateVolonter", async (req,res)=>{

let db=await connectDB();
let volonteri=db.collection("Volonteri");

let update=false;

let query = {
  'email': req.body.email,
};


let promjene = {
  $set: {
    'ime': req.body.new_ime,
    'prezime':req.body.new_prezime,
    'godine':req.body.new_godine,
    'password':req.body.new_password,
  }
};



let updateVolonter= await volonteri.updateOne(query,promjene);

console.log("Promijenjeni osobni podaci volontera");
update=true;


res.status(201);
res.send(update);



});




app.listen(port, () => {
  console.log('listening on port', port);
});
