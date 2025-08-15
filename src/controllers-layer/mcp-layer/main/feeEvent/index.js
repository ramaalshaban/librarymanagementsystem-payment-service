module.exports = (headers) => {
  // FeeEvent Db Object Rest Api Router
  const feeEventMcpRouter = [];
  // getFeeEvent controller
  feeEventMcpRouter.push(require("./get-feeevent")(headers));
  // createFeeEvent controller
  feeEventMcpRouter.push(require("./create-feeevent")(headers));
  // updateFeeEvent controller
  feeEventMcpRouter.push(require("./update-feeevent")(headers));
  // deleteFeeEvent controller
  feeEventMcpRouter.push(require("./delete-feeevent")(headers));
  // listFeeEvents controller
  feeEventMcpRouter.push(require("./list-feeevents")(headers));
  return feeEventMcpRouter;
};
