import express from "express";
import cors from "cors";
import connectDB from "./database.js";

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());





// -----LOGIN -----

app.post("/login", async (req, res) => {
  console.log("posting");

  let db = await connectDB();
  let volonteri = db.collection("Volonteri");

  let filter = {
    email: req.body.email,
    password: req.body.password,
  };
  let projection = {
    _id: 0,
    ime: 1,
    prezime: 1,
    godine: 1,
    broj_aktivnosti: 1,
    broj_volonterskih_sati: 1
  };

  let volonter = await volonteri.findOne(filter, { projection });

  res.status(201);
  res.send(volonter);
});




// ----- loginAdmin -----

app.post("/loginAdmin", async (req, res) => {
  console.log("posting");

  let db = await connectDB();
  let admins = db.collection("Admins");

  let filter = {
    email: req.body.email,
    password: req.body.password,
  };
  let projection = {
    _id: 0,
    ime: 1,
    prezime: 1,
    godine: 1,
    email: 1,
    pozicija: 1,
  };

  let admin = await admins.findOne(filter, { projection });

  res.status(201);
  res.send(admin);
});




// REGISTER

app.post("/register", async (req, res) => {
  console.log("posting");

  let db = await connectDB();
  let volonteri = db.collection("Volonteri");
  let dobne=db.collection("Dobne_skupine_rada");

  let volonter = {
    ime: req.body.ime,
    prezime: req.body.prezime,
    godine:parseInt(req.body.godine),
    email: req.body.email,
    password: req.body.password,
    broj_aktivnosti: 0,
    broj_volonterskih_sati: 0,
  };

  let filter = {
    email: req.body.email,
  };
  let projection = {
    email: 1,
  };

 let volonter_dobne={
  email:req.body.email,
  dobne_skupine_rada:[]
 }

  let exist = await volonteri.findOne(filter, { projection });

  if (exist) {
    res.status(201);
    res.send("Korisnik već postoji");
  } else {
    await dobne.insertOne(volonter_dobne,function(e,res){
      if(e) throw e;

      else console.log("Upiješan unos u dobne skupine");
    });
    await volonteri.insertOne(volonter, function (e, res) {
      if (e) throw e;
    
      console.log("uspiješnan upis volontera");
    });

    res.status(201);
    res.send("Volonter registriran");
  }
});




// -----register admin-----

app.post("/registerAdmin", async (req, res) => {
  console.log("posting");

  let db = await connectDB();
  let admini = db.collection("Admins");

  let newAdmin = {
    ime: req.body.ime,
    prezime: req.body.prezime,
    godine: req.body.godine,
    email: req.body.email,
    pozicija: req.body.pozicija,
    password: "admin1234",
  };

  let filter = {
    email: req.body.email,
  };
  let projection = {
    email: 1,
  };
  let exist = await admini.findOne(filter, { projection });

  if (exist) {
    res.status(201);
    res.send("Administrator već postoji");
  } else {
    await admini.insertOne(newAdmin, function (e, res) {
      if (e) throw e;

      console.log("uspiješnan upis admin");
    });

    res.status(201);
    res.send("Administrator registriran");
  }
});





// ----- find volonter by email-----
app.post("/volonterInfo", async (req, res) => {
  let db = await connectDB();
  let volonteri = db.collection("Volonteri");

  let filter = {
    email: req.body.email,
  };
  let projection = {
    _id: 0,
    ime: 1,
    prezime: 1,
    godine: 1,
    broj_aktivnosti: 1,
    broj_volonterskih_sati: 1,
  };

  let volonter = await volonteri.findOne(filter, { projection });

  res.status(201);
  res.send(volonter);
});




// -----update volonter -----

app.put("/updateVolonter", async (req, res) => {
  let db = await connectDB();
  let volonteri = db.collection("Volonteri");

  let update = false;

  let query = {
    email: req.body.email,
  };

  let volonter = await volonteri.findOne(query);

  let promjene = {
    $set: {
      ime: req.body.new_ime,
      prezime: req.body.new_prezime,
      godine: parseInt(req.body.new_godine),
      password: req.body.new_password,
    },
  };

  if (volonter) {
    let updateVolonter = await volonteri.updateOne(query, promjene);

    console.log("Promijenjeni osobni podaci volontera");
    update = true;
  } else console.log("greška pri izmijeni podataka");

  res.status(201);
  res.send(update);
});




