const express = require("express");
const expressLayouts = require("express-ejs-layouts"); // Make sure this matches throughout the code
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authMiddleWare = require("./middleware/authMiddleware");
const adminMiddleWare = require("./middleware/adminMiddleware");
const siteMiddleware = require("./middleware/siteMiddleware");
// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });
let server = express();
server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(express.static("public"));

let cookieParser = require("cookie-parser");
server.use(cookieParser());


let session = require("express-session");
server.use(session({ secret: process.env.SECRET}));
server.use(express.urlencoded({ extended: true }));


server.use(siteMiddleware);

let adminProductsRouter = require("./routes/admin/products.controller");
server.use("/admin",authMiddleWare,adminMiddleWare, adminProductsRouter);

let adminCategoreisRouter = require("./routes/admin/categories.controller");
server.use("/admin",authMiddleWare, adminMiddleWare, adminProductsRouter, adminCategoreisRouter);

let homePageRouter = require("./routes/homepage.controller");
server.use(homePageRouter);

let authRouter = require("./routes/auth.controller");
server.use(authRouter);

let shopRouter = require("./routes/shop.controller");
server.use(shopRouter);

//admin panel is accessible at /admin/products

//mongodb connection 
mongoose.connect("mongodb://localhost:27017")
.then(() => {
  console.log("MongoDB connected successfully");
})
.catch((err) => {
  console.error("MongoDB connection failed:", err.message);
})

//starting server
server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});
