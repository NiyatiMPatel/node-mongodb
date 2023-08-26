import Product from "../models/product.model";

// SHOP GET INDEX
export const getShopIndexProducts = (req, res, next) => {
 Product.fetchAll().then((product) => {
  // console.log("file: customer.controller.js:6 ~ Product.fetchAll ~ product:", product);
  res.render('customer/index', {
   prods: product,
   pageTitle: 'Shop',
   path: '/',
  });
 }).catch((err) => {
  console.log("file: customer.controller.js:13 ~ Product.fetchAll ~ err:", err);
 })

}

// SHOP GET PRODUCTS
export const getShopProducts = (req, res, next) => {
 Product.fetchAll().then((product) => {
  // console.log("file: customer.controller.js:21 ~ Product.fetchAll ~ product:", product);
  res.render('customer/products-list', {
   prods: product,
   pageTitle: 'Products',
   path: '/products',
  });
 }).catch((err) => {
  console.log("file: customer.controller.js:28 ~ Product.fetchAll ~ err:", err);
 })

}

// SHOP GET SINGLE PRODUCT
export const getShopSingleProduct = (req, res, next) => {
 const { id } = req.params
 Product.fetchById(id).then((product) => {
  // console.log("file: customer.controller.js:37 ~ Product.fetchById ~ product:", product);
  res.render('customer/product-detail', {
   prods: product,
   pageTitle: product.title,
   path: '/products',  // FOR NAVIGATION MENU ITEMS TOBE HIGHLIGHTED/SHOWN ACTIVE
  });
 }).catch((err) => {
  console.log("file: customer.controller.js:44 ~ Product.fetchById ~ err:", err);
 })

}

// ================================================ //

// ADD TO CART -- POST
export const postCart = (req, res, next) => {
 const { productId } = req.body;
 Product.fetchById(productId).then((product) => {
  return req.user.addToCart(product)
 }).then((result) => {
  // console.log("file: customer.controller ~ Product.fetchById ~ result:", result);
  res.redirect('/cart')
 }).catch((err) => {
  console.log("file: customer.controller.js:60 ~ Product.fetchById ~ err:", err);
 })
}

// GET CARTS
export const getCart = (req, res, next) => {
 req.user.getCart().then((products) => {
  // console.log("file: customer.controller.js:67 ~ req.user.getCart ~ products:", products);
  res.render('customer/cart', {
   path: '/cart',
   pageTitle: 'Your Cart',
   prods: products
  })
 }).catch((err) => {
  console.log("file: customer.controller.js:74 ~ req.user.getCart ~ err:", err);
 })
}

// DELETE CART ITEM
export const postCartDeleteProduct = (req, res, next) => {
 const { productId } = req.body;
 return req.user.deleteCartItem(productId).then((product) => {
  // console.log("file: customer.controller.js:83 ~ returnreq.user.deleteCartItem ~ product:", product);
  res.redirect('/cart')
 }).catch((err) => {
  console.log("file: customer.controller.js:86 ~ returnreq.user.deleteCartItem ~ err:", err);
 })
}

// ============================================================//

// POST ORDER
export const postOrder = (req, res, next) => {
 req.user.addOrder().then((order) => {
  // console.log("file: customer.controller.js:93 ~ req.user.addOrder ~ order:", order);
  res.redirect('/orders')
 }).catch((err) => {
  console.log("file: customer.controller.js:96 ~ req.user.addOrder ~ err:", err);
 })
}

// GET ORDERS
export const getOrders = (req, res, next) => {
 req.user.getOrders().then((orders) => {
  // console.log("file: customer.controller.js:104 ~ req.user.getOrders ~ orders:", orders);
  res.render('customer/orders', {
   path: '/orders',
   pageTitle: 'Your Order',
   orders: orders
  })
 }).catch((err) => {
  console.log("file: customer.controller.js:107 ~ req.user.getOrders ~ err:", err);

 })
}