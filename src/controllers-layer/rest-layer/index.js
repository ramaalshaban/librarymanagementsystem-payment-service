const mainRouters = require("./main");
const sessionRouter = require("./session-router");
module.exports = {
  ...mainRouters,
  PaymentServiceRestController: require("./PaymentServiceRestController"),
  ...sessionRouter,
};
