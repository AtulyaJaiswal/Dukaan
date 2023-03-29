const express = require('express');
const app = express();
const cookieParser = require("cookie-parser"); 
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require('dotenv');
const cors = require('cors');
const path = require("path");

const errorMiddleware = require("./middleware/error");

//CONFIG
if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({path: "backend/config/config.env"});
}


//MIDDLEWARE
app.use(cors());
app.use(express.json({
    limit: '50mb'
  }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(fileUpload());

//ROUTE IMPORT
const product = require('./routes/productRoute');
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// USE ON DEPLOYMENT
app.use(express.static(path.join(__dirname, "../frontend/build/index.html")));
app.get("/*", (req,res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build"))
});

//Middleware for ERROR
app.use(errorMiddleware);

module.exports = app;