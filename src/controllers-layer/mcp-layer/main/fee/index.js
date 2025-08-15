module.exports = (headers) => {
  // Fee Db Object Rest Api Router
  const feeMcpRouter = [];
  // getFee controller
  feeMcpRouter.push(require("./get-fee")(headers));
  // createFee controller
  feeMcpRouter.push(require("./create-fee")(headers));
  // updateFee controller
  feeMcpRouter.push(require("./update-fee")(headers));
  // deleteFee controller
  feeMcpRouter.push(require("./delete-fee")(headers));
  // listFees controller
  feeMcpRouter.push(require("./list-fees")(headers));
  // checkoutstartFee controller
  feeMcpRouter.push(require("./checkoutstart-fee")(headers));
  // checkoutcompleteFee controller
  feeMcpRouter.push(require("./checkoutcomplete-fee")(headers));
  // checkoutrefreshFee controller
  feeMcpRouter.push(require("./checkoutrefresh-fee")(headers));
  return feeMcpRouter;
};