// ----- update Admin-----
app.put("/updateAdmin", async (req, res) => {
  let db = await connectDB();
  let admins = db.collection("Admins");

  let update = false;

  let query = {
    email: req.body.email,
  };

  let admin = await admins.findOne(query);

  let promjene = {
    $set: {
      ime: req.body.new_ime,
      prezime: req.body.new_prezime,
      godine: req.body.new_godine,
      pozicija: req.body.new_pozicija,
      password: req.body.new_password,
    },
  };

  if (admin) {
    let updateAdmin = await admins.updateOne(query, promjene);

    console.log("Promijenjeni osobni podaci administratora");
    update = true;
  } else "greška pri izmijeni podataka";

  res.status(201);
  res.send(update);
});




// ----- Prikaz svih  aktivnosti -----

app.post("/aktivnostiAll", async (req, res) => {
  let db = await connectDB();
  let aktivnostiCol = db.collection("Aktivnosti");

  let projection = {
    projection: {
      _id: 1,
      datum: {
        $dateToString: { format: "%Y-%m-%d", date: "$datum" },
      },
      opis: 1,
      oblik_rada: 1,
      admin: 1,
      volonteri: 1,
      sati: 1,
    },
  };

  let sort = {
    datum: -1,
  };

  let aktivnosti = await aktivnostiCol
    .find({}, projection)
    .sort(sort)
    .toArray();

  res.send(aktivnosti);
});





//--- aktivnosti po volonteru

app.post("/aktivnostiVolonter", async (req, res) => {
  let db = await connectDB();
  let aktivnostiCol = db.collection("Aktivnosti");

  let vol_email = req.body.email;

  const pipeline = [
    {
      $match: {
        volonteri: { $in: [vol_email] },
      },
    },
    {
      $sort: {
        datum: -1,
      },
    },
    {
      $project: {
        datum: { $dateToString: { format: "%Y-%m-%d", date: "$datum" } },
        opis: 1,
        oblik_rada: 1,
        volonteri: 1,
        admin: 1,
        sati: 1,
      },
    },
  ];

  const result = await aktivnostiCol.aggregate(pipeline).toArray();

  res.send(result);
});




// ----- update volonter sati i br akt -----

app.put("/updateSati", async (req, res) => {
  const db = await connectDB();
  let aktivnostiCol = db.collection("Aktivnosti");
  let volonteri = db.collection("Volonteri");

  let vol_email = req.body.email;

  let pipeline = [
    {
      $match: {
        volonteri: { $in: [vol_email] },
      },
    },
  ];

  let aktivnosti = await aktivnostiCol.aggregate(pipeline).toArray();
  let br_sati = 0;
  let br_akt = 0;
  let update = false;

  for (let akt of aktivnosti) {
    br_akt += 1;
    br_sati += akt.sati;
    update = true;
  }

  let promjene = {
    $set: {
      broj_volonterskih_sati: br_sati,
      broj_aktivnosti: br_akt,
    },
  };

  let vol_query = {
    email: vol_email,
  };

  let volonter = await volonteri.findOne(vol_query);

  if (volonter) {
    let updateVolonter = await volonteri.updateOne(vol_query, promjene);

    console.log("Promijenjeni osobni podaci volontera");
    update = true;
  } else console.log("greška pri izmijeni podataka");

 
  console.log(br_akt);
  console.log(br_sati);
res.send(update);

});



//----- prikaz sati i aktivnosti volontera u ovoj godini

app.post("/volonterCurrentYear", async (req, res) => {
  let db = await connectDB();
  let aktivnosti = db.collection("Aktivnosti");
  let volonteri = db.collection("Volonteri");

  let volonter = {
    ime: "",
    prezime: "",
    godine: "",
    email: req.body.email,
    broj_aktivnosti: 0,
    broj_volonterskih_sati: 0,
  };

  let currentYear = new Date().getFullYear();

  let vol_email = req.body.email;

  let vol_q = {
    email: req.body.email,
  };

  let vol_p = {
    projection: {
      _id: 0,
      ime: 1,
      prezime: 1,
      godine: 1,
      email: 1,
      broj_aktivnosti: 1,
      broj_volonterskih_sati: 1,
    },
  };

  let vol = await volonteri.findOne(vol_q, vol_p);

  if (vol) volonter = vol;

  let pipeline = [
    {
      $match: {
        volonteri: { $in: [vol_email] },
        datum: {
          $gte: new Date(currentYear, 0, 1),
          $lt: new Date(currentYear + 1, 0, 1),
        },
      },
    },
  ];

  let aktivnost = await aktivnosti.aggregate(pipeline).toArray();

  let br_akt = 0;
  let br_sati = 0;
  let update = false;

  for (let akt of aktivnost) {
    br_akt += 1;
    br_sati += akt.sati;
    update = true;
  }

  volonter.broj_aktivnosti = br_akt;
  volonter.broj_volonterskih_sati = br_sati;

  res.send(volonter);
});





