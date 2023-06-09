import { MongoClient } from 'mongodb';

// Connection URL and database name
let url = 'mongodb+srv://mapercic001:percic001@cluster0.epsld8w.mongodb.net/';

let db=null;

// Create a new MongoClient
let client = new MongoClient(url);

export default async()=> {
    if( !db || !isConnected()){
        await client.connect();
        db=client.db("ScoutHelp");
        console.log("uspiješna veza a bazom");
    }
    else
    console.log("već povezano s bazom");

    return db;

};