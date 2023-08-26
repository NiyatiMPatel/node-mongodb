import * as dotenv from "dotenv";

import express from 'express';
import path from 'path';

import bodyParser from 'body-parser';

import rootDir from './util/path';
import { mongoConnect } from "./util/mongodb";

import User from "./models/user.model";

import { get404 } from "./controllers/errors.controller";

import AdminRoute from './routes/admin.router'
import CustomerRoute from './routes/customer.router'

// =================================================== //
dotenv.config();

const app = express();

// create application/json parser
app.use(bodyParser.json())
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

// =================================================== //

// SERVING FILES STATICALLY FOR STATIC FILES ONLY HAS READ ACCESS
app.use(express.static(path.join(rootDir, 'public')))

// =================================================== //

// TEMPLATING ENGINE EJS FOR VIEWS
app.set('view engine', 'ejs');
app.set('views', 'views');

// ==================================================== //
// ASSOCIATING USER TO REQUEST OBJECT
app.use((req, res, next) => {
 User.fetchById('64e8d676770c064006dc87a3').then((user) => {
  // console.log("file: index.js:43 ~ User.fetchById ~ user:", user);
  // req.user = user;  // JUST STORES USER OBJECT WITH PROPERTIRES DATA FROM DB; ALL METHODS FROM USER MODEL WILL NOT BE AVAILABLE
  req.user = new User(user.name, user.email, user.cart, user._id) // ACCESS TO USER PROPERTIES DATA AND METHODS DEFINED IN USER MODEL
  next();
 }).catch((err) => {
  console.log("file: index.js:46 ~ User.fetchById ~ err:", err);
 })
})

// ROUTES
app.use(CustomerRoute);
app.use('/admin', AdminRoute);
// CATCH ALL ROUTES (404 ERROR)
app.use(get404);

// ================================================ //
// INITIAL CHECK
// app.listen(process.env.PORT, () => {
//  return console.log("🚀 ~ file: index.js:9 ~ App listening on port:", process.env.PORT)
// })
// app.get('/', (req, res) => res.send('Hello World!'))

mongoConnect(() => {
 // console.log("file: index.js:46 ~ mongoConnect ~ client:", client);
 app.listen(process.env.PORT);
})