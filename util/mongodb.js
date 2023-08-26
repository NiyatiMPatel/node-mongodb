import { MongoClient } from 'mongodb';
// import * as dotenv from "dotenv";
// dotenv.config();


// COMPLETE SERVER ADDRESS => USERNAME:PASSWORD@CLUSTERNAME.SERVERPLACEMENT/DBNAME?/PERMISSION ---> ATLAS CLUSTER CONNECTION
// const encodedPassword = encodeURIComponent(process.env.PASSWORD);
// const uri = `mongodb+srv://patelnitie:${encodedPassword}@cluster1-udemynodejsmax.4ajeyvg.mongodb.net/ecommerce?retryWrites=true&w=majority`;

// LOCAL CONNECTION
const uri = 'mongodb://127.0.0.1:27017/ecommerce'

let _db;
// CLIENT CONNECTION AND STORING CONNECTION TO DATABASE -- KEEPS RUNNING
export const mongoConnect = (callback) => {
 MongoClient.connect(uri).then((client) => {
  // console.log("file: mongodb.js:7 ~ MongoClient.connect ~ Client Connected!:", client);
  _db = client.db() // ACCESS/CONNECTION TO DATABASE -> ecommerce
  callback();
 }).catch((err) => {
  console.log("file: mongodb.js ~ MongoClient.connect ~ err:", err);
  throw err;
 });
};

// ACCESS TO DATABASE CONNECTION
export const getDb = () => {
 if (_db) {
  return _db
 }
 throw 'No database found'
}