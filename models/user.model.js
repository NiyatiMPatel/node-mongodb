import { ObjectId } from 'mongodb';
import { getDb } from "../util/mongodb";

export default class User {
 constructor(username, email, cart, id) {
  this.name = username;
  this.email = email;
  this.cart = cart ? cart : {}
  this._id = id ? new ObjectId(id) : null
  this.cart.items = cart ? cart.items : []
 }

 // CREATE USER METHOD
 insert() {
  getDb().collection('users').insertOne(this).then((result) => {
   // console.log("file: user.model.js:13 ~ User ~ getDb ~ result:", result);
   return result;
  }).catch((err) => {
   console.log("file: user.model.js:16 ~ User ~ getDb ~ err:", err);
  })
 }

 // ADD/UPDATE ITEMS TO CART ASSOCIATED TO USER
 addToCart(product) {
  // CHECK AND FIND IF THE PRODUCT IS ALREADY IN CART
  const cartProductIndex = this.cart.items.findIndex((cp) => {
   return cp.productId.toString() === product._id.toString();
  });

  let newQuantity = 1;
  let updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
   // PRODUCT EXISTS IN CART ALREADY --- JUST UPDATE THE QUANTITY
   newQuantity = this.cart.items[cartProductIndex].quantity + 1;
   updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
   // PRODUCT DOES NOT ESIST IN CART ALREADY --- PUSH/ADD THE PRODUCT TO CART
   updatedCartItems.push({
    productId: new ObjectId(product._id), quantity: newQuantity
   })
  }
  // UPDATE THE CART
  const updatedCart = { items: updatedCartItems };
  return getDb().collection('users').updateOne({ _id: this._id }, { $set: { cart: updatedCart } }).then((result) => {
   // console.log("file: user.model.js:28 ~ User ~ returngetDb ~ result:", result);
   return result
  }).catch((err) => {
   console.log("file: user.model.js:31 ~ User ~ returngetDb ~ err:", err);
  });
 }

 // READ CART ITEMS ASSOCIATED TO USER
 getCart() {
  const productIds = this.cart.items.map((item) => (item.productId));

  return getDb().collection('products').find({ _id: { $in: productIds } }).toArray().then((products) => {
   return products.map((product) => {
    return {
     ...product,
     quantity: this.cart.items.find((item) => (item.productId.toString() === product._id.toString())).quantity
    }
   })
  }).then((result) => {
   // console.log("file: user.model.js:63 ~ User ~ getDb ~ result:", result);
   return result;
  }).catch((err) => {
   console.log("file: user.model.js:63 ~ User ~ getDb ~ err:", err);
  })
 }

 // UPDATE/DELETE THE CART ITEM ASSOCIATED TO USER
 deleteCartItem(productId) {
  const updatedCartItems = this.cart.items.map((item) => {
   // console.log("file: user.model.js ~ User ~ updatedCartItems ~ item:", item);
   if (item.productId.toString() === productId.toString()) {
    if (item.quantity > 0) {
     return { ...item, quantity: item.quantity - 1 }
    }
   }
   return item
  }).filter((item) => {
   return item.quantity > 0
  })
  // UPDATE THE CART
  const updatedCart = { items: updatedCartItems };
  return getDb().collection('users').updateOne({ _id: this._id }, { $set: { cart: updatedCart } }).then((result) => {
   // console.log("file: user.model.js ~ User ~ returngetDb ~ result:", result);
   return result;
  }).catch((err) => {
   console.log("file: user.model.js ~ User ~ returngetDb ~ err:", err);
  });
 }

 // ADD CART ITEMS TO ORDERS THAT IS ASSOCIATED TO USER
 addOrder() {
  return this.getCart().then((products) => {
   const order = {
    items: products,
    user: {
     _id: this._id,
     name: this.name
    }
   }
   return getDb().collection('orders').insertOne(order)
  }).then((result) => {
   // console.log("file: user.model.js:98 ~ User ~ returngetDb ~ result:", result);
   this.cart = {};
   this.cart.items = [];
   return getDb().collection('users').updateOne({ _id: this._id }, { $set: { cart: { items: [] } } })
  }).catch((err) => {
   console.log("file: user.model.js:102 ~ User ~ returngetDb ~ err:", err);
  })
 }

 // READ ORDERS ASSOCIATED TO USER
 getOrders() {
  // CHECK NESTED PROPERTIES BY DEFINING PATH TO THEM
  return getDb().collection('orders').find({ 'user._id': this._id }).toArray().then((result) => {
   // console.log("file: user.model.js:120 ~ User ~ returngetDb ~ result:", result);
   return result
  }).catch((err) => {
   console.log("file: user.model.js:123 ~ User ~ returngetDb ~ err:", err);
  })
 }

 // READ SINGLE USER METHOD
 static fetchById(userId) {
  return getDb().collection('users').findOne({ _id: new ObjectId(userId) }).then((result) => {
   // console.log("file: user.model.js:18 ~ User ~ returngetDb ~ result:", result);
   return result;
  }).catch((err) => {
   console.log("file: user.model.js:21 ~ User ~ returngetDb ~ err:", err);
  })
 }
}