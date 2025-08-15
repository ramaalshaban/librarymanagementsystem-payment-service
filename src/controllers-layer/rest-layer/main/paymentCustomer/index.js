const express = require("express");

// PaymentCustomer Db Object Rest Api Router
const paymentCustomerRouter = express.Router();

// add PaymentCustomer controllers

// getCustomerByUserId controller
paymentCustomerRouter.get(
  "/paymentcustomers/:userId",
  require("./get-customerbyuserid"),
);
// listCustomers controller
paymentCustomerRouter.get("/customers", require("./list-customers"));

module.exports = paymentCustomerRouter;
