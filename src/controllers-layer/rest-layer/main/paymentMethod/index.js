const express = require("express");

// PaymentMethod Db Object Rest Api Router
const paymentMethodRouter = express.Router();

// add PaymentMethod controllers

// listethods controller
paymentMethodRouter.get("/listethods", require("./listethods"));

module.exports = paymentMethodRouter;
