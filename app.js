const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const routePath = require("./util/path");
const User = require("./models/user");

const errorController = require("./controllers/error");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(routePath, "public")));

app.use((req, res, next) => {
  User.findById("64c9350e7914d2c64d8f1d94")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://mohamed_7428:Mo5556545@cluster0.nznrjuo.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const newUser = new User({
          name: "Mohamed",
          email: "test@test.com",
          cart: { items: [] },
        });
        newUser.save();
      }
    });
    console.log("Connected to DB!");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
