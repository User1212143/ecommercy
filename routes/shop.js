const express = require("express");

const router = express.Router();

const shopController = require("../controllers/shop");

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:prodId", shopController.getProduct);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.post("/delete-cart", shopController.postDeleteCart);

router.post("/create-order", shopController.postCreateOrder);

router.get("/orders", shopController.getOrders);

// router.get("/checkout", shopController.getCheckout);

module.exports = router;
