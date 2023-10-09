const Order = require("../models/order");
const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        products: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/products-list", {
        products: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.prodId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-details", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: user.cart.items,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
  // let fetchedCart;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: productId } });
  //   })
  //   .then((products) => {
  //     let product;
  //     let newQuantity = 1;

  //     if (products.length > 0) {
  //       product = products[0];
  //     }

  //     if (product) {
  //       newQuantity = product.cartItem.quantity + 1;
  //       return fetchedCart.addProduct(product, {
  //         through: {
  //           quantity: newQuantity,
  //         },
  //       });
  //     } else {
  //       Product.findByPk(productId)
  //         .then((product) => {
  //           return fetchedCart.addProduct(product, {
  //             through: {
  //               quantity: newQuantity,
  //             },
  //           });
  //         })
  //         .catch((err) => console.log(err));
  //     }
  //   })
  //   .then((cart) => {
  //     console.log(cart);
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => console.log(err));
  // Product.getProduct(req.body.productId, (product) => {
  //   Cart.addToCart(req.body.productId, product.price);
  // });
};

exports.postDeleteCart = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .deleteProductFromCart(productId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
  // Product.getProduct(productId, (product) => {
  //   Cart.deleteProduct(productId, product.price);
  // });
};

exports.postCreateOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        products: products,
        user: {
          name: req.user.name,
          userId: req.user,
        },
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
