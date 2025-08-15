const PaymentServiceMcpController = require("./PaymentServiceMcpController");

module.exports = (name, routeName, params) => {
  const mcpController = new PaymentServiceMcpController(
    name,
    routeName,
    params,
  );
  return mcpController;
};
