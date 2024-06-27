requei("dotenv").config()
const { MongoClient } = require("mongodb");


let singleton;

async function connect(){
  if(singleton) return singleton;

  const client = new MongoClient(process.env.MONGO_HOST);
  await client.connect();

  singleton =  client.db(process.env.MONGO_DATABASE);
  return singleton;
}

async function insert(customer){
  const db = await connect();
  const result = await db.collection("customers").insertOne(customer);
  return result;
}


module.exports = {
  insert
}