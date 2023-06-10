import express from "express";
import cors from "cors";
import connectDB from "./database.js";

const app = express();
const port = 3001;

const adminUser = {
  ime: 'Matia',
  prezime: 'Perčić',
  email: 'mpercic@gmail.com',
  password: 'percic'
};

app.use(express.json());
app.use(cors());



app.get("/volonteri", (req, res) => {
  console.log("working");

  let volonteri = [
    {
      ime: 'Ivo',
      prezime: 'Ivić',
      email: 'iivić@gmail.com',
      godine: 22,
      br_aktivnosti: 5,
      br_sati: 12
    },
    {
      ime: 'Marko',
      prezime: 'Marković',
      email: 'mmarković@gmail.com',
      godine: 21,
      br_aktivnosti: 2,
      br_sati: 4
    }
  ];
  
  res.send(volonteri);
});

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

app.listen(port, () => {
  console.log('listening on port', port);
});
