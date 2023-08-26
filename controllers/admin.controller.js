import Product from "../models/product.model";

// CAN USE SAME FILE (add-product.ejs OR edit-product.ejs) TO DO BOTH ADD AND EDIT PRODUCT 

// ADMIN GET ADD PRODUCT FORM PAGE
export const getAdminAddProduct = (req, res, next) => {
 // res.render('admin/add-product', {
 res.render('admin/edit-product', {
  pageTitle: 'Add Product',
  path: '/admin/add-product',
  editing: false,
 });
}

// ADMIN POST ADD PRODUCT
export const postAdminAddProduct = (req, res, next) => {
 const { title, imageUrl, price, description } = req.body
 const product = new Product(title, imageUrl, price, description, req.user._id);
 product.insert().then((result) => {
  // console.log("file: admin.controller.js:19 ~ Product.insert ~ result:", result);
  res.redirect('/admin/products')
 }).catch((err) => {
  console.log("file: admin.controller.js:21 ~ Product.insert ~ err:", err);
 })
}

// ADMIN GET PRODUCTS
export const getAdminProducts = (req, res, next) => {
 Product.fetchAll().then((product) => {
  // console.log("file: admin.controller.js:30 ~ Product.fetchAll ~ product:", product);
  res.render('admin/admin-products', {
   prods: product,
   pageTitle: 'Admin-Products',
   path: '/admin/products',
  });
 }).catch((err) => {
  console.log("file: admin.controller.js:37 ~ Product.fetchAll ~ err:", err);
 })
}

// ADMIN GET EDIT PRODUCT FORM/PAGE
export const getEditAdminProduct = (req, res, next) => {
 const { id } = req.params
 const { edit } = req.query
 if (!edit) {
  return res.redirect('/admin/products')
 }
 Product.fetchById(id).then((product) => {
  // console.log("file: admin.controller.js:49 ~ Product.fetchById ~ product:", product);
  res.render('admin/edit-product', {
   prods: product,
   pageTitle: 'Edit Product',
   path: '/admin/edit-product',
   editing: edit,
  })
 }).catch((err) => {
  console.log("file: admin.controller.js:57 ~ Product.fetchById ~ err:", err);
 })
}

// ADMIN POST UPDATE PRODUCT
export const postAdminUpdatedProduct = (req, res, next) => {
 const { title, imageUrl, price, description, productId } = req.body;
 const product = new Product(title, imageUrl, price, description, req.user._id, productId)
 product.insert().then((product) => {
  // console.log("file: admin.controller.js:67 ~ product.insert ~ product:", product);
  res.redirect('/admin/products')
 }).catch((err) => {
  console.log("file: admin.controller.js:70 ~ product.insert ~ err:", err);
 })
}

// ADMIN DELETE PRODUCT
export const deleteAdminProduct = (req, res, next) => {
 const { productId } = req.body;
 Product.deleteById(productId).then((product) => {
  // console.log("file: admin.controller.js:78 ~ Product.deleteById ~ product:", product);
  res.redirect('/admin/products');
 }).catch((err) => {
  console.log("file: admin.controller.js:81 ~ Product.deleteById ~ err:", err);
 })
}