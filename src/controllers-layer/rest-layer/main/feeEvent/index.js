const express = require("express");

// FeeEvent Db Object Rest Api Router
const feeEventRouter = express.Router();

// add FeeEvent controllers

// getFeeEvent controller
feeEventRouter.get("/feeevents/:feeEventId", require("./get-feeevent"));
// createFeeEvent controller
feeEventRouter.post("/feeevents", require("./create-feeevent"));
// updateFeeEvent controller
feeEventRouter.patch("/feeevents/:feeEventId", require("./update-feeevent"));
// deleteFeeEvent controller
feeEventRouter.delete("/feeevents/:feeEventId", require("./delete-feeevent"));
// listFeeEvents controller
feeEventRouter.get("/feeevents", require("./list-feeevents"));

module.exports = feeEventRouter;
