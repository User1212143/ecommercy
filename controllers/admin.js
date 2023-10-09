const mongodb = require("mongodb");

const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imgUrl, price, description } = req.body;
  const product = new Product({
    title,
    price,
    imgUrl,
    description,
    userId: req.user,
  });
  product
    .save()
    .then(() => res.redirect("/admin/products"))
    .catch((err) => {
      console.log(err);
    });
};

exports.getAdminProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("admin/products", {
        products: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  console.log(req.params.productId);
  console.log(req.query.edit);

  Product.findById(req.params.productId)
    .then((product) => {
      res.render("admin/edit-product", {
        path: "/admin/edit-product",
        pageTitle: "Edit Product",
        editing: true,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imgUrl, price, description } = req.body;

  Product.findById(productId)
    .then((product) => {
      product.title = title;
      product.imgUrl = imgUrl;
      product.price = price;
      product.description = description;
      return product.save();
    })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findByIdAndRemove(productId)
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};
