const express = require("express");

// Fee Db Object Rest Api Router
const feeRouter = express.Router();

// add Fee controllers

// getFee controller
feeRouter.get("/fees/:feeId", require("./get-fee"));
// createFee controller
feeRouter.post("/fees", require("./create-fee"));
// updateFee controller
feeRouter.patch("/fees/:feeId", require("./update-fee"));
// deleteFee controller
feeRouter.delete("/fees/:feeId", require("./delete-fee"));
// listFees controller
feeRouter.get("/fees", require("./list-fees"));
// checkoutstartFee controller
feeRouter.patch("/startcheckout/fee/:feeId", require("./checkoutstart-fee"));
// checkoutcompleteFee controller
feeRouter.patch(
  "/completecheckout/fee/:feeId",
  require("./checkoutcomplete-fee"),
);
// checkoutrefreshFee controller
feeRouter.patch(
  "/refreshcheckout/fee/:feeId",
  require("./checkoutrefresh-fee"),
);

module.exports = feeRouter;
