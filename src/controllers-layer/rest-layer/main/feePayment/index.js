const express = require("express");

// FeePayment Db Object Rest Api Router
const feePaymentRouter = express.Router();

// add FeePayment controllers

// getPayment controller
feePaymentRouter.get("/payment/:feePaymentId", require("./get-payment"));
// getPaymentByOrderId controller
feePaymentRouter.get(
  "/paymentbyorderid/:feePaymentId",
  require("./get-paymentbyorderid"),
);
// getPaymentByPaymentId controller
feePaymentRouter.get(
  "/paymentbypaymentid/:feePaymentId",
  require("./get-paymentbypaymentid"),
);
// createPayment controller
feePaymentRouter.post("/payment", require("./create-payment"));
// updatePayment controller
feePaymentRouter.patch("/payment/:feePaymentId", require("./update-payment"));
// listPayments controller
feePaymentRouter.get("/payments", require("./list-payments"));
// deletePayment controller
feePaymentRouter.delete("/payment/:feePaymentId", require("./delete-payment"));

module.exports = feePaymentRouter;
