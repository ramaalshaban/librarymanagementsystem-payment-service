const PaymentServiceRestController = require("./PaymentServiceRestController");

module.exports = (name, routeName, req, res) => {
  const restController = new PaymentServiceRestController(
    name,
    routeName,
    req,
    res,
  );
  return restController;
};
