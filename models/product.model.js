import { ObjectId } from 'mongodb';
import { getDb } from "../util/mongodb";

export default class Product {
 constructor(title, imageUrl, price, description, userId, id) {
  this.title = title;
  this.imageUrl = imageUrl;
  this.price = price;
  this.description = description;
  this._id = id ? new ObjectId(id) : null;
  this.userId = userId
 }

 // CREATE & UPDATE PRODUCT METHOD
 insert() {
  let dbOp;
  if (this._id) {
   // UPDATE
   dbOp = getDb().collection('products').updateOne({ _id: this._id }, { $set: this });
  } else {
   // CREATE
   dbOp = getDb().collection('products').insertOne(this);
  }
  return dbOp.then((result) => {
   // console.log("file: product.model.js:24 ~ Product ~ returndbOp.then ~ result:", result);
   return result;
  }).catch((err) => {
   console.log("file: product.model.js:27 ~ Product ~ returndbOp.then ~ err:", err);
  })
 }

 // READ ALL PRODUCTS METHOD
 static fetchAll() {
  return getDb().collection('products').find().toArray().then((result) => {
   // console.log("file: product.model.js:27 ~ Product ~ returngetDb ~ result:", result);
   return result;
  }).catch((err) => {
   console.log("file: product.model.js:30 ~ Product ~ returngetDb ~ err:", err);
  })
 }

 // READ SINGLE PRODUCT METHOD
 static fetchById(prodId) {
  return getDb().collection('products').findOne({ _id: new ObjectId(prodId) }).then((result) => {
   // console.log("file: product.model.js:37 ~ Product ~ returngetDb ~ result:", result);
   return result;
  }).catch((err) => {
   console.log("file: product.model.js:40 ~ Product ~ returngetDb ~ err:", err);
  })
 }

 // DELETE SINGLE PRODUCT METHOD
 static deleteById(prodId) {
  // return getDb().collection('products').deleteOne({ _id: new ObjectId(prodId) }).then((result) => {
  //  // console.log("file: product.model.js:54 ~ Product ~ returngetDb ~ result:", result);
  //  return result;
  // }).catch((err) => {
  //  console.log("file: product.model.js:57 ~ Product ~ returngetDb ~ err:", err);
  // })

  // IF THE PRODUCT IS DELETED AND THIS DELETED PRODUCT IS PART OF ANY USER; DELETE PRODUCT FROM USER'S CART TOO
  return getDb().collection('products').deleteOne({ _id: new ObjectId(prodId) }).then((result) => {
   // console.log("file: product.model.js:63 ~ Product ~ getDb ~ result:", result);
   return getDb().collection('users').updateMany({}, { $pull: { 'cart.items': { productId: new ObjectId(prodId) } } })
  }).then((result) => {
   // console.log("file: product.model.js:64 ~ Product ~ returngetDb ~ result==Cart Item Deleted:", result);
   return result;
  }).catch((err) => {
   console.log("file: product.model.js:68 ~ Product ~ getDb ~ err:", err);
  })
 }
}