// ----- prikaz sati i aktivnosti volontera i prošloj godini-----


app.post("/volonterLastYear", async (req, res) => {
  let db = await connectDB();
  let aktivnosti = db.collection("Aktivnosti");
  let volonteri = db.collection("Volonteri");

  let volonter = {
    ime: "",
    prezime: "",
    godine: "",
    email: req.body.email,
    broj_aktivnosti: 0,
    broj_volonterskih_sati: 0,
  };

  let lastYear = new Date().getFullYear() -1;

  let vol_email = req.body.email;

  let vol_q = {
    email: req.body.email,
  };

  let vol_p = {
    projection: {
      _id: 0,
      ime: 1,
      prezime: 1,
      godine: 1,
      email: 1,
      broj_aktivnosti: 1,
      broj_volonterskih_sati: 1,
    },
  };

  let vol = await volonteri.findOne(vol_q, vol_p);

  if (vol) volonter = vol;

  let pipeline = [
    {
      $match: {
        volonteri: { $in: [vol_email] },
        datum: {
          $gte: new Date(lastYear, 0, 1),
          $lt: new Date(lastYear + 1, 0, 1),
        },
      },
    },
  ];

  let aktivnost = await aktivnosti.aggregate(pipeline).toArray();

  let br_akt = 0;
  let br_sati = 0;
  let update = false;

  for (let akt of aktivnost) {
    br_akt += 1;
    br_sati += akt.sati;
    update = true;
  }

  volonter.broj_aktivnosti = br_akt;
  volonter.broj_volonterskih_sati = br_sati;

  res.send(volonter);
});


app.post("/addAktivnost",async (req,res)=>{

  let db=await connectDB();
  let aktivnosti=db.collection("Aktivnosti");

  let datumString=req.body.datum;

  let datum=new Date(datumString);

  let new_akt={
    datum:datum,
    opis:req.body.opis,
    oblik_rada:req.body.oblik_rada,
    volonteri:req.body.volonteri,
    admin:req.body.admin,
    sati:req.body.sati
  }

  let checkAktivnosti=await aktivnosti.findOne(new_akt);

  if(checkAktivnosti){
    res.send("Aktivnost već unesena");
  }
  else{
  await aktivnosti.insertOne(new_akt);
  res.send("upijesan Unos");
  }


});


// ----- update dobnih skupina rada -----

app.put("/updateDobneSkupine", async(req,res)=>{


  let db= await connectDB();
  let dobne=db.collection("Dobne_skupine_rada");

  let query={
    email:req.body.email
  };

  let promjene={
    $set:{
      dobne_skupine_rada:req.body.dobne_skupine_rada
     }
  };
  

  await dobne.updateOne(query,promjene);

  res.status(201);

  let volonter = await dobne.findOne(query);
  res.send(volonter);

});


// -----dobne skupine volontera-----

app.post("/dobneVolontera",async(req,res)=>{

  let db=await connectDB();
  let dobneRada=db.collection("Dobne_skupine_rada");

  let filetr={
    email:req.body.email
  };

  let dobne_volonter=await dobneRada.findOne(filetr);

  res.send(dobne_volonter);
});




//----- prikaz dobnih skupina -----

app.get("/dobneSkupine", async (req,res)=>{

  let db=await connectDB();
  let dobne=db.collection("Dobne_skupine");

  let p={
    projection:{
      _id:1,
      dobna_skupina:1
    }
  };

  let listaSkupina=await dobne.find({},p).toArray();

  res.send(listaSkupina);
});

app.listen(port, () => {
  console.log("listening on port", port);
});
